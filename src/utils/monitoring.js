/**
 * Monitoring and Observability Utilities
 * Provides metrics collection, error tracking, and performance monitoring
 */

class MonitoringService {
  constructor() {
    this.metrics = new Map();
    this.errors = [];
    this.performance = {
      pageLoad: null,
      connectionTime: null,
      messageLatency: [],
    };
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  /**
   * Track a custom metric
   * @param {string} name - Metric name
   * @param {number} value - Metric value
   * @param {Object} tags - Additional tags
   */
  trackMetric(name, value, tags = {}) {
    if (!this.isEnabled) return;

    const metric = {
      name,
      value,
      tags,
      timestamp: Date.now(),
    };

    this.metrics.set(name, metric);
    console.log('Metric tracked:', metric);
  }

  /**
   * Track an error
   * @param {Error} error - The error object
   * @param {Object} context - Additional context
   */
  trackError(error, context = {}) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.errors.push(errorData);
    console.error('Error tracked:', errorData);

    // In production, send to error tracking service
    if (this.isEnabled) {
      MonitoringService.sendErrorToService(errorData);
    }
  }

  /**
   * Track performance metrics
   * @param {string} name - Performance metric name
   * @param {number} value - Performance value in milliseconds
   */
  trackPerformance(name, value) {
    if (!this.isEnabled) return;

    this.performance[name] = value;
    console.log(`Performance: ${name} = ${value}ms`);
  }

  /**
   * Track WebRTC connection metrics
   * @param {RTCPeerConnection} peerConnection - The peer connection
   */
  trackWebRTCStats(peerConnection) {
    if (!peerConnection || !this.isEnabled) return;

    peerConnection.getStats().then((_stats) => {
      _stats.forEach((report) => {
        if (report.type === 'candidate-pair' && report.state === 'succeeded') {
          this.trackMetric('webrtc.connection.success', 1);
          this.trackPerformance('webrtc.connection.time', report.currentRoundTripTime * 1000);
        }
      });
    });
  }

  /**
   * Track chat message latency
   * @param {number} startTime - Message send start time
   * @param {number} endTime - Message received time
   */
  trackMessageLatency(startTime, endTime) {
    const latency = endTime - startTime;
    this.performance.messageLatency.push(latency);

    // Keep only last 100 measurements
    if (this.performance.messageLatency.length > 100) {
      this.performance.messageLatency.shift();
    }

    this.trackMetric('chat.message.latency', latency);
  }

  /**
   * Get performance summary
   * @returns {Object} Performance summary
   */
  getPerformanceSummary() {
    const messageLatency = this.performance.messageLatency;
    const avgLatency =
      messageLatency.length > 0 ? messageLatency.reduce((a, b) => a + b, 0) / messageLatency.length : 0;

    return {
      pageLoad: this.performance.pageLoad,
      connectionTime: this.performance.connectionTime,
      averageMessageLatency: avgLatency,
      messageCount: messageLatency.length,
      errorCount: this.errors.length,
    };
  }

  /**
   * Get all metrics
   * @returns {Array} Array of metrics
   */
  getAllMetrics() {
    return Array.from(this.metrics.values());
  }

  /**
   * Get all errors
   * @returns {Array} Array of errors
   */
  getAllErrors() {
    return this.errors;
  }

  /**
   * Clear all data
   */
  clear() {
    this.metrics.clear();
    this.errors = [];
    this.performance = {
      pageLoad: null,
      connectionTime: null,
      messageLatency: [],
    };
  }

  /**
   * Send error to external service (placeholder)
   * @param {Object} errorData - Error data to send
   */
  static sendErrorToService(errorData) {
    // In a real implementation, this would send to services like:
    // - Sentry
    // - LogRocket
    // - Bugsnag
    // - Custom analytics service

    console.log('Would send error to service:', errorData);
  }

  /**
   * Send metrics to external service (placeholder)
   * @param {Array} metrics - Metrics to send
   */
  static sendMetricsToService(metrics) {
    // In a real implementation, this would send to services like:
    // - Google Analytics
    // - Mixpanel
    // - Custom analytics service

    console.log('Would send metrics to service:', metrics);
  }
}

// Create singleton instance
const monitoring = new MonitoringService();

// Track page load performance
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    monitoring.trackPerformance('pageLoad', loadTime);
  });

  // Track navigation performance
  window.addEventListener('beforeunload', () => {
    const metrics = monitoring.getAllMetrics();
    const errors = monitoring.getAllErrors();

    // Send data before page unload
    MonitoringService.sendMetricsToService(metrics);
    if (errors.length > 0) {
      MonitoringService.sendErrorToService(errors);
    }
  });
}

export default monitoring;

// Export individual functions for convenience
export const trackMetric = (name, value, tags) => monitoring.trackMetric(name, value, tags);
export const trackError = (error, context) => monitoring.trackError(error, context);
export const trackPerformance = (name, value) => monitoring.trackPerformance(name, value);
export const trackWebRTCStats = (peerConnection) => monitoring.trackWebRTCStats(peerConnection);
export const trackMessageLatency = (startTime, endTime) => monitoring.trackMessageLatency(startTime, endTime);
export const getPerformanceSummary = () => monitoring.getPerformanceSummary();
export const getAllMetrics = () => monitoring.getAllMetrics();
export const getAllErrors = () => monitoring.getAllErrors();
