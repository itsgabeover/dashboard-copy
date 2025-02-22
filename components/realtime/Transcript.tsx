"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import NextImage from "next/image"; // Use NextImage to avoid conflicts with the native Image
import { TranscriptItem } from "@/types/realtime";
import { useTranscript } from "./TranscriptContext";

export interface TranscriptProps {
  userText: string;
  setUserText: (val: string) => void;
  onSendMessage: () => void;
  canSend: boolean;
}

function Transcript({
  userText,
  setUserText,
  onSendMessage,
  canSend,
}: TranscriptProps) {
  const { transcriptItems, toggleTranscriptItemExpand } = useTranscript();
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const [prevLogs, setPrevLogs] = useState<TranscriptItem[]>([]);
  const [justCopied, setJustCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function scrollToBottom() {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    const hasNewMessage = transcriptItems.length > prevLogs.length;
    const hasUpdatedMessage = transcriptItems.some((newItem, index) => {
      const oldItem = prevLogs[index];
      return (
        oldItem &&
        (newItem.title !== oldItem.title || newItem.data !== oldItem.data)
      );
    });

    if (hasNewMessage || hasUpdatedMessage) {
      scrollToBottom();
    }
    setPrevLogs(transcriptItems);
  }, [transcriptItems]);

  // Autofocus on text box input when allowed
  useEffect(() => {
    if (canSend && inputRef.current) {
      inputRef.current.focus();
    }
  }, [canSend]);

  const handleCopyTranscript = async () => {
    if (!transcriptRef.current) return;
    try {
      await navigator.clipboard.writeText(transcriptRef.current.innerText);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy transcript:", error);
    }
  };
  //transcript component
  return (
    <div className="flex flex-col flex-1 bg-white rounded-md shadow-sm border border-gray-200">
      {/* copy button and message list */}
      <div className="relative flex-1 min-h-0 overflow-y-auto ">
        <button
          onClick={handleCopyTranscript}
          className="absolute top-2 right-2 z-10 text-xs px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          {justCopied ? "Copied" : "Copy"}
        </button>
        <div ref={transcriptRef} className="flex-1 min-h-0 p-2 space-y-2">
          {transcriptItems.length === 0 ? (
            <div className="text-gray-500 text-center text-sm">
              No messages yet.
            </div>
          ) : (
            transcriptItems.map((item) => {
              const {
                itemId,
                type,
                role,
                data,
                expanded,
                timestamp,
                title = "",
                isHidden,
              } = item;
              if (isHidden) return null;
              if (type === "MESSAGE") {
                const isUser = role === "user";
                return (
                  <div
                    key={itemId}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-md p-2 rounded-md ${
                        isUser
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1 font-mono">
                        {timestamp}
                      </div>
                      <ReactMarkdown className="text-sm">{title}</ReactMarkdown>
                      {data && (
                        <pre className="text-xs bg-gray-50 p-1 rounded mt-1 font-mono">
                          {JSON.stringify(data, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                );
              } else if (type === "BREADCRUMB") {
                return (
                  <div key={itemId} className="text-gray-500 text-xs font-mono">
                    <span>
                      {timestamp} - {title}
                    </span>
                  </div>
                );
              } else {
                return (
                  <div
                    key={itemId}
                    className="text-center text-gray-500 text-xs italic font-mono"
                  >
                    Unknown item type: {type} | {timestamp}
                  </div>
                );
              }
            })
          )}
        </div>
      </div>
      {/* input box */}
      <div className="p-2 flex-shrink-0 flex items-center gap-2 border-t border-gray-200">
        <input
          ref={inputRef}
          type="text"
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSend) {
              onSendMessage();
            }
          }}
          className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none text-sm"
          placeholder="Type your message..."
        />
        <button
          onClick={onSendMessage}
          disabled={!canSend || !userText.trim()}
          className="bg-gray-900 text-white rounded-full px-3 py-2 disabled:opacity-50"
        >
          <NextImage src="/arrow.svg" alt="Send" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}

export default Transcript;
