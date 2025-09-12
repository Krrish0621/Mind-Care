"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.5
    }
  }, [])

  const toggleMute = () => {
    const audio = audioRef.current
    if (audio) {
      audio.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} loop src="/music/relaxing.mp3" />
      <button
        onClick={toggleMute}
        className="bg-white/70 hover:bg-white rounded-full p-2 shadow-md backdrop-blur transition"
        aria-label="Toggle Music"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  )
}
