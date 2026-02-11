import React, { useEffect, useState, useRef } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { db, auth } from '../utils/firestore'

function Intro() {
  const [image, setImage] = useState(null)
  const [value, setValue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const typingIntervalRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMessage = async () => {
      if (!auth.currentUser?.email) {
        setError('No user logged in')
        setLoading(false)
        return
      }

      try {
        const docRef = doc(
          db,
          'Senders',
          auth.currentUser.email,
          'message1',
          'message'
        )
        
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          setImage(data.image || null)
          setValue(data.value || null)
        } else {
          setError('Message not found')
        }
      } catch (err) {
        console.error('Error fetching message:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMessage()
  }, [])

  // Typing animation effect
  useEffect(() => {
    if (!value || loading) return

    setIsTyping(true)
    setDisplayedText('')
    let currentIndex = 0

    const typeSpeed = 30 // milliseconds per character

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < value.length) {
        setDisplayedText(value.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingIntervalRef.current)
        setIsTyping(false)
        setIsComplete(true)
      }
    }, typeSpeed)

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
      }
    }
  }, [value, loading])

  const handleSkip = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
    }
    setDisplayedText(value || '')
    setIsTyping(false)
    setIsComplete(true)
  }

  const handleSeeMore = () => {
    navigate('/game1')
  }

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-primary-soft to-secondary-soft py-2 px-6 flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-gradient-to-br from-primary-soft to-secondary-soft py-2 px-6 flex justify-center items-center min-h-screen">
        <div className="text-error text-xl">Error: {error}</div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-br from-primary-soft to-secondary-soft py-2 px-6 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-5xl bg-sruface-glass backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-black/60">
        <div className="relative w-full">
          
          {/* SKIP BUTTON */}
          {isTyping && (
            <div className="absolute top-3 right-3 z-50">
              <button
                onClick={handleSkip}
                className="px-4 py-2 rounded-xl bg-primary/80 text-white hover:bg-primary-hover transition text-sm font-medium"
              >
                Skip
              </button>
            </div>
          )}
          
          {/* TYPING MESSAGE */}
          <div className="w-full min-h-120 md:min-h-150 p-6 rounded-2xl bg-surface-main border border-secondary-soft text-primary-text text-lg">
            <p className="whitespace-pre-wrap">
              {displayedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>
          </div>

          {/* SEE MORE BUTTON */}
          {isComplete && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSeeMore}
                className="px-8 py-4 rounded-xl bg-primary text-white hover:bg-primary-hover transition font-semibold text-lg shadow-lg"
              >
                See More
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}    

export default Intro