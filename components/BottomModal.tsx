"use client"
import type React from "react"

import ReactDOM from "react-dom"
import AnimatedDiv from "./AnimatedDiv"

interface BottomSheetModalProps {
  children: React.ReactNode
  closeFn: () => void
  className?: string
}

const BottomSheetModal = ({ children, closeFn, className }: BottomSheetModalProps) => {
  return ReactDOM.createPortal(
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#F2E8CF0A] bg-opacity-20 backdrop-blur-sm " onClick={closeFn} />

      {/* Bottom Sheet Container */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <AnimatedDiv
          initialY="100%"
          animateY={0}
          exitY="100%"
          duration={0.3}
          className="bg-[#333333] rounded-t-[30px] shadow-2xl border-t border-l border-r border-[#444444] max-h-[90vh] overflow-x-scroll"
          onClick={(e) => e.stopPropagation()}
        >

          {children}
        </AnimatedDiv>
      </div>
    </div>,
    document.body,
  )
}

export default BottomSheetModal
