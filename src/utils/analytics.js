/**
 * Analytics and Usage Tracking
 * Provides user behavior tracking and analytics integration
 */

class AnalyticsService {
  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.sessionId = AnalyticsService.generateSessionId();
    this.userId = AnalyticsService.getOrCreateUserId();
    this.events = [];
    this.pageViews = [];
  }

  /**
   * Generate a unique session ID
   * @returns {string} Session ID
   */
  static generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get or create a user ID
   * @returns {string} User ID
   */
  static getOrCreateUserId() {
    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }

  /**
   * Track a page view
   * @param {string} page - Page name
   * @param {Object} properties - Additional properties
   */
  trackPageView(page, properties = {}) {
    const event = {
      type: 'page_view',
      page,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: Date.now(),
        url: window.location.href,
        referrer: document.referrer,
      },
    };

    this.pageViews.push(event);
    console.log('Page view tracked:', event);

    if (this.isEnabled) {
      AnalyticsService.sendToAnalytics(event);
    }
  }

  /**
   * Track a custom event
   * @param {string} eventName - Event name
   * @param {Object} properties - Event properties
   */
  trackEvent(eventName, properties = {}) {
    const event = {
      type: 'event',
      name: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: Date.now(),
      },
    };

    this.events.push(event);
    console.log('Event tracked:', event);

    if (this.isEnabled) {
      AnalyticsService.sendToAnalytics(event);
    }
  }

  /**
   * Track user interaction
   * @param {string} element - Element identifier
   * @param {string} action - Action performed
   * @param {Object} properties - Additional properties
   */
  trackInteraction(element, action, properties = {}) {
    this.trackEvent('user_interaction', {
      element,
      action,
      ...properties,
    });
  }

  /**
   * Track screen sharing events
   * @param {string} action - Action (start, stop, error)
   * @param {Object} properties - Additional properties
   */
  trackScreenShare(action, properties = {}) {
    this.trackEvent('screen_share', {
      action,
      ...properties,
    });
  }

  /**
   * Track chat events
   * @param {string} action - Action (send, receive, error)
   * @param {Object} properties - Additional properties
   */
  trackChat(action, properties = {}) {
    this.trackEvent('chat', {
      action,
      ...properties,
    });
  }

  /**
   * Track WebRTC events
   * @param {string} action - Action (connect, disconnect, error)
   * @param {Object} properties - Additional properties
   */
  trackWebRTC(action, properties = {}) {
    this.trackEvent('webrtc', {
      action,
      ...properties,
    });
  }

  /**
   * Track performance metrics
   * @param {string} metric - Metric name
   * @param {number} value - Metric value
   * @param {Object} properties - Additional properties
   */
  trackPerformance(metric, value, properties = {}) {
    this.trackEvent('performance', {
      metric,
      value,
      ...properties,
    });
  }

  /**
   * Track errors
   * @param {Error} error - Error object
   * @param {Object} context - Error context
   */
  trackError(error, context = {}) {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  /**
   * Get session summary
   * @returns {Object} Session summary
   */
  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      pageViews: this.pageViews.length,
      events: this.events.length,
      duration: Date.now() - (this.pageViews[0]?.properties.timestamp || Date.now()),
      startTime: this.pageViews[0]?.properties.timestamp || Date.now(),
    };
  }

  /**
   * Get all events
   * @returns {Array} Array of events
   */
  getAllEvents() {
    return [...this.pageViews, ...this.events];
  }

  /**
   * Clear all data
   */
  clear() {
    this.events = [];
    this.pageViews = [];
  }

  /**
   * Send data to analytics service (placeholder)
   * @param {Object} event - Event to send
   */
  static sendToAnalytics(event) {
    // In a real implementation, this would send to services like:
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - Custom analytics service
    
    console.log('Would send to analytics service:', event);
  }

  /**
   * Identify user
   * @param {Object} traits - User traits
   */
  identify(traits) {
    const event = {
      type: 'identify',
      userId: this.userId,
      traits,
      timestamp: Date.now(),
    };

    console.log('User identified:', event);

    if (this.isEnabled) {
      AnalyticsService.sendToAnalytics(event);
    }
  }

  /**
   * Set user properties
   * @param {Object} properties - User properties
   */
  setUserProperties(properties) {
    localStorage.setItem('analytics_user_properties', JSON.stringify(properties));
    this.identify(properties);
  }

  /**
   * Get user properties
   * @returns {Object} User properties
   */
  static getUserProperties() {
    const stored = localStorage.getItem('analytics_user_properties');
    return stored ? JSON.parse(stored) : {};
  }
}

// Create singleton instance
const analytics = new AnalyticsService();

// Track initial page view
if (typeof window !== 'undefined') {
  analytics.trackPageView('home', {
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  });

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      analytics.trackEvent('page_visible');
    } else {
      analytics.trackEvent('page_hidden');
    }
  });

  // Track before unload
  window.addEventListener('beforeunload', () => {
    const summary = analytics.getSessionSummary();
    analytics.trackEvent('session_end', summary);
  });
}

export default analytics;

// Export individual functions for convenience
export const trackPageView = (page, properties) => analytics.trackPageView(page, properties);
export const trackEvent = (eventName, properties) => analytics.trackEvent(eventName, properties);
export const trackInteraction = (element, action, properties) => analytics.trackInteraction(element, action, properties);
export const trackScreenShare = (action, properties) => analytics.trackScreenShare(action, properties);
export const trackChat = (action, properties) => analytics.trackChat(action, properties);
export const trackWebRTC = (action, properties) => analytics.trackWebRTC(action, properties);
export const trackPerformance = (metric, value, properties) =>
  analytics.trackPerformance(metric, value, properties);
export const trackError = (error, context) => analytics.trackError(error, context);
export const identify = (traits) => analytics.identify(traits);
export const setUserProperties = (properties) => analytics.setUserProperties(properties);
export const getUserProperties = () => AnalyticsService.getUserProperties();
export const getSessionSummary = () => analytics.getSessionSummary();
