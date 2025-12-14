import { useState, useEffect, useCallback } from 'react';

export function useChat(roomId, role, sender) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected] = useState(true); // Always connected for local chat

  // Send a message (stored locally)
  const sendMessage = useCallback(
    async (message, messageSender = sender) => {
      if (!message || !message.trim()) {
        throw new Error('Message cannot be empty');
      }

      try {
        setLoading(true);
        setError(null);

        // Create new message
        const newMessage = {
          id: Date.now() + Math.random(),
          sender: messageSender || 'Anonymous',
          message: message.trim(),
          timestamp: Date.now(),
          role: role,
        };

        // Add to local state
        setMessages((prev) => [...prev, newMessage].sort((a, b) => a.timestamp - b.timestamp));

        return { success: true, message: newMessage };
      } catch (err) {
        console.error('Error sending message:', err);
        setError('Failed to send message');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [sender, role]
  );

  // Load initial messages (empty for now)
  const loadInitialMessages = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      setMessages([]);
    } catch (err) {
      console.error('Error loading initial messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Get message count
  const getMessageCount = useCallback(() => {
    return messages.length;
  }, [messages]);

  // Get messages by sender
  const getMessagesBySender = useCallback(
    (senderName) => {
      return messages.filter((msg) => msg.sender === senderName);
    },
    [messages]
  );

  // Get latest message
  const getLatestMessage = useCallback(() => {
    return messages.length > 0 ? messages[messages.length - 1] : null;
  }, [messages]);

  // Check if sender has sent messages
  const hasSenderSentMessages = useCallback(
    (senderName) => {
      return messages.some((msg) => msg.sender === senderName);
    },
    [messages]
  );

  // Get unique senders
  const getUniqueSenders = useCallback(() => {
    const senders = new Set(messages.map((msg) => msg.sender));
    return Array.from(senders);
  }, [messages]);

  // Format message for display
  const formatMessage = useCallback(
    (message) => {
      return {
        ...message,
        formattedTime: new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        formattedDate: new Date(message.timestamp).toLocaleDateString(),
        isFromCurrentUser: message.sender === sender,
      };
    },
    [sender]
  );

  // Get formatted messages
  const getFormattedMessages = useCallback(() => {
    return messages.map(formatMessage);
  }, [messages, formatMessage]);

  // Initialize with empty messages
  useEffect(() => {
    if (roomId) {
      loadInitialMessages();
    }
  }, [roomId, loadInitialMessages]);

  return {
    // State
    messages,
    loading,
    error,
    isConnected,

    // Actions
    sendMessage,
    clearMessages,
    loadInitialMessages,

    // Getters
    getMessageCount,
    getMessagesBySender,
    getLatestMessage,
    hasSenderSentMessages,
    getUniqueSenders,
    getFormattedMessages,
  };
}
