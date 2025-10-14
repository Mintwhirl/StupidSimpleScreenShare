import { useState, useEffect, useRef, useCallback } from 'react';
import { useApi } from './useApi';

export function useChat(roomId, role, sender) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);

  const { sendChatMessage: apiSendMessage, getChatMessages: apiGetMessages } = useApi();
  const pollingIntervalRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Poll for new messages
  const pollMessages = useCallback(async () => {
    if (!roomId || !isConnected) return;

    try {
      const data = await apiGetMessages(roomId, lastMessageTime);

      if (data.messages && data.messages.length > 0) {
        setMessages((prevMessages) => {
          // Filter out duplicates and merge with existing messages
          const existingIds = new Set(prevMessages.map((msg) => msg.id));
          const newMessages = data.messages.filter((msg) => !existingIds.has(msg.id));

          if (newMessages.length > 0) {
            // Update last message time
            const latestTime = Math.max(...newMessages.map((msg) => msg.timestamp));
            setLastMessageTime(latestTime);

            return [...prevMessages, ...newMessages].sort((a, b) => a.timestamp - b.timestamp);
          }

          return prevMessages;
        });
      }
    } catch (err) {
      console.error('Error polling messages:', err);
      setError('Failed to fetch messages');
      setIsConnected(false);

      // Attempt to reconnect
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      reconnectTimeoutRef.current = setTimeout(() => {
        setIsConnected(true);
        setError(null);
      }, 5000);
    }
  }, [roomId, lastMessageTime, isConnected, apiGetMessages]);

  // Start polling for messages
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(pollMessages, 2000); // Poll every 2 seconds
  }, [pollMessages]);

  // Stop polling for messages
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Initialize chat connection
  useEffect(() => {
    if (roomId && sender) {
      setIsConnected(true);
      setError(null);
      setMessages([]);
      setLastMessageTime(0);
      startPolling();
    } else {
      setIsConnected(false);
      stopPolling();
    }

    return () => {
      stopPolling();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [roomId, sender, startPolling, stopPolling]);

  // Send a message
  const sendMessage = useCallback(
    async (message, messageSender = sender) => {
      if (!roomId || !messageSender || !message.trim()) {
        throw new Error('Room ID, sender, and message are required');
      }

      try {
        setLoading(true);
        setError(null);

        const data = await apiSendMessage(roomId, message, messageSender);

        if (data.ok) {
          // Add the sent message to the local state immediately
          const newMessage = {
            id: data.message.id,
            sender: messageSender,
            message: message,
            timestamp: data.message.timestamp,
          };

          setMessages((prevMessages) => [...prevMessages, newMessage].sort((a, b) => a.timestamp - b.timestamp));
          setLastMessageTime(data.message.timestamp);

          return data.message;
        } else {
          throw new Error('Failed to send message');
        }
      } catch (err) {
        console.error('Error sending message:', err);
        setError(`Failed to send message: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [roomId, sender, apiSendMessage]
  );

  // Load initial messages
  const loadInitialMessages = useCallback(async () => {
    if (!roomId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await apiGetMessages(roomId, 0);

      if (data.messages) {
        setMessages(data.messages.sort((a, b) => a.timestamp - b.timestamp));

        if (data.messages.length > 0) {
          const latestTime = Math.max(...data.messages.map((msg) => msg.timestamp));
          setLastMessageTime(latestTime);
        }
      }
    } catch (err) {
      console.error('Error loading initial messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [roomId, apiGetMessages]);

  // Load initial messages when room changes
  useEffect(() => {
    if (roomId) {
      loadInitialMessages();
    }
  }, [roomId, loadInitialMessages]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastMessageTime(0);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [stopPolling]);

  return {
    // State
    messages,
    loading,
    error,
    isConnected,
    lastMessageTime,

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
