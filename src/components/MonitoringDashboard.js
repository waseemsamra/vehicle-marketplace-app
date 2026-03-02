import React, { useState, useEffect } from 'react';
import { monitoring } from '../services/monitoring';

const MonitoringDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setMetrics(monitoring.getMetrics());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg shadow-lg z-50"
      >
        📊 Metrics
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl z-50 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold">Monitoring</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
      </div>
      
      {metrics && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">API Calls:</span>
            <span className="text-white font-mono">{metrics.totalApiCalls}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Errors:</span>
            <span className="text-red-400 font-mono">{metrics.totalErrors}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Error Rate:</span>
            <span className="text-yellow-400 font-mono">
              {(metrics.errorRate * 100).toFixed(1)}%
            </span>
          </div>
          
          {metrics.recentErrors.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="text-slate-400 mb-2">Recent Errors:</div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {metrics.recentErrors.map((err, i) => (
                  <div key={i} className="text-xs text-red-400 truncate">
                    {err.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonitoringDashboard;
