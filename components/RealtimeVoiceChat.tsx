"use client";
import { useEffect, useState, useRef } from "react";

export interface PolicyDashboard {
  id: string;
  policy_name: string;
  created_at: string;
  session_id: string;
  analysis_data: {
    data: {
      policyOverview: {
        productName: string;
        issuer: string;
      };
      sections: {
        [key: string]: PolicySection;
      };
      // Additional fields like "email" or "values" may be present.
    };
  };
}

export interface PolicySection {
  opening: string;
  bullets: Array<{
    title: string;
    content: string;
  }>;
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

  // Helper: Generate instructions from the policyData.
  const generateInstructionsFromPolicy = (policy: PolicyDashboard): string => {
    const { analysis_data } = policy;
    const overview = analysis_data.data.policyOverview;
    // For example, include product name, issuer, and section titles.
    const sectionTitles = Object.values(analysis_data.data.sections)
      .map((section) => section.opening)
      .join(", ");
    return `Policy Analysis Instructions:
Product: ${overview.productName}
Issuer: ${overview.issuer}
Sections: ${sectionTitles}`;
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

        // Set the onopen handler so we send the session.update only when the channel is ready.
        dc.onopen = () => {
          console.log("Data channel open");
          if (policyData) {
            const instructions = generateInstructionsFromPolicy(policyData);
            const sessionUpdateEvent = {
              type: "session.update",
              session: {
                instructions,
              },
            };
            dc.send(JSON.stringify(sessionUpdateEvent));
          }
        };

        // Set the onmessage handler.
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
