"use client";
import { useEffect, useState, useRef } from "react";

export interface PolicyDashboard {
  id: string;
  policy_name: string;
  created_at: string;
  session_id: string;
  // analysis_data contains detailed analysis in its data property.
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
      // In your sample, sections is an object with keys like "keyTopics", etc.
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
  // Sometimes the outer analysis also includes a policyOverview summary.
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
  const [connected, setConnected] = useState(false);
  const [captions, setCaptions] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  // Updated helper to generate detailed instructions.
  const generateInstructionsFromPolicy = (policy: PolicyDashboard): string => {
    const data = policy.analysis_data.data;
    let instructions = "";
    // Use the outer policyOverview if available; otherwise fall back to data.policyOverview.
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
      Object.keys(data.sections).forEach((key, index) => {
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
  };

  useEffect(() => {
    if (pcRef.current) return; // Prevent duplicate initialization

    async function init() {
      try {
        // 1. Get ephemeral token from your API route.
        const tokenRes = await fetch("/api/session");
        if (!tokenRes.ok) throw new Error("Failed to fetch token");
        const tokenData = await tokenRes.json();
        const ephemeralKey = tokenData.client_secret.value;

        // 2. Create an RTCPeerConnection and set up remote audio playback.
        const pc = new RTCPeerConnection();
        pcRef.current = pc;
        const audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        pc.ontrack = (event) => {
          audioEl.srcObject = event.streams[0];
        };

        // 3. Get local audio (microphone) stream and add its tracks.
        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStream));

        // 4. Create a data channel for realtime events.
        const dc = pc.createDataChannel("oai-events");
        dataChannelRef.current = dc;

        // Wait for the data channel to open before sending the session update.
        dc.onopen = () => {
          console.log("Data channel open");
          if (policyData) {
            const instructions = generateInstructionsFromPolicy(policyData);
            console.log("Sending instructions:", instructions);
            const sessionUpdateEvent = {
              type: "session.update",
              session: {
                instructions,
              },
            };
            dc.send(JSON.stringify(sessionUpdateEvent));
          }
        };

        dc.onmessage = (event) => {
          try {
            const evtData = JSON.parse(event.data);
            if (evtData.type === "response.text.delta") {
              setCaptions((prev) => prev + evtData.delta);
            }
          } catch (error) {
            console.error("Error parsing data channel message:", error);
          }
        };

        // 5. Create and set the local SDP offer.
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // 6. Exchange the SDP with the realtime API endpoint using the ephemeral token.
        const sdpRes = await fetch(
          `https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`,
          {
            method: "POST",
            body: offer.sdp,
            headers: {
              Authorization: `Bearer ${ephemeralKey}`,
              "Content-Type": "application/sdp",
            },
          }
        );
        if (!sdpRes.ok) throw new Error("Failed to exchange SDP");
        const answerSDP = await sdpRes.text();
        await pc.setRemoteDescription({ type: "answer", sdp: answerSDP });
        setConnected(true);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error initializing realtime chat:", err);
          setConnectionError(err.message);
        } else {
          console.error("Error initializing realtime chat:", err);
          setConnectionError("Connection error");
        }
      }
    }
    init();

    return () => {
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, [policyData]);

  return (
    <div className="p-4 border rounded-md bg-white shadow-md">
      <h2 className="text-xl font-bold">Realtime Voice Chat</h2>
      {connectionError && (
        <p className="text-red-600 mt-2">Error: {connectionError}</p>
      )}
      {connected ? (
        <>
          <p className="mt-2 text-green-600">Connected to realtime API</p>
          <div className="mt-4 flex items-center">
            <div className="w-4 h-4 rounded-full bg-[rgb(82,102,255)] animate-pulse mr-2"></div>
            <span className="text-sm">AI is speaking...</span>
          </div>
          <div className="mt-4 p-2 bg-gray-100 rounded-md">
            <h3 className="text-sm font-semibold">AI Closed Captions:</h3>
            <p className="text-sm">{captions}</p>
          </div>
        </>
      ) : (
        <p className="mt-2">Connecting...</p>
      )}
    </div>
  );
}
