import { useEffect, useRef, useState } from "react";
import { Loader, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { getAIResponse } from "../../services/geminiAPI";
import "../styles/FloatingOmaAi.css";

const suggestedPrompts = [
  "Help me plan an event",
  "Find a speaker",
  "How do I set a budget?",
];

function buildPageContext() {
  if (typeof document === "undefined") return "";

  const title = document.title || "";
  const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, .chart-title, .analysis-title, .stat-label, .notification-item, .header-welcome p"))
    .map((node) => node.textContent?.trim())
    .filter(Boolean);

  const stats = Array.from(document.querySelectorAll(".stat-card, .analysis-stats, .dashboard-header-new, .analytics-section"))
    .map((node) => node.textContent?.trim())
    .filter(Boolean);

  return [...new Set([title, ...headings, ...stats])].join(" | ").slice(0, 1200);
}

export default function FloatingOmaAi() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey! I'm OMA, your event sidekick. I can help you find talent, plan your event, or make sense of your budget. What are you dreaming up?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const sendMessage = async (message) => {
    const text = message.trim();
    if (!text || isLoading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text, timestamp: new Date() },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getAIResponse(text, buildPageContext());
      setMessages((previous) => [
        ...previous,
        { role: "ai", text: response, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error("Error getting OMA AI response:", error);
      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          text: "I couldn't connect just now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  const closeChat = () => {
    setIsOpen(false);
    toggleRef.current?.focus();
  };

  const toggleChat = () => setIsOpen((open) => !open);

  return (
    <>
      <button
        ref={toggleRef}
        className={`floating-oma-button ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
        type="button"
        aria-label={isOpen ? "Close OMA chat" : "Chat with OMA"}
        aria-expanded={isOpen}
        aria-controls="floating-oma-chat"
      >
        {isOpen ? <X size={21} aria-hidden="true" /> : <MessageCircle size={21} aria-hidden="true" />}
        <span>{isOpen ? "Close" : "Ask OMA"}</span>
      </button>

      {isOpen && (
        <section
          className="floating-oma-container"
          id="floating-oma-chat"
          aria-labelledby="floating-oma-title"
        >
          <header className="floating-oma-header">
            <span className="floating-oma-avatar"><Sparkles size={18} aria-hidden="true" /></span>
            <div className="floating-oma-heading">
              <h2 id="floating-oma-title">OMA event sidekick</h2>
              <span>Here for your next big moment</span>
            </div>
            <button
              onClick={closeChat}
              className="close-button"
              type="button"
              aria-label="Close OMA chat"
            >
              <X size={19} aria-hidden="true" />
            </button>
          </header>

          <div className="floating-oma-messages" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message, index) => (
              <div
                key={`${message.timestamp.getTime()}-${index}`}
                className={`floating-message ${message.role}-message`}
              >
                <div className="message-content"><p>{message.text}</p></div>
                <time className="message-time" dateTime={message.timestamp.toISOString()} aria-hidden="true">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </time>
              </div>
            ))}
            {messages.length === 1 && !isLoading && (
              <div className="floating-oma-suggestions" role="group" aria-label="Try asking OMA">
                {suggestedPrompts.map((prompt) => (
                  <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            {isLoading && (
              <div className="floating-message ai-message loading">
                <div className="message-content">
                  <Loader size={16} className="spinner" aria-hidden="true" />
                  <p>Putting the ideas together...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="floating-oma-input" onSubmit={handleSubmit}>
            <label className="floating-oma-sr-only" htmlFor="floating-oma-message">Message OMA</label>
            <input
              ref={inputRef}
              id="floating-oma-message"
              type="text"
              placeholder="Ask me anything about your event"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="send-button"
              aria-label="Send message"
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
