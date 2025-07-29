"use client"

import { IoSearch, IoEllipsisVertical } from "react-icons/io5"
import { useState } from "react"
import Image from "next/image"

interface ChatContact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  isOnline: boolean
  unreadCount?: number
  isAudio?: boolean
}

interface ChatSidebarProps {
  contacts: ChatContact[]
  activeContactId?: string
  onContactSelect: (contactId: string) => void
}

const ChatSidebar = ({ contacts, activeContactId, onContactSelect }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="w-80 bg-[#2A2A2A] border-r border-[#444444] flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#444444]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#F9F1E2]">Chats</h2>
          <button className="text-[#B5B4AD] hover:text-[#F9F1E2]">
            <IoEllipsisVertical className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B5B4AD] h-4 w-4" />
          <input
            type="text"
            placeholder="Search message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#444444] rounded-lg pl-10 pr-4 py-2 text-[#F9F1E2] placeholder-[#B5B4AD] focus:outline-none focus:border-yellow"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.length > 0 ? (
          filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => onContactSelect(contact.id)}
                className={`p-4 border-b border-[#444444] cursor-pointer hover:bg-[#333333] transition-colors ${
                  activeContactId === contact.id ? "bg-[#333333]" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#444444] flex items-center justify-center">
                      {contact.avatar && contact.avatar !== "" ? (
                        <Image
                          src={contact.avatar || "/avatar.png"}
                          alt={contact.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-[#F9F1E2] font-bold text-lg">
                          {contact.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#2A2A2A]"></div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-[#F9F1E2] font-medium truncate">{contact.name}</h3>
                      <span className="text-[#B5B4AD] text-xs">{contact.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {contact.isAudio && (
                          <div className="w-4 h-4 bg-[#444444] rounded flex items-center justify-center">
                            <span className="text-[#F9F1E2] text-xs">🎵</span>
                          </div>
                        )}
                        <p className="text-[#B5B4AD] text-sm truncate">{contact.lastMessage}</p>
                      </div>
                      {contact.unreadCount && (
                        <div className="w-5 h-5 bg-yellow rounded-full flex items-center justify-center">
                          <span className="text-[#1A1203] text-xs font-bold">{contact.unreadCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-[#B5B4AD]">No chats found</p>
            </div>
          )
        ) : (
          /* Empty sidebar state */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#444444] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#666666]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-[#B5B4AD] text-sm">No conversations yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatSidebar
