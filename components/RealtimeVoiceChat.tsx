"use client";
import { useRef, useState, FormEvent } from "react";

// Update to match your real policy structure
export interface PolicyDashboard {
  id: string;
  policy_name: string;
  created_at: string;
  session_id: string;
  analysis_data: {
    data: {
      email: string;
      policyOverview: {
        productName: string;
        issuer: string;
      };
      values: Array<{
        values: {
          cashValue: number;
          netSurrenderValue: number;
          deathBenefitAmount: number;
        };
        timePoint: string;
      }>;
      sections: {
        [key: string]: {
          title: string;
          opening: string;
          bullets: Array<{
            title: string;
            content: string;
          }>;
        };
      };
    };
  };
  policyOverview?: {
    issuer: string;
    productName: string;
    productType: string;
    deathBenefit: string;
    annualPremium: string;
  };
}

interface RealtimeVoiceChatProps {
  policyData: PolicyDashboard | null;
}

export default function RealtimeVoiceChat({
  policyData,
}: RealtimeVoiceChatProps) {
  // -- State --
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [captions, setCaptions] = useState("Waiting for AI response...");
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);

  const [userInput, setUserInput] = useState(""); // user text input

  // We'll track the peer connection in a ref
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // ------------- FULL generateInstructionsFromPolicy -------------
  // This function enumerates the entire policy analysis (values, sections, etc.)
  function generateInstructionsFromPolicy(policy: PolicyDashboard): string {
    const data = policy.analysis_data.data;
    let instructions = "";

    // Possibly use the outer policyOverview if available
    if (policy.policyOverview) {
      instructions += `Policy Overview:\n`;
      instructions += `- Product: ${policy.policyOverview.productName}\n`;
      instructions += `- Issuer: ${policy.policyOverview.issuer}\n`;
      instructions += `- Product Type: ${policy.policyOverview.productType}\n`;
      instructions += `- Death Benefit: ${policy.policyOverview.deathBenefit}\n`;
      instructions += `- Annual Premium: ${policy.policyOverview.annualPremium}\n\n`;
    } else {
      instructions += `Policy Overview:\n`;
      instructions += `- Product: ${data.policyOverview.productName}\n`;
      instructions += `- Issuer: ${data.policyOverview.issuer}\n\n`;
    }

    instructions += `Email: ${data.email}\n\n`;

    if (data.values && data.values.length > 0) {
      instructions += "Value Projections:\n";
      data.values.forEach((entry) => {
        instructions += `- ${entry.timePoint}: Cash Value = ${entry.values.cashValue}, Net Surrender Value = ${entry.values.netSurrenderValue}, Death Benefit = ${entry.values.deathBenefitAmount}\n`;
      });
      instructions += "\n";
    }

    if (data.sections && typeof data.sections === "object") {
      instructions += "Sections Analysis:\n";
      const sectionKeys = Object.keys(data.sections);
      sectionKeys.forEach((key, index) => {
        const section = data.sections[key];
        instructions += `Section ${index + 1}: ${section.title}\n`;
        instructions += `Opening: ${section.opening}\n`;
        if (section.bullets && section.bullets.length > 0) {
          instructions += "Bullets:\n";
          section.bullets.forEach((bullet) => {
            instructions += `  - ${bullet.title}: ${bullet.content}\n`;
          });
        }
        instructions += "\n";
      });
    }

    return instructions;
  }
  // ---------------------------------------------------------------

  // --- Start Session ---
  async function startSession() {
    try {
      // 1. Get ephemeral token
      const tokenRes = await fetch("/api/session");
      if (!tokenRes.ok) throw new Error("Failed to fetch token");
      const tokenData = await tokenRes.json();
      const ephemeralKey = tokenData.client_secret.value;

      // 2. Create RTCPeerConnection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // 3. Create audio element for remote audio
      audioElementRef.current = document.createElement("audio");
      audioElementRef.current.autoplay = true;
      pc.ontrack = (event) => {
        if (audioElementRef.current) {
          audioElementRef.current.srcObject = event.streams[0];
        }
      };

      // 4. Get local mic track
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));

      // 5. Create data channel
      const dc = pc.createDataChannel("oai-events");
      setDataChannel(dc);

      // 6. Data channel event handlers
      dc.onopen = () => {
        setIsSessionActive(true);
        console.log("Data channel open");
        // Send session.update with audio+text + instructions
        if (policyData) {
          const instructions = generateInstructionsFromPolicy(policyData);
          const sessionUpdateEvent = {
            type: "session.update",
            session: {
              modalities: ["audio", "text"], // important for text deltas
              instructions,
            },
          };
          dc.send(JSON.stringify(sessionUpdateEvent));
        }
      };

      dc.onmessage = (e) => {
        try {
          const evtData = JSON.parse(e.data);
          if (evtData.type === "response.text.delta") {
            setCaptions((prev) => {
              if (prev === "Waiting for AI response...") {
                return evtData.delta; // start fresh if we haven't begun
              } else {
                return prev + evtData.delta;
              }
            });
          }
        } catch (error) {
          console.error("Error parsing data channel message:", error);
        }
      };

      // 7. Create and set local SDP offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 8. Exchange SDP with the realtime API
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          "Content-Type": "application/sdp",
        },
      });
      if (!sdpResponse.ok) {
        throw new Error(
          `Failed to exchange SDP, status: ${sdpResponse.status}`
        );
      }
      const answerSDP = await sdpResponse.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSDP });
    } catch (err) {
      console.error("Error initializing realtime chat:", err);
      if (err instanceof Error) {
        setConnectionError(err.message);
      } else {
        setConnectionError("Connection error");
      }
    }
  }

  // --- Stop Session ---
  function stopSession() {
    if (dataChannel) {
      dataChannel.close();
    }
    if (pcRef.current) {
      pcRef.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      pcRef.current.close();
      pcRef.current = null;
    }
    setDataChannel(null);
    setIsSessionActive(false);
    setConnectionError("");
    setCaptions("Waiting for AI response...");
  }

  // Send user text message to the model
  function sendTextMessage(e: FormEvent) {
    e.preventDefault();
    if (!dataChannel || !isSessionActive || !userInput.trim()) return;

    // 1. Create conversation.item.create event
    const conversationEvent = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: userInput.trim(),
          },
        ],
      },
    };

    // 2. Send the conversation event
    dataChannel.send(JSON.stringify(conversationEvent));

    // 3. Then request a response
    dataChannel.send(JSON.stringify({ type: "response.create" }));

    // Clear local input
    setUserInput("");
  }

  return (
    <div className="p-6 border rounded-xl bg-white shadow-md">
      {/* Session Controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[rgb(82,102,255)]">
          Realtime Voice Chat
        </h2>
        <div className="space-x-2">
          {!isSessionActive ? (
            <button
              onClick={startSession}
              className="px-4 py-2 rounded-md bg-[rgb(82,102,255)] text-white"
            >
              Start Session
            </button>
          ) : (
            <button
              onClick={stopSession}
              className="px-4 py-2 rounded-md bg-red-500 text-white"
            >
              Stop Session
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {connectionError && (
        <p className="text-red-600 mb-2">Error: {connectionError}</p>
      )}

      {/* Session Active UI */}
      {isSessionActive ? (
        <>
          <p className="mb-2 text-green-600">Connected to realtime API</p>
          <div className="mb-4 flex items-center">
            <div className="w-4 h-4 rounded-full bg-[rgb(82,102,255)] animate-pulse mr-2"></div>
            <span className="text-sm text-gray-800">AI is speaking...</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              AI Closed Captions:
            </h3>
            <p className="text-gray-800 whitespace-pre-wrap">{captions}</p>
          </div>

          {/* Simple user input area for text messages */}
          <form
            onSubmit={sendTextMessage}
            className="flex items-center space-x-2"
          >
            <input
              className="flex-1 p-2 border rounded-md"
              type="text"
              placeholder="Type a message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[rgb(82,102,255)] text-white"
            >
              Send
            </button>
          </form>
        </>
      ) : (
        <p className="text-gray-600">
          Session inactive. Click &quot;Start Session&quot; to begin.
        </p>
      )}
    </div>
  );
}
