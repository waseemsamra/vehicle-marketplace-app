// Error tracking and monitoring service
class MonitoringService {
  constructor() {
    this.errors = [];
    this.apiCalls = [];
  }

  logError(error, context = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.errors.push(errorLog);
    console.error('[Monitoring]', errorLog);
    
    // Send to backend if needed
    if (process.env.REACT_APP_MONITORING_ENDPOINT) {
      this.sendToBackend('error', errorLog);
    }
  }

  logApiCall(method, url, status, duration) {
    const apiLog = {
      timestamp: new Date().toISOString(),
      method,
      url,
      status,
      duration
    };
    
    this.apiCalls.push(apiLog);
    
    if (status >= 400) {
      console.warn('[API Error]', apiLog);
    }
  }

  async sendToBackend(type, data) {
    try {
      await fetch(process.env.REACT_APP_MONITORING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      });
    } catch (err) {
      console.error('Failed to send monitoring data:', err);
    }
  }

  getMetrics() {
    return {
      totalErrors: this.errors.length,
      totalApiCalls: this.apiCalls.length,
      errorRate: this.errors.length / this.apiCalls.length || 0,
      recentErrors: this.errors.slice(-10)
    };
  }
}

export const monitoring = new MonitoringService();
