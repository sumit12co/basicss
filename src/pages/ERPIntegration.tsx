import React, { useState } from 'react';
import { RefreshCw, RotateCcw, Clock, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/features/StatusBadge';
import { MOCK_ERP_RECORDS } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';
import type { ERPRecord, ERPStatus } from '../types';
import { useToast } from '../components/common/Toast';

const ERPIntegration: React.FC = () => {
  const { showToast } = useToast();
  const [records, setRecords] = useState<ERPRecord[]>(MOCK_ERP_RECORDS);
  const [refreshing, setRefreshing] = useState(false);

  const counts: Record<ERPStatus, number> = {
    pending: records.filter(r => r.status === 'pending').length,
    in_progress: records.filter(r => r.status === 'in_progress').length,
    success: records.filter(r => r.status === 'success').length,
    failed: records.filter(r => r.status === 'failed').length,
  };

  const handleRetry = (id: string) => {
    setRecords(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'in_progress', errorMessage: undefined, retryCount: r.retryCount + 1 } : r
    ));
    showToast('Retrying ERP integration...', 'info');
    setTimeout(() => {
      setRecords(prev => prev.map(r =>
        r.id === id ? { ...r, status: 'success', lastUpdated: new Date().toLocaleString() } : r
      ));
      showToast('ERP sync successful!', 'success');
    }, 2000);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Status refreshed', 'success');
    }, 1500);
  };

  const statusCards = [
    { status: 'pending' as ERPStatus, label: 'Pending', icon: <Clock className="w-6 h-6 text-gray-500" />, bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' },
    { status: 'in_progress' as ERPStatus, label: 'In Progress', icon: <Loader className="w-6 h-6 text-blue-500 animate-spin" />, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    { status: 'success' as ERPStatus, label: 'Success', icon: <CheckCircle className="w-6 h-6 text-emerald-500" />, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    { status: 'failed' as ERPStatus, label: 'Failed', icon: <XCircle className="w-6 h-6 text-red-500" />, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ERP Integration Status</h1>
          <p className="text-sm text-gray-500 mt-1">LN System synchronization — March 2025</p>
        </div>
        <Button
          variant="outline"
          icon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
          onClick={handleRefresh}
          loading={refreshing}
        >
          Refresh
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map(s => (
          <div key={s.status} className={`rounded-xl border ${s.border} ${s.bg} p-5 flex items-center gap-4`}>
            {s.icon}
            <div>
              <p className={`text-2xl font-bold ${s.text}`}>{counts[s.status]}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Failed Records Alert */}
      {counts.failed > 0 && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">{counts.failed} record(s) failed to sync</p>
            <p className="text-sm text-red-600 mt-0.5">Click "Retry" on individual records or investigate the error messages below.</p>
          </div>
        </div>
      )}

      {/* Records Table */}
      <Card title="Integration Records">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Item Code', 'Product Name', 'Price', 'Status', 'Last Updated', 'Retries', 'Error', 'Action'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map(record => (
                <tr key={record.id} className={`hover:bg-gray-50 ${record.status === 'failed' ? 'bg-red-50/50' : ''}`}>
                  <td className="px-4 py-3 text-sm font-mono text-gray-700">{record.itemCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{record.productName}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(record.price)}</td>
                  <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{record.lastUpdated}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${record.retryCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                      {record.retryCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-red-600 max-w-xs">
                    {record.errorMessage ? (
                      <div className="flex items-start gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{record.errorMessage}</span>
                      </div>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {record.status === 'failed' && (
                      <Button
                        variant="warning"
                        size="sm"
                        icon={<RotateCcw className="w-3 h-3" />}
                        onClick={() => handleRetry(record.id)}
                      >
                        Retry
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Integration History Log */}
      <Card title="Integration History">
        <div className="divide-y divide-gray-100">
          {[
            { time: '2025-03-10 15:16', msg: 'Sync failed for CUB-305-1P — ERP connection timeout', type: 'error' },
            { time: '2025-03-10 15:01', msg: 'Sync started for HVP-202-A, HVP-202-B — In progress', type: 'info' },
            { time: '2025-03-10 14:32', msg: '2 records synced successfully: IPA-001-S, IPA-001-M', type: 'success' },
            { time: '2025-03-10 14:30', msg: 'ERP integration batch started — 10 records queued', type: 'info' },
            { time: '2025-03-10 13:45', msg: 'PCC-601-ST synced successfully', type: 'success' },
          ].map((log, i) => (
            <div key={i} className="flex items-start gap-3 px-6 py-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                log.type === 'error' ? 'bg-red-500' : log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
              }`} />
              <p className="text-sm text-gray-700 flex-1">{log.msg}</p>
              <span className="text-xs text-gray-400 flex-shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ERPIntegration;
