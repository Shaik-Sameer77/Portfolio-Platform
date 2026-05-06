import React, { useEffect, useState } from 'react';
import ApiLogService, { type ApiLog } from '../services/api-log-service';
import { 
  Terminal as TerminalIcon, 
  Delete as TrashIcon, 
  Refresh as RefreshIcon, 
  KeyboardArrowDown as ChevronDownIcon, 
  KeyboardArrowUp as ChevronUpIcon, 
  AccessTime as ClockIcon, 
  Assessment as ActivityIcon,
  Public as GlobeIcon,
  Monitor as MonitorIcon
} from '@mui/icons-material';

const ApiLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await ApiLogService.getLogs();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = async () => {
    if (window.confirm('Are you sure you want to clear all logs?')) {
      try {
        await ApiLogService.clearLogs();
        setLogs([]);
      } catch (error) {
        console.error('Failed to clear logs:', error);
      }
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDate = (dateString: string, includeDate = false) => {
    const date = new Date(dateString);
    if (includeDate) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        hour12: false
      }).format(date);
    }
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  const getStatusColor = (status: number | null) => {
    if (!status) return 'text-gray-400';
    if (status >= 200 && status < 300) return 'text-emerald-400';
    if (status >= 400 && status < 500) return 'text-amber-400';
    if (status >= 500) return 'text-rose-400';
    return 'text-sky-400';
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'POST': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'PUT': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'PATCH': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'DELETE': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TerminalIcon className="w-6 h-6 text-indigo-400" />
            API Request Logs
          </h1>
          <p className="text-gray-400 mt-1">Monitor real-time API traffic and response performance.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchLogs}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all"
          >
            <RefreshIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={clearLogs}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-rose-400 transition-all"
          >
            <TrashIcon className="w-4 h-4" />
            Clear Logs
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Endpoint</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No API logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr 
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${expandedLog === log.id ? 'bg-white/5' : ''}`}
                      onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                    >
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getMethodColor(log.method)}`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-200 font-mono truncate max-w-md">
                          {log.url}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 font-mono font-bold ${getStatusColor(log.statusCode)}`}>
                          {log.statusCode || '---'}
                          <div className={`w-2 h-2 rounded-full ${log.statusCode && log.statusCode < 400 ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                        {log.duration}ms
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {expandedLog === log.id ? <ChevronUpIcon className="w-4 h-4 ml-auto text-gray-500" /> : <ChevronDownIcon className="w-4 h-4 ml-auto text-gray-500" />}
                      </td>
                    </tr>
                    {expandedLog === log.id && (
                      <tr className="bg-black/20 border-l-2 border-indigo-500/50">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-4">
                              <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-widest font-bold">
                                <ActivityIcon className="w-3 h-3" /> Request Context
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <ClockIcon className="w-3 h-3 text-gray-500" />
                                  <span className="text-gray-400">Timestamp:</span>
                                  <span className="text-white">{formatDate(log.createdAt, true)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <GlobeIcon className="w-3 h-3 text-gray-500" />
                                  <span className="text-gray-400">IP Address:</span>
                                  <span className="text-white">{log.ip || 'Unknown'}</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm">
                                  <MonitorIcon className="w-3 h-3 text-gray-500 mt-1" />
                                  <span className="text-gray-400">User Agent:</span>
                                  <span className="text-white text-xs break-all">{log.userAgent}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Request Body</div>
                                <pre className="p-3 bg-black/40 rounded-lg text-xs text-indigo-300 overflow-x-auto font-mono max-h-40 border border-white/5">
                                  {log.requestBody ? (
                                    (() => {
                                      try {
                                        return JSON.stringify(JSON.parse(log.requestBody), null, 2);
                                      } catch {
                                        return log.requestBody;
                                      }
                                    })()
                                  ) : 'No payload'}
                                </pre>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Response Body</div>
                              <pre className="p-3 bg-black/40 rounded-lg text-xs text-emerald-300 overflow-x-auto font-mono max-h-64 border border-white/5">
                                {log.responseBody ? (
                                  (() => {
                                    try {
                                      return JSON.stringify(JSON.parse(log.responseBody), null, 2);
                                    } catch {
                                      return log.responseBody;
                                    }
                                  })()
                                ) : 'No response content'}
                              </pre>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApiLogsPage;
