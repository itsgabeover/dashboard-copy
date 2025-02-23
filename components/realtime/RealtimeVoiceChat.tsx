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
  // --- Refs for WebRTC and Audio ---
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [sessionStatus, setSessionStatus] =
    useState<SessionStatus>("DISCONNECTED");
  const [userText, setUserText] = useState("");
  const [isPTTActive, setIsPTTActive] = useState(false);
  const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState(false);
  const [isAudioPlaybackEnabled, setIsAudioPlaybackEnabled] = useState(true);
  const [isEventsPaneExpanded, setIsEventsPaneExpanded] =
    useState<boolean>(false);
  const [welcomeSent, setWelcomeSent] = useState(false);

  // --- Contexts ---
  const { transcriptItems, addTranscriptMessage, addTranscriptBreadcrumb } =
    useTranscript();
  const { logClientEvent, logServerEvent } = useEvent();

  interface ClientEvent {
    type: string;
    [key: string]: unknown;
  }
  const sendClientEvent = (eventObj: ClientEvent, eventNameSuffix = ""): void => {
    if (dcRef.current && dcRef.current.readyState === "open") {
      logClientEvent(eventObj, eventNameSuffix);
      dcRef.current.send(JSON.stringify(eventObj));
    } else {
      logClientEvent(
        { attemptedEvent: eventObj.type },
        "error.data_channel_not_open"
      );
      console.error(
        "Failed to send message - no data channel available",
        eventObj
      );
    }
  };

  // Then call the hook with all required parameters:
  const handleServerEventRef = useHandleServerEvent({
    setSessionStatus,
    selectedAgentName,
    selectedAgentConfigSet,
    sendClientEvent,
    setSelectedAgentName,
  });

  // --- Agent Config Initialization ---
  useEffect(() => {
    let finalAgentConfig = searchParams.get("agentConfig");
    if (!finalAgentConfig || !allAgentSets[finalAgentConfig]) {
      finalAgentConfig = defaultAgentSetKey;
      const url = new URL(window.location.toString());
      url.searchParams.set("agentConfig", finalAgentConfig);
      window.location.replace(url.toString());
      return;
    }

    const agents = allAgentSets[finalAgentConfig];
    const agentKeyToUse = agents[0]?.name || "";

    setSelectedAgentName(agentKeyToUse);
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
      addTranscriptBreadcrumb(`Agent: ${selectedAgentName}`, currentAgent);
      updateSession(false);
    }
  }, [selectedAgentConfigSet, selectedAgentName, sessionStatus]);

  // --- Update Session on PTT Toggle ---
  useEffect(() => {
    if (sessionStatus === "CONNECTED") {
      console.log(
        `updatingSession, isPTTACtive=${isPTTActive} sessionStatus=${sessionStatus}`
      );
      updateSession(false);
    }
  }, [isPTTActive]);

  // --- Fetch Ephemeral Key ---
  const fetchEphemeralKey = async (): Promise<string | null> => {
    logClientEvent({ url: "/session" }, "fetch_session_token_request");
    const tokenResponse = await fetch("/api/session");
    const data = await tokenResponse.json();
    logServerEvent(data, "fetch_session_token_response");

    if (!data.client_secret?.value) {
      logClientEvent(data, "error.no_ephemeral_key");
      console.error("No ephemeral key provided by the server");
      setSessionStatus("DISCONNECTED");
      return null;
    }

    return data.client_secret.value;
  };

  // Connect to Realtime
  const connectToRealtime = async () => {
    if (sessionStatus !== "DISCONNECTED") return;
    setSessionStatus("CONNECTING");

    try {
      const EPHEMERAL_KEY = await fetchEphemeralKey();
      if (!EPHEMERAL_KEY) {
        return;
      }

      if (!audioElementRef.current) {
        audioElementRef.current = document.createElement("audio");
      }
      audioElementRef.current.autoplay = isAudioPlaybackEnabled;

      const { pc, dc } = await createRealtimeConnection(
        EPHEMERAL_KEY,
        audioElementRef
      );
      pcRef.current = pc;
      dcRef.current = dc;

      dc.addEventListener("open", () => {
        logClientEvent({}, "data_channel.open");
      });
      dc.addEventListener("close", () => {
        logClientEvent({}, "data_channel.close");
      });
      dc.addEventListener("error", (err: any) => {
        logClientEvent({ error: err }, "data_channel.error");
      });
      dc.addEventListener("message", (e: MessageEvent) => {
        handleServerEventRef.current(JSON.parse(e.data));
      });

      setDataChannel(dc);
    } catch (err) {
      console.error("Error connecting to realtime:", err);
      setSessionStatus("DISCONNECTED");
    }
  };
  // disconnect from Realtime
  const disconnectFromRealtime = () => {
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
    setSessionStatus("DISCONNECTED");
    setIsPTTUserSpeaking(false);

    logClientEvent({}, "disconnected");
  };

  // --- Cancel In-Progress Assistant Speech ---
  const cancelAssistantSpeech = async () => {
    const mostRecentAssistantMessage = [...transcriptItems]
      .reverse()
      .find((item) => item.role === "assistant");

    if (!mostRecentAssistantMessage) {
      console.warn("can't cancel, no recent assistant message found");
      return;
    }
    if (mostRecentAssistantMessage.status === "DONE") {
      console.log("No truncation needed, message is DONE");
      return;
    }

    sendClientEvent({
      type: "conversation.item.truncate",
      item_id: mostRecentAssistantMessage?.itemId,
      content_index: 0,
      audio_end_ms: Date.now() - mostRecentAssistantMessage.createdAtMs,
    });
    sendClientEvent(
      { type: "response.cancel" },
      "(cancel due to user interruption)"
    );
  };

  // --- Send User Text Message ---
  const handleSendMessage = () => {
    if (!userText.trim()) return;
    cancelAssistantSpeech();

    sendClientEvent(
      {
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: userText.trim() }],
        },
      },
      "(send user text message)"
    );
    setUserText("");

    sendClientEvent({ type: "response.create" }, "trigger response");
  };

  // --- Push-to-Talk Handlers ---
  const handleTalkButtonDown = () => {
    if (sessionStatus !== "CONNECTED" || dataChannel?.readyState !== "open")
      return;
    cancelAssistantSpeech();

    setIsPTTUserSpeaking(true);
    sendClientEvent({ type: "input_audio_buffer.clear" }, "clear PTT buffer");
  };

  const handleTalkButtonUp = () => {
    if (
      sessionStatus !== "CONNECTED" ||
      dataChannel?.readyState !== "open" ||
      !isPTTUserSpeaking
    )
      return;

    setIsPTTUserSpeaking(false);
    sendClientEvent({ type: "input_audio_buffer.commit" }, "commit PTT");
    sendClientEvent({ type: "response.create" }, "trigger response PTT");
  };

    // const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //   const newAgentConfig = e.target.value;
    //   const url = new URL(window.location.toString());
    //   url.searchParams.set("agentConfig", newAgentConfig);
    //   window.location.replace(url.toString());
    // };
    //   const handleSelectedAgentChange = (
    //     e: React.ChangeEvent<HTMLSelectElement>
    //   ) => {
    //     const newAgentName = e.target.value;
    //     setSelectedAgentName(newAgentName);
    //   };
  useEffect(() => {
    const storedPushToTalkUI = localStorage.getItem("pushToTalkUI");
    if (storedPushToTalkUI) {
      setIsPTTActive(storedPushToTalkUI === "true");
    }
    const storedLogsExpanded = localStorage.getItem("logsExpanded");
    if (storedLogsExpanded) {
      setIsEventsPaneExpanded(storedLogsExpanded === "true");
    }
    const storedAudioPlaybackEnabled = localStorage.getItem(
      "audioPlaybackEnabled"
    );
    if (storedAudioPlaybackEnabled) {
      setIsAudioPlaybackEnabled(storedAudioPlaybackEnabled === "true");
    }
  }, []);
    useEffect(() => {
      localStorage.setItem("pushToTalkUI", isPTTActive.toString());
    }, [isPTTActive]);

    useEffect(() => {
      localStorage.setItem("logsExpanded", isEventsPaneExpanded.toString());
    }, [isEventsPaneExpanded]);

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

    //const agentSetKey = searchParams.get("agentConfig") || "default";

  // --- Session Update ---
  // This event sends instructions including transcription configuration.

  const sendSimulatedUserMessage = (text: string) => {
    const id = uuidv4().slice(0, 32);
    addTranscriptMessage(id, "user", text, true);

    sendClientEvent(
      {
        type: "conversation.item.create",
        item: {
          id,
          type: "message",
          role: "user",
          content: [{ type: "input_text", text }],
        },
      },
      "(simulated user text message)"
    );
    sendClientEvent(
      { type: "response.create" },
      "(trigger response after simulated user text message)"
    );
  };
  const updateSession = (shouldTriggerResponse: boolean = false) => {
    // Clear any buffered audio
    sendClientEvent(
      { type: "input_audio_buffer.clear" },
      "clear audio buffer on session update"
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
        instructions:
          "Answer any questions the user has about their policy. Start by saying: what would you like to know about your policy?" +
          "Here are the policy details for reference:" +
          (policyData ? generateInstructionsFromPolicy(policyData) : ""),
        voice: "alloy",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        input_audio_transcription: { model: "whisper-1" },
        turn_detection: turnDetection,
        tools: currentAgent?.tools || [],
      },
    };

    sendClientEvent(sessionUpdateEvent, "session.update");
    if (shouldTriggerResponse && !welcomeSent) {
      sendSimulatedUserMessage("hi");
      setWelcomeSent(true);
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
            dcRef.current?.readyState === "open"
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
