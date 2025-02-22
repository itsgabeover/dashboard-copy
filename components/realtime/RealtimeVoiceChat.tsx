"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Transcript from "./Transcript";
import BottomToolbar from "./BottomToolbar";
import { PolicyDashboard } from "@/app/dashboard/page";
import { useTranscript } from "./TranscriptContext";

// Event logging & server event handling
import { useEvent } from "./EventContext";
import { useHandleServerEvent } from "./useHandleServerEvent";

// Import our realtime connection helper
import { createRealtimeConnection } from "./realtimeConnection";

interface RealtimeVoiceChatProps {
  policyData: PolicyDashboard | null;
}

export default function RealtimeVoiceChat({
  policyData,
}: RealtimeVoiceChatProps) {
  // Session state
  const [sessionStatus, setSessionStatus] = useState<
    "DISCONNECTED" | "CONNECTING" | "CONNECTED"
  >("DISCONNECTED");
  const [connectionError, setConnectionError] = useState("");
  const [userText, setUserText] = useState("");

  // Settings for push-to-talk (PTT) and audio playback
  const [isPTTActive, setIsPTTActive] = useState(false);
  const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState(false);
  const [isAudioPlaybackEnabled, setIsAudioPlaybackEnabled] = useState(true);

  // Transcript context functions
  const { transcriptItems, addTranscriptMessage } = useTranscript();

  // Event logging & server event handling hooks
  const { logClientEvent, logServerEvent } = useEvent();
  const handleServerEventRef = useHandleServerEvent({ setSessionStatus });

  // Refs for WebRTC connection and audio
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  // --- Helper: generateInstructionsFromPolicy ---
  function generateInstructionsFromPolicy(policy: PolicyDashboard): string {
    const data = policy.analysis_data.data;
    let instructions = "";
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

  // --- Cancel Assistant Speech ---
  const cancelAssistantSpeech = async () => {
    const mostRecentAssistant = [...transcriptItems]
      .reverse()
      .find((item) => item.role === "assistant");
    if (!mostRecentAssistant) {
      console.warn("No assistant message to cancel");
      return;
    }
    if (mostRecentAssistant.status === "DONE") {
      console.log("Assistant message already finished");
      return;
    }
    if (
      dataChannelRef.current &&
      dataChannelRef.current.readyState === "open"
    ) {
      dataChannelRef.current.send(
        JSON.stringify({
          type: "conversation.item.truncate",
          item_id: mostRecentAssistant.itemId,
          content_index: 0,
          audio_end_ms: Date.now() - mostRecentAssistant.createdAtMs,
        })
      );
      dataChannelRef.current.send(JSON.stringify({ type: "response.cancel" }));
    }
  };

  // --- Simulated Welcome Message ---
  const sendSimulatedWelcome = useCallback(() => {
    const welcomeText = "What would you like to know about your policy?";
    const timestamp = new Date().toLocaleTimeString();
    const id = uuidv4();
    addTranscriptMessage(id, "assistant", welcomeText);
    if (
      dataChannelRef.current &&
      dataChannelRef.current.readyState === "open"
    ) {
      dataChannelRef.current.send(JSON.stringify({ type: "response.create" }));
    }
  }, [addTranscriptMessage]);

  // --- Start Session using createRealtimeConnection ---
  async function startSession() {
    setSessionStatus("CONNECTING");
    try {
      const tokenRes = await fetch("/api/session");
      if (!tokenRes.ok) throw new Error("Failed to fetch token");
      const tokenData = await tokenRes.json();
      const ephemeralKey = tokenData.client_secret.value;

      // Use the realtime connection helper to create connection
      const { pc, dc } = await createRealtimeConnection(
        ephemeralKey,
        audioElementRef
      );
      pcRef.current = pc;
      dataChannelRef.current = dc;

      // Set up data channel event listeners
      dc.onopen = () => {
        setSessionStatus("CONNECTED");
        if (policyData) {
          const instructions = generateInstructionsFromPolicy(policyData);
          const sessionUpdateEvent = {
            type: "session.update",
            session: {
              modalities: ["audio", "text"],
              instructions,
            },
          };
          dc.send(JSON.stringify(sessionUpdateEvent));
        }
        sendSimulatedWelcome();
      };

      dc.onmessage = (e) => {
        try {
          const evtData = JSON.parse(e.data);
          // Process event via your server event handler for logging/side-effects
          handleServerEventRef.current(evtData);
          if (evtData.type === "response.text.delta") {
            const timestamp = new Date().toLocaleTimeString();
            const id = uuidv4();
            addTranscriptMessage(id, "assistant", evtData.delta);
          }
        } catch (error) {
          console.error("Error parsing data channel message:", error);
        }
      };
    } catch (err) {
      console.error("Error initializing realtime chat:", err);
      if (err instanceof Error) {
        setConnectionError(err.message);
      } else {
        setConnectionError("Connection error");
      }
      setSessionStatus("DISCONNECTED");
    }
  }

  // --- Stop Session ---
  function stopSession() {
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.getSenders().forEach((sender) => {
        if (sender.track) sender.track.stop();
      });
      pcRef.current.close();
      pcRef.current = null;
    }
    setSessionStatus("DISCONNECTED");
    setConnectionError("");
  }

  // --- Handle User Text Submission ---
  function handleSendMessage() {
    if (
      !userText.trim() ||
      !dataChannelRef.current ||
      sessionStatus !== "CONNECTED"
    )
      return;
    cancelAssistantSpeech();
    const timestamp = new Date().toLocaleTimeString();
    const id = uuidv4();
    addTranscriptMessage(id, "user", userText.trim());
    const conversationEvent = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: userText.trim() }],
      },
    };
    dataChannelRef.current.send(JSON.stringify(conversationEvent));
    dataChannelRef.current.send(JSON.stringify({ type: "response.create" }));
    setUserText("");
  }

  // --- Push-to-Talk Handlers ---
  const handleTalkButtonDown = () => {
    if (
      sessionStatus !== "CONNECTED" ||
      !dataChannelRef.current ||
      dataChannelRef.current.readyState !== "open"
    )
      return;
    cancelAssistantSpeech();
    setIsPTTUserSpeaking(true);
    dataChannelRef.current.send(
      JSON.stringify({ type: "input_audio_buffer.clear" })
    );
  };

  const handleTalkButtonUp = () => {
    if (
      sessionStatus !== "CONNECTED" ||
      !dataChannelRef.current ||
      dataChannelRef.current.readyState !== "open" ||
      !isPTTUserSpeaking
    )
      return;
    setIsPTTUserSpeaking(false);
    dataChannelRef.current.send(
      JSON.stringify({ type: "input_audio_buffer.commit" })
    );
    dataChannelRef.current.send(JSON.stringify({ type: "response.create" }));
  };

  // --- Toggle Connection (for BottomToolbar/SessionControls) ---
  const onToggleConnection = () => {
    if (sessionStatus === "CONNECTED" || sessionStatus === "CONNECTING") {
      stopSession();
      setSessionStatus("DISCONNECTED");
    } else {
      startSession();
    }
  };

  // --- LocalStorage settings for audio playback and PTT ---
  useEffect(() => {
    const storedPTT = localStorage.getItem("pushToTalkUI");
    if (storedPTT) setIsPTTActive(storedPTT === "true");
    const storedAudioPlayback = localStorage.getItem("audioPlaybackEnabled");
    if (storedAudioPlayback)
      setIsAudioPlaybackEnabled(storedAudioPlayback === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "audioPlaybackEnabled",
      isAudioPlaybackEnabled.toString()
    );
  }, [isAudioPlaybackEnabled]);

  useEffect(() => {
    if (audioElementRef.current) {
      if (isAudioPlaybackEnabled) {
        audioElementRef.current.play().catch((err) => {
          console.warn("Autoplay may be blocked by browser:", err);
        });
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [isAudioPlaybackEnabled]);
  //realtime voice chat component
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Transcript view - subtract padding from parent */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Transcript
          userText={userText}
          setUserText={setUserText}
          onSendMessage={handleSendMessage}
          canSend={
            sessionStatus === "CONNECTED" &&
            dataChannelRef.current?.readyState === "open"
          }
        />
      </div>
      {/* Bottom Toolbar */}
      <div className="flex-shrink-0 mt-auto border-t border-gray-200">
        <BottomToolbar
          sessionStatus={sessionStatus}
          onToggleConnection={onToggleConnection}
          isPTTActive={isPTTActive}
          setIsPTTActive={setIsPTTActive}
          isPTTUserSpeaking={isPTTUserSpeaking}
          handleTalkButtonDown={handleTalkButtonDown}
          handleTalkButtonUp={handleTalkButtonUp}
          isAudioPlaybackEnabled={isAudioPlaybackEnabled}
          setIsAudioPlaybackEnabled={setIsAudioPlaybackEnabled}
        />
      </div>
    </div>
  );
}
