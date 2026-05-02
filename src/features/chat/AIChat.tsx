import { useState, useRef, useEffect } from 'react';

/**
 * Accessible AI Chat Interface.
 * Implements ARIA live regions, proper roles, and keyboard navigation.
 */
export const AIChat = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom and notify screen readers of new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: 'Thank you for your question. How can I assist you with the election process?' }]);
    }, 1000);
  };

  return (
    <section 
      className="ai-chat" 
      aria-labelledby="chat-heading"
      role="region"
    >
      <h2 id="chat-heading" className="sr-only">AI Civic Assistant</h2>
      
      <div 
        className="chat-window"
        role="log" 
        aria-live="polite" 
        aria-relevant="additions"
        ref={scrollRef}
        tabIndex={0}
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
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
};
