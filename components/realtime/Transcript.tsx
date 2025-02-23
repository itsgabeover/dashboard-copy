"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { TranscriptItem } from "@/types/realtime";
import Image from "next/image";
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
  const { transcriptItems } = useTranscript();
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

  // Autofocus on text box input on load
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

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0 rounded-xl">
      <div className="relative flex-1 min-h-0 overflow-y-auto mt-32">
        <button
          onClick={handleCopyTranscript}
          className={`absolute w-20 top-3 right-2 mr-1 z-10 text-sm px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300`}
        >
          {justCopied ? "Copied!" : "Copy"}
        </button>

        <div ref={transcriptRef} className="flex-1 min-h-0 p-2 space-y-2">
          {transcriptItems.map((item) => {
            const {
              itemId,
              type,
              role,
              timestamp,
              title = "",
              isHidden,
            } = item;

            if (isHidden) {
              return null;
            }

            if (type === "MESSAGE") {
              const isUser = role === "user";
              const baseContainer = "flex justify-end flex-col";
              const containerClasses = `${baseContainer} ${
                isUser ? "items-end" : "items-start"
              }`;
              const bubbleBase = `max-w-lg p-3 rounded-xl ${
                isUser ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-black"
              }`;
              const isBracketedMessage =
                title.startsWith("[") && title.endsWith("]");
              const messageStyle = isBracketedMessage
                ? "italic text-gray-400"
                : "";
              const displayTitle = isBracketedMessage
                ? title.slice(1, -1)
                : title;

              return (
                <div key={itemId} className={containerClasses}>
                  <div className={bubbleBase}>
                    <div
                      className={`text-xs ${
                        isUser ? "text-gray-400" : "text-gray-500"
                      } font-mono`}
                    >
                      {timestamp}
                    </div>
                    <div className={`whitespace-pre-wrap ${messageStyle}`}>
                      <ReactMarkdown>{displayTitle}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            } else if (type === "BREADCRUMB") {
              return (
                <></>
                // <div
                //   key={itemId}
                //   className="flex flex-col justify-start items-start text-gray-500 text-sm"
                // >
                //   <span className="text-xs font-mono">{timestamp}</span>
                //   <div
                //     className={`whitespace-pre-wrap flex items-center font-mono text-sm text-gray-800 ${
                //       data ? "cursor-pointer" : ""
                //     }`}
                //     onClick={() => data && toggleTranscriptItemExpand(itemId)}
                //   >
                //     {data && (
                //       <span
                //         className={`text-gray-400 mr-1 transform transition-transform duration-200 select-none font-mono ${
                //           expanded ? "rotate-90" : "rotate-0"
                //         }`}
                //       >
                //         ▶
                //       </span>
                //     )}
                //     {title}
                //   </div>
                //   {expanded && data && (
                //     <div className="text-gray-800 text-left">
                //       <pre className="border-l-2 ml-1 border-gray-200 whitespace-pre-wrap break-words font-mono text-xs mb-2 mt-2 pl-2">
                //         {JSON.stringify(data, null, 2)}
                //       </pre>
                //     </div>
                //   )}
                // </div>
              );
            } else {
              // Fallback if type is neither MESSAGE nor BREADCRUMB
              return (
                <div
                  key={itemId}
                  className="flex justify-center text-gray-500 text-sm italic font-mono"
                >
                  Unknown item type: {type}{" "}
                  <span className="ml-2 text-xs">{timestamp}</span>
                </div>
              );
            }
          })}
        </div>
      </div>

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
          className="flex-1 px-4 py-2 focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={onSendMessage}
          disabled={!canSend || !userText.trim()}
          className="bg-gray-900 text-white rounded-full px-2 py-2 disabled:opacity-50"
        >
          <Image src="arrow.svg" alt="Send" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}

export default Transcript;

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import ReactMarkdown from "react-markdown";
// import NextImage from "next/image"; // Use NextImage to avoid conflicts with the native Image
// import { TranscriptItem } from "@/types/realtime";
// import { useTranscript } from "./TranscriptContext";

// export interface TranscriptProps {
//   userText: string;
//   setUserText: (val: string) => void;
//   onSendMessage: () => void;
//   canSend: boolean;
// }

// function Transcript({
//   userText,
//   setUserText,
//   onSendMessage,
//   canSend,
// }: TranscriptProps) {
//   const { transcriptItems} = useTranscript();
//   const transcriptRef = useRef<HTMLDivElement | null>(null);
//   const [prevLogs, setPrevLogs] = useState<TranscriptItem[]>([]);
//   const [justCopied, setJustCopied] = useState(false);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   function scrollToBottom() {
//     if (transcriptRef.current) {
//       transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
//     }
//   }

//   useEffect(() => {
//     const hasNewMessage = transcriptItems.length > prevLogs.length;
//     const hasUpdatedMessage = transcriptItems.some((newItem, index) => {
//       const oldItem = prevLogs[index];
//       return (
//         oldItem &&
//         (newItem.title !== oldItem.title || newItem.data !== oldItem.data)
//       );
//     });

//     if (hasNewMessage || hasUpdatedMessage) {
//       scrollToBottom();
//     }
//     setPrevLogs(transcriptItems);
//   }, [transcriptItems]);

//   // Autofocus on text box input when allowed
//   useEffect(() => {
//     if (canSend && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [canSend]);

//   const handleCopyTranscript = async () => {
//     if (!transcriptRef.current) return;
//     try {
//       await navigator.clipboard.writeText(transcriptRef.current.innerText);
//       setJustCopied(true);
//       setTimeout(() => setJustCopied(false), 1500);
//     } catch (error) {
//       console.error("Failed to copy transcript:", error);
//     }
//   };
//   //transcript component
//   return (
//     <div className="flex flex-col flex-1 bg-white rounded-md shadow-sm border border-gray-200">
//       {/* copy button and message list */}
//       <div className="relative flex-1 min-h-0 overflow-y-auto mt-32">
//         <button
//           onClick={handleCopyTranscript}
//           className="absolute top-2 right-2 z-10 text-xs px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
//         >
//           {justCopied ? "Copied" : "Copy"}
//         </button>
//         <div ref={transcriptRef} className="flex-1 min-h-0 p-2 space-y-2">
//           {transcriptItems.length === 0 ? (
//             <div className="text-gray-500 text-center text-sm">
//               No messages yet.
//             </div>
//           ) : (
//             transcriptItems.map((item) => {
//               const {
//                 itemId,
//                 type,
//                 role,
//                 data,
//                 timestamp,
//                 title = "",
//                 isHidden,
//               } = item;
//               if (isHidden) return null;
//               if (type === "MESSAGE") {
//                 const isUser = role === "user";
//                 return (
//                   <div
//                     key={itemId}
//                     className={`flex ${
//                       isUser ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`max-w-md p-2 rounded-md ${
//                         isUser
//                           ? "bg-blue-600 text-white"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       <div className="text-xs text-gray-500 mb-1 font-mono">
//                         {timestamp}
//                       </div>
//                       <ReactMarkdown className="text-sm">{title}</ReactMarkdown>
//                       {data && (
//                         <pre className="text-xs bg-gray-50 p-1 rounded mt-1 font-mono">
//                           {JSON.stringify(data, null, 2)}
//                         </pre>
//                       )}
//                     </div>
//                   </div>
//                 );
//               } else if (type === "BREADCRUMB") {
//                 return (
//                   <div key={itemId} className="text-gray-500 text-xs font-mono">
//                     <span>
//                       {timestamp} - {title}
//                     </span>
//                   </div>
//                 );
//               } else {
//                 return (
//                   <div
//                     key={itemId}
//                     className="text-center text-gray-500 text-xs italic font-mono"
//                   >
//                     Unknown item type: {type} | {timestamp}
//                   </div>
//                 );
//               }
//             })
//           )}
//         </div>
//       </div>
//       {/* input box */}
//       <div className="p-2 flex-shrink-0 flex items-center gap-2 border-t border-gray-200">
//         <input
//           ref={inputRef}
//           type="text"
//           value={userText}
//           onChange={(e) => setUserText(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && canSend) {
//               onSendMessage();
//             }
//           }}
//           className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none text-sm"
//           placeholder="Type your message..."
//         />
//         <button
//           onClick={onSendMessage}
//           disabled={!canSend || !userText.trim()}
//           className="bg-gray-900 text-white rounded-full px-3 py-2 disabled:opacity-50"
//         >
//           <NextImage src="/arrow.svg" alt="Send" width={20} height={20} />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Transcript;
