import { trackMetric, trackError, trackPerformance } from '../utils/monitoring';
import { trackPageView, trackEvent, trackInteraction } from '../utils/analytics';

/**
 * useAnalytics Hook
 *
 * Centralizes all analytics and monitoring calls for the application.
 * Provides consistent tracking patterns and error handling.
 */
function useAnalytics() {
  // Room creation analytics
  const trackRoomCreation = {
    attempt: () => trackMetric('room.creation.attempt', 1),
    success: (roomId, duration) => {
      trackPerformance('room.creation.time', duration);
      trackMetric('room.creation.success', 1);
      trackEvent('room_created', { roomId });
    },
    error: (error) => {
      trackError(error, { action: 'createRoom' });
      trackMetric('room.creation.error', 1);
    },
  };

  // Room joining analytics
  const trackRoomJoining = {
    attempt: () => trackMetric('room.join.attempt', 1),
    success: (roomId) => {
      trackEvent('room_joined', { roomId });
    },
    error: (reason) => {
      trackMetric('room.join.error', 1, { reason });
    },
  };

  // Navigation analytics
  const trackNavigation = (from, to) => {
    trackEvent('navigation', { from, to });
    trackPageView(to);
  };

  // User interaction analytics
  const trackUserInteraction = (element, action, metadata = {}) => {
    trackInteraction(element, action);
    if (Object.keys(metadata).length > 0) {
      trackEvent('user_interaction', { element, action, ...metadata });
    }
  };

  // Performance tracking
  const trackPerformanceMetric = (name, value, metadata = {}) => {
    trackPerformance(name, value);
    if (Object.keys(metadata).length > 0) {
      trackEvent('performance_metric', { name, value, ...metadata });
    }
  };

  // Error tracking
  const trackApplicationError = (error, context = {}) => {
    trackError(error, context);
    trackEvent('application_error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  };

  return {
    trackRoomCreation,
    trackRoomJoining,
    trackNavigation,
    trackUserInteraction,
    trackPerformanceMetric,
    trackApplicationError,
  };
}

export default useAnalytics;
export { useAnalytics };
