import { useState, useRef, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const STORAGE_KEY_CONVERSATION_ID = 'chatbot_conversation_id';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
{
    id: 'welcome',
    role: 'assistant',
    text: "hey iam here to help you. Ask me anything.",
},
  ]);
const [inputValue, setInputValue] = useState('');
const [sending, setSending] = useState(false);
const [error, setError] = useState('');

const conversationIdRef = useRef(localStorage.getItem(STORAGE_KEY_CONVERSATION_ID) || null);
const messagesEndRef = useRef(null);
const inputRef = useRef(null);

useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages, sending]);

useEffect(() => {
    if (isOpen) {
    inputRef.current?.focus();
    }
  }, [isOpen]);

const handleSend = async (e) => {
    e.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed || sending) return;

    const userMessage = { id: `user-${Date.now()}`, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setSending(true);
    setError('');

    try {
    const { data } = await axiosInstance.post('/chatbot/message', {
        message: trimmed,
        conversationId: conversationIdRef.current,
    });

    const { reply, conversationId } = data.data;

    if (conversationId) {
        conversationIdRef.current = conversationId;
        localStorage.setItem(STORAGE_KEY_CONVERSATION_ID, conversationId);
    }

    setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: 'assistant', text: reply },
    ]);
    } catch (err) {
    const message = err.response?.data?.message || 'Something went wrong. Please try again.';
    setError(message);
    setMessages((prev) => [
        ...prev,
        { id: `error-${Date.now()}`, role: 'assistant', text: message, isError: true },
    ]);
    } finally {
    setSending(false);
    }
};

  const handleNewConversation = () => {
    conversationIdRef.current = null;
    localStorage.removeItem(STORAGE_KEY_CONVERSATION_ID);
    setMessages([
    {
        id: 'welcome',
        role: 'assistant',
        text: "Started a new conversation. What would you like to know?",
    },
    ]);
    setError('');
};

return (
    <>
    <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="btn btn-primary rounded-circle shadow"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'} fs-4`}></i>
      </button>

/** chat bot panel */
      {isOpen && (
        <div
          className="card shadow-lg"
          style={{
            position: 'fixed',
            bottom: '92px',
            right: '24px',
            width: '360px',
            maxWidth: 'calc(100vw - 32px)',
            height: '480px',
            maxHeight: 'calc(100vh - 120px)',
            zIndex: 1049,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between py-2">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-robot fs-5"></i>
              <strong className="small">Feedback Assistant</strong>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-link text-white text-decoration-none p-0"
              onClick={handleNewConversation}
              title="Start a new conversation"
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>

          {/* Message list */}
          <div
            className="flex-grow-1 overflow-auto px-3 py-2 bg-light"
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {messages.map((msg) => (
              <ChatBubble key={msg.id} role={msg.role} text={msg.text} isError={msg.isError} />
            ))}

            {sending && (
              <div className="d-flex align-items-center gap-2 text-muted small">
                <span className="spinner-grow spinner-grow-sm" role="status"></span>
                Typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="card-footer bg-white p-2">
            <div className="input-group">
              <input
                ref={inputRef}
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={sending}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={sending || !inputValue.trim()}
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

const ChatBubble = ({ role, text, isError }) => {
  const isUser = role === 'user';

  return (
    <div className={`d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <div
        className={`px-3 py-2 rounded-3 small ${
          isUser
            ? 'bg-primary text-white'
            : isError
            ? 'bg-danger-subtle text-danger-emphasis border border-danger-subtle'
            : 'bg-white border'
        }`}
        style={{ maxWidth: '80%', whiteSpace: 'pre-wrap' }}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatWidget;