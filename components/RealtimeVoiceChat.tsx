"use client";
import { useEffect, useState, useRef } from "react";

export default function RealtimeVoiceChat() {
  const [connected, setConnected] = useState(false);
  const [captions, setCaptions] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  useEffect(() => {
    // Prevent reinitialization if already set up
    if (pcRef.current) return;
    async function init() {
      try {
        // 1. Get ephemeral token from our server-side API
        const tokenRes = await fetch("/api/session");
        if (!tokenRes.ok) throw new Error("Failed to fetch token");
        const tokenData = await tokenRes.json();
        const ephemeralKey = tokenData.client_secret.value;

        // 2. Create RTCPeerConnection and set up remote audio playback
        const pc = new RTCPeerConnection();
        pcRef.current = pc;
        const audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        pc.ontrack = (event) => {
          audioEl.srcObject = event.streams[0];
        };

        // 3. Get local audio (microphone) stream and add to connection
        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStream));

        // 4. Create a data channel for realtime events
        const dc = pc.createDataChannel("oai-events");
        dataChannelRef.current = dc;
        dc.onmessage = (event) => {
          try {
            const evtData = JSON.parse(event.data);
            // For example, update captions when receiving delta text
            if (evtData.type === "response.text.delta") {
              setCaptions((prev) => prev + evtData.delta);
            }
            // You can add additional event handling (e.g., animations) here.
          } catch (error) {
            console.error("Error parsing data channel message:", error);
          }
        };

        // 5. Create and set local SDP offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // 6. Exchange SDP with the realtime API endpoint using the ephemeral token
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
  }, []);

  return (
    <div className="p-4 border rounded-md bg-white shadow-md">
      <h2 className="text-xl font-bold">Realtime Voice Chat</h2>
      {connectionError && (
        <p className="text-red-600 mt-2">Error: {connectionError}</p>
      )}
      {connected ? (
        <>
          <p className="mt-2 text-green-600">Connected to realtime API</p>
          {/* AI talking animation placeholder */}
          <div className="mt-4 flex items-center">
            <div className="w-4 h-4 rounded-full bg-[rgb(82,102,255)] animate-pulse mr-2"></div>
            <span className="text-sm">AI is speaking...</span>
          </div>
          {/* Closed Captioning */}
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
