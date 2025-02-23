"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import Transcript from "./Transcript";
import BottomToolbar from "./BottomToolbar";
import { PolicyDashboard } from "@/app/dashboard/page";
import { useTranscript } from "./TranscriptContext";
import { useEvent } from "./EventContext";
import { useHandleServerEvent } from "./useHandleServerEvent";
import { createRealtimeConnection } from "./realtimeConnection";

// Agent configuration (preserved even though the UI is hidden)
import { allAgentSets, defaultAgentSetKey } from "@/components/agentConfigs";
import { AgentConfig } from "@/types/realtime";

export type SessionStatus = "DISCONNECTED" | "CONNECTING" | "CONNECTED";

interface RealtimeVoiceChatProps {
  policyData: PolicyDashboard | null;
}

export default function RealtimeVoiceChat({
  policyData,
}: RealtimeVoiceChatProps) {
  // --- Agent and Session State ---
  const searchParams = useSearchParams();
  const [selectedAgentName, setSelectedAgentName] = useState<string>("");
  const [selectedAgentConfigSet, setSelectedAgentConfigSet] = useState<
    AgentConfig[] | null
  >(null);
  const [sessionStatus, setSessionStatus] =
    useState<SessionStatus>("DISCONNECTED");
  const [userText, setUserText] = useState("");
  const [isPTTActive, setIsPTTActive] = useState(false);
  const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState(false);
  const [isAudioPlaybackEnabled, setIsAudioPlaybackEnabled] = useState(true);
  const [isEventsPaneExpanded, setIsEventsPaneExpanded] =
    useState<boolean>(false);

  // --- Contexts ---
  const { transcriptItems, addTranscriptMessage, addTranscriptBreadcrumb } =
    useTranscript();
  const { logClientEvent } = useEvent();
  // Then call the hook with all required parameters:
  const handleServerEventRef = useHandleServerEvent({
    setSessionStatus,
    selectedAgentName,
    selectedAgentConfigSet,
    sendClientEvent: logClientEvent,
    setSelectedAgentName,
  });
  // --- Refs for WebRTC and Audio ---
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // --- Agent Config Initialization ---
  useEffect(() => {
    let agentConfigKey = searchParams?.get("agentConfig");
    if (!agentConfigKey || !allAgentSets[agentConfigKey]) {
      agentConfigKey = defaultAgentSetKey;
      const url = new URL(window.location.toString());
      url.searchParams.set("agentConfig", agentConfigKey);
      window.history.replaceState(null, "", url.toString());
    }
    const agents = allAgentSets[agentConfigKey];
    const agentToUse = agents[0]?.name || "";
    setSelectedAgentName(agentToUse);
    setSelectedAgentConfigSet(agents);
  }, [searchParams]);

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
  // --- Update Session When Agent or Session Changes ---
  useEffect(() => {
    if (
      sessionStatus === "CONNECTED" &&
      selectedAgentConfigSet &&
      selectedAgentName
    ) {
      const currentAgent = selectedAgentConfigSet.find(
        (a) => a.name === selectedAgentName
      );
      addTranscriptBreadcrumb(
        `Agent: ${selectedAgentName}`,
        currentAgent as unknown as Record<string, unknown>
      );
      updateSession(true);
    }
  }, [selectedAgentConfigSet, selectedAgentName, sessionStatus]);

  // --- Update Session on PTT Toggle ---
  useEffect(() => {
    if (sessionStatus === "CONNECTED") {
      updateSession();
    }
  }, [isPTTActive]);

  // --- Fetch Ephemeral Key ---
  const fetchEphemeralKey = async (): Promise<string | null> => {
    try {
      const tokenRes = await fetch("/api/session");
      if (!tokenRes.ok) throw new Error("Failed to fetch token");
      const tokenData = await tokenRes.json();
      return tokenData.client_secret.value;
    } catch (err) {
      console.error("Error fetching ephemeral key", err);
      return null;
    }
  };

  // --- Connect to Realtime Service ---
  const connectToRealtime = async () => {
    if (sessionStatus !== "DISCONNECTED") return;
    setSessionStatus("CONNECTING");

    const EPHEMERAL_KEY = await fetchEphemeralKey();
    if (!EPHEMERAL_KEY) {
      setSessionStatus("DISCONNECTED");
      return;
    }

    // Create or reuse an audio element (hidden in the DOM)
    if (!audioElementRef.current) {
      audioElementRef.current = document.createElement("audio");
      audioElementRef.current.autoplay = true;
      (
        audioElementRef.current as HTMLMediaElement & { playsInline?: boolean }
      ).playsInline = true;
      audioElementRef.current.style.display = "none";
      document.body.appendChild(audioElementRef.current);
    }
    audioElementRef.current.autoplay = isAudioPlaybackEnabled;

    try {
      const { pc, dc } = await createRealtimeConnection(
        EPHEMERAL_KEY,
        audioElementRef
      );
      pcRef.current = pc;
      dataChannelRef.current = dc;

      dc.addEventListener("open", () => {
        logClientEvent({ type: "data_channel.open" });
        setSessionStatus("CONNECTED");
        // Immediately send the session update event with policy instructions.
        updateSession(true);
      });
      dc.addEventListener("message", (e: MessageEvent) => {
        try {
          const evtData = JSON.parse(e.data);
          handleServerEventRef.current(evtData);

          // Process AI text responses
          if (evtData.type === "response.text.delta") {
            const id = uuidv4();
            addTranscriptMessage(id, "assistant", evtData.delta);
          }
          // Process user audio transcription events
          if (evtData.type === "input.audio.transcription") {
            const id = uuidv4();
            addTranscriptMessage(id, "user", evtData.transcript || "");
          }
        } catch (error) {
          console.error("Error parsing data channel message:", error);
        }
      });
      dc.addEventListener("error", (err) => {
        logClientEvent({ error: err }, "data_channel.error");
      });
    } catch (err) {
      console.error("Error connecting to realtime:", err);
      setSessionStatus("DISCONNECTED");
    }
  };

  // --- Disconnect from Realtime Service ---
  const disconnectFromRealtime = () => {
    if (pcRef.current) {
      pcRef.current.getSenders().forEach((sender) => {
        if (sender.track) sender.track.stop();
      });
      pcRef.current.close();
      pcRef.current = null;
    }
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    setSessionStatus("DISCONNECTED");
    setIsPTTUserSpeaking(false);
    logClientEvent({ type: "disconnected" });
  };

  // --- Cancel In-Progress Assistant Speech ---
  const cancelAssistantSpeech = () => {
    const mostRecentAssistant = [...transcriptItems]
      .reverse()
      .find((item) => item.role === "assistant");
    if (!mostRecentAssistant || mostRecentAssistant.status === "DONE") return;
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

  // --- Send User Text Message ---
  const handleSendMessage = () => {
    if (
      !userText.trim() ||
      !dataChannelRef.current ||
      sessionStatus !== "CONNECTED"
    )
      return;
    cancelAssistantSpeech();
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
  };

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

  // --- Session Update ---
  // This event sends instructions including transcription configuration.
  const updateSession = (shouldTriggerResponse: boolean = true) => {
    if (!dataChannelRef.current || dataChannelRef.current.readyState !== "open")
      return;

    // Clear any buffered audio
    dataChannelRef.current.send(
      JSON.stringify({ type: "input_audio_buffer.clear" })
    );

    const currentAgent = selectedAgentConfigSet?.find(
      (a) => a.name === selectedAgentName
    );
    const turnDetection = isPTTActive
      ? null
      : {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 200,
          create_response: true,
        };

    const sessionUpdateEvent = {
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        instructions: ("Answer any questions the user has about their policy. Here are the policy details for reference:" + (policyData
          ? generateInstructionsFromPolicy(policyData)
          : "")),
        voice: "alloy",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        input_audio_transcription: { model: "whisper-1" },
        turn_detection: turnDetection,
        tools: currentAgent?.tools || [],
      },
    };

    dataChannelRef.current.send(JSON.stringify(sessionUpdateEvent));

    if (shouldTriggerResponse) {
      // Optionally trigger a simulated user message to initiate a response
      const simulatedId = uuidv4();
      addTranscriptMessage(simulatedId, "user", "hi", true);
      dataChannelRef.current.send(JSON.stringify({ type: "response.create" }));
    }
  };

  // --- Audio Playback Effect ---
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

  // --- Connect on Mount and Clean Up on Unmount ---
  useEffect(() => {
    connectToRealtime();
    return () => disconnectFromRealtime();
  }, []);

  // --- Hidden Agent UI ---
  // This keeps the agent-changing functionality in place but hides it from the user.
  const hiddenAgentUI = (
    <div style={{ display: "none" }}>
      <label>
        Agent:
        <select
          value={selectedAgentName}
          onChange={(e) => setSelectedAgentName(e.target.value)}
        >
          {selectedAgentConfigSet?.map((agent) => (
            <option key={agent.name} value={agent.name}>
              {agent.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <div className="p-5 text-lg font-semibold flex justify-between items-center">
        <div>Realtime Voice Chat</div>
        <button
          onClick={disconnectFromRealtime}
          className="text-sm text-red-500"
        >
          Disconnect
        </button>
      </div>
      {/* Hidden Agent UI */}
      {hiddenAgentUI}
      {/* Main Content: Transcript */}
      <div className="flex flex-1 overflow-hidden">
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
      <BottomToolbar
        sessionStatus={sessionStatus}
        onToggleConnection={() => {
          if (sessionStatus === "CONNECTED" || sessionStatus === "CONNECTING") {
            disconnectFromRealtime();
          } else {
            connectToRealtime();
          }
        }}
        isPTTActive={isPTTActive}
        setIsPTTActive={setIsPTTActive}
        isPTTUserSpeaking={isPTTUserSpeaking}
        handleTalkButtonDown={handleTalkButtonDown}
        handleTalkButtonUp={handleTalkButtonUp}
        isAudioPlaybackEnabled={isAudioPlaybackEnabled}
        setIsAudioPlaybackEnabled={setIsAudioPlaybackEnabled}
        isEventsPaneExpanded={isEventsPaneExpanded}
        setIsEventsPaneExpanded={setIsEventsPaneExpanded}
      />
    </div>
  );
}
