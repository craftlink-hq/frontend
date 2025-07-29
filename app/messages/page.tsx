"use client"

import { useState } from "react"
import ChatSidebar from "@/components/Chat/ChatSidebar"
import ChatView from "@/components/Chat/ChatView"
import EmptyChat from "@/components/Chat/EmptyChat"
import Header from "@/components/Header"
import Footer from "@/components/LandingPage/Footer";

interface MessageData {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    type: "text" | "image" | "file";
    fileUrl?: string;
    fileName?: string;
    fileSize?: string;
}

// Sample data - you can modify this to test different states
const sampleContacts = [
  {
    id: "dammy",
    name: "Dammy",
    avatar: "/avatar.png",
    lastMessage: "Hey, I saw your portfolio and I'd love a custom bridal gown with a modern touch.",
    timestamp: "4:56 PM",
    isOnline: true,
    unreadCount: 1,
  },
  {
    id: "0x12abcd",
    name: "0X12...abcd",
    avatar: "/avatar.png",
    lastMessage: "Audio",
    timestamp: "4:30 PM",
    isOnline: false,
    isAudio: true,
  },
  {
    id: "0x56abcd",
    name: "0X56...abcd",
    avatar: "/avatar.png",
    lastMessage: "Thanks for the update. Let me know if there's anyth...",
    timestamp: "4:30 PM",
    isOnline: false,
  },
]

const sampleMessages: MessageData[] = [
  {
    id: "1",
    senderId: "dammy",
    content: "Hey, I saw your portfolio and I'd love a custom bridal gown with a modern touch.",
    timestamp: "4:56 pm",
    type: "text" as const,
  },
  {
    id: "2",
    senderId: "current-user",
    content: "Thank you! That sounds exciting. Do you have any references or ideas in mind?",
    timestamp: "4:56 pm",
    type: "text" as const,
  },
  {
    id: "3",
    senderId: "dammy",
    content: "",
    timestamp: "4:56 pm",
    type: "image" as const,
    fileUrl: "/file.png",
  },
  {
    id: "4",
    senderId: "dammy",
    content: "",
    timestamp: "4:56 pm",
    type: "file" as const,
    fileName: "File.pdf",
    fileSize: "15 Oct, 2024 • 500 KB • PDF",
  },
  {
    id: "5",
    senderId: "current-user",
    content: "I can work with this.",
    timestamp: "4:56 pm",
    type: "text" as const,
  },
]

export default function MessagesPage() {
  // Toggle this to test empty state: [] for empty, sampleContacts for populated
  const [contacts] = useState(sampleContacts) // Change to [] to test empty state
  const [activeContactId, setActiveContactId] = useState<string | undefined>(contacts.length > 0 ? "dammy" : undefined)
  const [messages, setMessages] = useState(sampleMessages)

  const activeContact = contacts.find((contact) => contact.id === activeContactId)

  const handleContactSelect = (contactId: string) => {
    setActiveContactId(contactId)
  }

  const handleSendMessage = (content: string, type: "text" | "image" | "file") => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: "current-user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type,
    }
    setMessages([...messages, newMessage])
  }

  // Determine what to show in the main area
  const renderMainContent = () => {
    // If no contacts exist, show empty state
    if (contacts.length === 0) {
      return <EmptyChat />
    }

    // If contacts exist but none selected, show empty state
    if (!activeContact) {
      return <EmptyChat />
    }

    // Show active chat
    return (
      <ChatView
        contact={activeContact}
        messages={messages}
        currentUserId="current-user"
        onSendMessage={handleSendMessage}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <ChatSidebar contacts={contacts} activeContactId={activeContactId} onContactSelect={handleContactSelect} />

        {/* Conditional rendering for main content */}
        {renderMainContent()}
      </div>

      <Footer />
    </div>
  )
}
