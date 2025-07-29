"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { IoEllipsisVertical, IoSend, IoAttach, IoHappy, IoMic } from "react-icons/io5"

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  type: "text" | "image" | "file"
  fileUrl?: string
  fileName?: string
  fileSize?: string
}

interface ChatContact {
  id: string
  name: string
  avatar: string
  isOnline: boolean
}

interface ChatViewProps {
  contact: ChatContact
  messages: Message[]
  currentUserId: string
  onSendMessage: (content: string, type: "text" | "image" | "file") => void
}

const ChatView = ({ contact, messages, currentUserId, onSendMessage }: ChatViewProps) => {
  const [messageInput, setMessageInput] = useState("")

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim(), "text")
      setMessageInput("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-[#333333] border-b border-[#444444] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#444444] flex items-center justify-center">
                {contact.avatar ? (
                  <Image
                    src={contact.avatar || "/avatar.png"}
                    alt={contact.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[#F9F1E2] font-bold">{contact.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              {contact.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#333333]"></div>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-[#F9F1E2] font-medium">{contact.name}</h3>
              <p className="text-[#B5B4AD] text-sm">{contact.isOnline ? "Active" : "Offline"}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button className="text-[#B5B4AD] hover:text-[#F9F1E2] p-2">
              <IoEllipsisVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Today Divider */}
        <div className="flex items-center justify-center">
          <div className="bg-[#444444] text-[#B5B4AD] text-xs px-3 py-1 rounded-full">Today</div>
        </div>

        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId
          return (
            <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? "order-2" : "order-1"}`}>
                {message.type === "text" && (
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isCurrentUser
                        ? "bg-[#5A5A2A] text-[#F9F1E2]"
                        : "bg-[#444444] text-[#F9F1E2] border border-[#555555]"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                )}

                {message.type === "image" && (
                  <div className="relative">
                    <div className="w-64 h-64 rounded-lg overflow-hidden bg-[#444444] border-2 border-yellow">
                      <Image
                        src={message.fileUrl || "/file.png"}
                        alt="Shared image"
                        width={256}
                        height={256}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      4:56 pm
                    </div>
                  </div>
                )}

                {message.type === "file" && (
                  <div className="bg-[#444444] border border-[#555555] rounded-lg p-3 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">PDF</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[#F9F1E2] text-sm font-medium">{message.fileName}</p>
                      <p className="text-[#B5B4AD] text-xs">{message.fileSize}</p>
                    </div>
                    <button className="text-yellow hover:text-yellow/80">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                <div className={`text-xs text-[#B5B4AD] mt-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Message Input */}
      <div className="bg-[#333333] border-t border-[#444444] p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="bg-[#444444] rounded-lg border border-[#555555] p-3">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full bg-transparent text-[#F9F1E2] placeholder-[#B5B4AD] resize-none focus:outline-none"
                rows={1}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <button className="text-[#B5B4AD] hover:text-[#F9F1E2] p-1">
                    <IoHappy className="h-5 w-5" />
                  </button>
                  <button className="text-[#B5B4AD] hover:text-[#F9F1E2] p-1">
                    <IoMic className="h-5 w-5" />
                  </button>
                  <button className="text-[#B5B4AD] hover:text-[#F9F1E2] p-1">
                    <IoAttach className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="text-yellow hover:text-yellow/80 disabled:text-[#B5B4AD] disabled:cursor-not-allowed p-1"
                >
                  <IoSend className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatView
