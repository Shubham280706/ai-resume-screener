'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const colors = {
  bg: '#050507',
  surface: '#0d0d10',
  border: 'rgba(255,255,255,0.07)',
  text: '#fafafa',
  muted: '#71717a',
  accent: '#007AFF',
  accentDark: '#0071e3',
}

const suggestedQuestions = [
  'Who are my top 3 React developers?',
  'Which candidates have AWS experience?',
  'Show me all senior-level candidates',
  'Compare candidates for the backend role',
]

export default function HiringAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Something went wrong'}`,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    setMessages([])
    setInput('')
  }

  if (isMobile && isOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: colors.bg,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ color: colors.text, fontSize: '16px', fontWeight: 600, margin: 0 }}>
            Hiring Assistant
          </h2>
          <button
            onClick={() => {
              setIsOpen(false)
              clearChat()
            }}
            style={{
              background: 'none',
              border: 'none',
              color: colors.muted,
              cursor: 'pointer',
              fontSize: '20px',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: 'auto',
                marginBottom: 'auto',
              }}
            >
              <p style={{ color: colors.muted, fontSize: '14px', margin: 0 }}>
                Ask me anything about your candidates and jobs:
              </p>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    backgroundColor: 'transparent',
                    color: colors.accent,
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    textAlign: 'left',
                    transition: 'all 150ms ease-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0,122,255,0.1)'
                    e.currentTarget.style.borderColor = colors.accent
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = colors.border
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor:
                        msg.role === 'user'
                          ? 'rgba(0,122,255,0.2)'
                          : 'rgba(255,255,255,0.05)',
                      color: colors.text,
                      fontSize: '13px',
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    padding: '10px 14px',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: colors.muted,
                      animation: 'dotBounce 1.4s infinite',
                    }}
                  />
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: colors.muted,
                      animation: 'dotBounce 1.4s infinite 0.2s',
                    }}
                  />
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: colors.muted,
                      animation: 'dotBounce 1.4s infinite 0.4s',
                    }}
                  />
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div
          style={{
            padding: '16px',
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            gap: '8px',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about candidates..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleSendMessage()
              }
            }}
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surface,
              color: colors.text,
              fontSize: '13px',
              outline: 'none',
              transition: 'all 150ms ease-out',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.accent
              e.currentTarget.style.backgroundColor = 'rgba(0,122,255,0.03)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.border
              e.currentTarget.style.backgroundColor = colors.surface
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: colors.accent,
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              opacity: loading || !input.trim() ? 0.5 : 1,
              transition: 'all 150ms ease-out',
            }}
            onMouseEnter={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.backgroundColor = colors.accentDark
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.accent
            }}
          >
            Send
          </button>
        </div>

        <style>{`
          @keyframes dotBounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.7; }
            40% { transform: translateY(-8px); opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
          } else {
            clearChat()
          }
        }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: 'none',
          background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          boxShadow: '0 8px 24px rgba(0,122,255,0.35)',
          transition: 'all 150ms ease-out',
          zIndex: 40,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,122,255,0.45)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,122,255,0.35)'
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: '380px',
            height: '520px',
            borderRadius: '16px',
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 40,
            animation: 'chatSlideUp 300ms cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px',
              borderBottom: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2 style={{ color: colors.text, fontSize: '14px', fontWeight: 600, margin: 0 }}>
              Hiring Assistant
            </h2>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.muted,
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  transition: 'all 150ms ease-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.color = colors.text
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = colors.muted
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                }}
              >
                <p style={{ color: colors.muted, fontSize: '13px', margin: 0 }}>
                  Ask me anything about your candidates and jobs:
                </p>
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: 'transparent',
                      color: colors.accent,
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 500,
                      textAlign: 'left',
                      transition: 'all 150ms ease-out',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0,122,255,0.1)'
                      e.currentTarget.style.borderColor = colors.accent
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.borderColor = colors.border
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '4px',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '80%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        backgroundColor:
                          msg.role === 'user'
                            ? 'rgba(0,122,255,0.2)'
                            : 'rgba(255,255,255,0.05)',
                        color: colors.text,
                        fontSize: '13px',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      padding: '10px 14px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: colors.muted,
                        animation: 'dotBounce 1.4s infinite',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: colors.muted,
                        animation: 'dotBounce 1.4s infinite 0.2s',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: colors.muted,
                        animation: 'dotBounce 1.4s infinite 0.4s',
                      }}
                    />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '12px',
              borderTop: `1px solid ${colors.border}`,
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleSendMessage()
                }
              }}
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.bg,
                color: colors.text,
                fontSize: '12px',
                outline: 'none',
                transition: 'all 150ms ease-out',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.accent
                e.currentTarget.style.backgroundColor = 'rgba(0,122,255,0.03)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.border
                e.currentTarget.style.backgroundColor = colors.bg
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: colors.accent,
                color: 'white',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600,
                opacity: loading || !input.trim() ? 0.5 : 1,
                transition: 'all 150ms ease-out',
              }}
              onMouseEnter={(e) => {
                if (!loading && input.trim()) {
                  e.currentTarget.style.backgroundColor = colors.accentDark
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.accent
              }}
            >
              Send
            </button>
          </div>

          <style>{`
            @keyframes chatSlideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes dotBounce {
              0%, 80%, 100% { transform: translateY(0); opacity: 0.7; }
              40% { transform: translateY(-8px); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  )
}
