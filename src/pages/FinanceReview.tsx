import React, { useState } from 'react';
import { CheckCircle, XCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/features/StatusBadge';
import { MOCK_FINANCE_REVIEW } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';
import type { FinanceReviewItem } from '../types';
import { useToast } from '../components/common/Toast';
import Modal from '../components/common/Modal';

const FinanceReview: React.FC = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<FinanceReviewItem[]>(MOCK_FINANCE_REVIEW);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [rejectComment, setRejectComment] = useState('');

  const approveItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'approved' } : item));
    showToast('Item approved', 'success');
  };

  const openRejectModal = (id: string) => {
    setRejectModal({ open: true, id });
    setRejectComment('');
  };

  const confirmReject = () => {
    if (!rejectComment.trim()) {
      showToast('Comment is mandatory for rejection', 'error');
      return;
    }
    setItems(prev => prev.map(item =>
      item.id === rejectModal.id ? { ...item, status: 'rejected', financeComment: rejectComment } : item
    ));
    setRejectModal({ open: false, id: null });
    setRejectComment('');
    showToast('Item rejected', 'warning');
  };

  const approveAll = () => {
    setItems(prev => prev.map(item => item.status === 'pending' ? { ...item, status: 'approved' } : item));
    showToast('All pending items approved', 'success');
  };

  const updateComment = (id: string, comment: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, financeComment: comment } : item));
  };

  const varIcon = (submitted: number, last: number) => {
    if (submitted > last * 1.02) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (submitted < last * 0.98) return <TrendingDown className="w-4 h-4 text-emerald-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const metrics = [
    { label: 'Total Items', value: items.length, color: 'text-gray-900' },
    { label: 'Pending', value: items.filter(i => i.status === 'pending').length, color: 'text-amber-600' },
    { label: 'Approved', value: items.filter(i => i.status === 'approved').length, color: 'text-emerald-600' },
    { label: 'Rejected', value: items.filter(i => i.status === 'rejected').length, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Review</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve item code prices</p>
        </div>
        <Button variant="success" icon={<CheckCircle className="w-4 h-4" />} onClick={approveAll}>
          Approve All Pending
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <Card key={m.label} className="p-5 text-center">
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{m.label}</p>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card title="Item Code Review">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Product', 'Item Code', 'Submitted Price', 'Last Price', 'Δ', 'Budget Price', 'Var. Cost', 'Bus. Contribution', 'Finance Comment', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className={`hover:bg-gray-50 ${item.status === 'rejected' ? 'bg-red-50' : item.status === 'approved' ? 'bg-emerald-50/30' : ''}`}>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">{item.productName}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 font-mono">{item.itemCode}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-gray-900">{formatCurrency(item.submittedPrice)}</td>
                  <td className="px-3 py-3 text-sm text-gray-600">{formatCurrency(item.lastPrice)}</td>
                  <td className="px-3 py-3">{varIcon(item.submittedPrice, item.lastPrice)}</td>
                  <td className="px-3 py-3 text-sm text-gray-600">{formatCurrency(item.budgetPrice)}</td>
                  <td className="px-3 py-3 text-sm text-gray-600">{formatCurrency(item.variableCost)}</td>
                  <td className="px-3 py-3 text-sm text-gray-600">{formatCurrency(item.businessContribution)}</td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={item.financeComment}
                      onChange={e => updateComment(item.id, e.target.value)}
                      placeholder="Add comment..."
                      className="w-32 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={item.status !== 'pending'}
                    />
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={item.status as 'pending' | 'approved' | 'rejected'} /></td>
                  <td className="px-3 py-3">
                    {item.status === 'pending' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => approveItem(item.id)}
                          className="p-1.5 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openRejectModal(item.id)}
                          className="p-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModal.open}
        onClose={() => setRejectModal({ open: false, id: null })}
        title="Reject Item Code Price"
        footer={
          <>
            <Button variant="outline" onClick={() => setRejectModal({ open: false, id: null })}>Cancel</Button>
            <Button variant="danger" icon={<XCircle className="w-4 h-4" />} onClick={confirmReject}>Confirm Reject</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600 mb-4">
          Please provide a mandatory comment explaining the reason for rejection.
        </p>
        <textarea
          value={rejectComment}
          onChange={e => setRejectComment(e.target.value)}
          rows={4}
          placeholder="Reason for rejection (required)..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
        />
      </Modal>
    </div>
  );
};

export default FinanceReview;
