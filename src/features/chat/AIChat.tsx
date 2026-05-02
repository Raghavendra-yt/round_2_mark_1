import React, { useState, useRef, useEffect, useCallback, memo, ChangeEvent, KeyboardEvent } from 'react';
import DOMPurify from 'dompurify';

/**
 * Message data structure for the AI Chat.
 */
interface ChatMessage {
  /** The sender's role: 'user' or 'ai'. */
  role: 'user' | 'ai';
  /** The text content of the message. */
  text: string;
}

/**
 * Accessible AI Chat Interface.
 * Implements ARIA live regions, proper roles, and keyboard navigation.
 * Uses DOMPurify to sanitize all user inputs before processing.
 * 
 * @component
 */
export const AIChat: React.FC = memo(() => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scrolls the chat window to the latest message.
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Processes and sends the user message.
   * Sanitizes input using DOMPurify before adding to state.
   */
  const handleSend = useCallback((): void => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Sanitize input
    const sanitizedInput = DOMPurify.sanitize(trimmedInput) as string;
    
    setMessages(prev => [...prev, { role: 'user', text: sanitizedInput }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Thank you for your question. How can I assist you with the election process?' 
      }]);
    }, 1000);
  }, [input]);

  /**
   * Handles keyboard events for the input field.
   */
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSend();
    }
  }, [handleSend]);

  /**
   * Handles input change events.
   */
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  }, []);

  return (
    <section 
      className="ai-chat" 
      aria-labelledby="chat-heading"
    >
      <h2 id="chat-heading" className="sr-only">AI Civic Assistant</h2>
      
      <div 
        className="chat-window"
        role="log" 
        aria-live="polite" 
        aria-relevant="additions"
        ref={scrollRef}
        aria-label="Chat message history"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`chat-msg ${msg.role}`}
            role="article"
            aria-label={`${msg.role === 'user' ? 'You said' : 'AI Assistant said'}`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="chat-input-area" role="group" aria-label="Send a message">
        <input 
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about voting..."
          aria-label="Type your message"
          className="chat-input"
        />
        <button 
          onClick={handleSend}
          aria-label="Send message"
          className="btn-primary"
        >
          Send
        </button>
      </div>
    </section>
  );
});

AIChat.displayName = 'AIChat';
