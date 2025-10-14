import { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';

function Chat({ roomId, role, viewerId }) {
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState(viewerId || role);
  const messagesEndRef = useRef(null);

  const { messages, sendMessage, loading, error, isConnected } = useChat(roomId, role, sender);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update sender when viewerId changes
  useEffect(() => {
    if (viewerId) {
      setSender(viewerId);
    }
  }, [viewerId]);

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || !sender.trim()) {
      return;
    }

    try {
      await sendMessage(message.trim(), sender.trim());
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get message sender display name
  const getSenderDisplayName = (msgSender) => {
    if (msgSender === 'host') {
      return '🖥️ Host';
    }
    if (msgSender.startsWith('viewer_')) {
      return `👀 ${msgSender}`;
    }
    return `👤 ${msgSender}`;
  };

  return (
    <div className='flex flex-col h-full bg-white'>
      {/* Chat Header */}
      <div className='flex-shrink-0 bg-blue-600 text-white p-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>💬 Chat</h3>
          <div className='flex items-center space-x-2'>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className='text-sm'>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        <p className='text-blue-100 text-sm mt-1'>Room: {roomId}</p>
      </div>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-3'>
        {loading && messages.length === 0 && (
          <div className='text-center text-gray-500 py-4'>
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2'></div>
            Loading messages...
          </div>
        )}

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
            <div className='text-red-600 text-sm'>⚠️ {error}</div>
          </div>
        )}

        {messages.length === 0 && !loading && (
          <div className='text-center text-gray-500 py-8'>
            <div className='text-4xl mb-2'>💬</div>
            <p>No messages yet</p>
            <p className='text-sm'>Start the conversation!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === sender ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                msg.sender === sender ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.sender !== sender && (
                <div className='text-xs font-medium text-gray-600 mb-1'>{getSenderDisplayName(msg.sender)}</div>
              )}
              <div className='text-sm whitespace-pre-wrap break-words'>{msg.message}</div>
              <div className={`text-xs mt-1 ${msg.sender === sender ? 'text-blue-100' : 'text-gray-500'}`}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className='flex-shrink-0 border-t bg-gray-50 p-4'>
        <form onSubmit={handleSendMessage} className='space-y-3'>
          {/* Sender Name Input */}
          <div>
            <input
              type='text'
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder='Your name'
              className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              maxLength={50}
            />
          </div>

          {/* Message Input */}
          <div className='flex space-x-2'>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Type your message... (Enter to send, Shift+Enter for new line)'
              className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
              rows={2}
              maxLength={500}
            />
            <button
              type='submit'
              disabled={!message.trim() || !sender.trim() || loading}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                !message.trim() || !sender.trim() || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div> : 'Send'}
            </button>
          </div>

          {/* Character Count */}
          <div className='flex justify-between text-xs text-gray-500'>
            <span>{message.length}/500 characters</span>
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
        </form>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className='flex-shrink-0 bg-yellow-50 border-t border-yellow-200 p-3'>
          <div className='flex items-center text-yellow-800'>
            <div className='w-2 h-2 bg-yellow-400 rounded-full mr-2'></div>
            <span className='text-sm'>Reconnecting to chat...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
