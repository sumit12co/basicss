import React, { useState } from 'react';
import { CheckCircle, RotateCcw, MessageSquare, User, Clock, AlertCircle, PlusCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ApprovalTimeline from '../components/features/ApprovalTimeline';
import StatusBadge from '../components/features/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { MOCK_PRICE_LIST, MOCK_AUDIT_TRAIL } from '../data/mockData';
import { formatCurrency, formatPercent, getVarianceClass } from '../utils/helpers';
import type { WorkflowStatus, AuditEntry } from '../types';
import { useToast } from '../components/common/Toast';

const Approvals: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>('sales_head_review');
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(MOCK_AUDIT_TRAIL);
  const [financeData, setFinanceData] = useState({ vc: '', lastPrice: '', businessContribution: '' });
  const [showReviseForm, setShowReviseForm] = useState(false);

  const role = currentUser?.role;
  const approverLevel = currentUser?.approverLevel;

  const canApprove = role === 'approver';
  const isFinance = role === 'finance';
  const isFinanceStep = workflowStatus === 'finance_intervention';

  const handleApprove = () => {
    if (!comment.trim()) {
      setCommentError('Comment is recommended for approval');
    }
    const nextStatus: Record<WorkflowStatus, WorkflowStatus> = {
      sales_head_review: 'sbu_head_review',
      sbu_head_review: 'president_review',
      president_review: 'finance_intervention',
      finance_intervention: 'ceo_review',
      ceo_review: 'approved',
      draft: 'submitted',
      submitted: 'sales_head_review',
      approved: 'approved',
      rejected: 'rejected',
      revised: 'submitted',
    };
    const next = nextStatus[workflowStatus] || workflowStatus;
    setWorkflowStatus(next);
    const newEntry: AuditEntry = {
      id: `a${Date.now()}`,
      action: 'Approved',
      user: currentUser?.name || 'Unknown',
      role: approverLevel?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || role || '',
      timestamp: new Date().toLocaleString(),
      comment: comment || 'Approved',
    };
    setAuditTrail(prev => [...prev, newEntry]);
    setComment('');
    setCommentError('');
    showToast('Price list approved successfully!', 'success');
  };

  const handleRevise = () => {
    if (!comment.trim()) {
      setCommentError('Comment is mandatory when requesting revision');
      return;
    }
    setWorkflowStatus('submitted');
    const newEntry: AuditEntry = {
      id: `a${Date.now()}`,
      action: 'Revision Requested',
      user: currentUser?.name || 'Unknown',
      role: approverLevel?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || role || '',
      timestamp: new Date().toLocaleString(),
      comment,
    };
    setAuditTrail(prev => [...prev, newEntry]);
    setComment('');
    setCommentError('');
    setShowReviseForm(false);
    showToast('Revision requested. Business user has been notified.', 'warning');
  };

  const handleFinanceSubmit = () => {
    if (!financeData.vc || !financeData.lastPrice || !financeData.businessContribution) {
      showToast('Please fill all finance fields', 'error');
      return;
    }
    const newEntry: AuditEntry = {
      id: `a${Date.now()}`,
      action: 'Finance Intervention Added',
      user: currentUser?.name || 'Unknown',
      role: 'Finance',
      timestamp: new Date().toLocaleString(),
      comment: `VC: ₹${financeData.vc}, Last Price: ₹${financeData.lastPrice}, Business Contribution: ${financeData.businessContribution}%`,
    };
    setAuditTrail(prev => [...prev, newEntry]);
    setWorkflowStatus('ceo_review');
    showToast('Finance data submitted. Moving to CEO review.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approval Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">March 2025 Price List Approval Workflow</p>
        </div>
        <StatusBadge status={workflowStatus} />
      </div>

      {/* Approval Timeline */}
      <Card title="Approval Progress" className="p-6">
        <div className="px-6 pt-2 pb-6">
          <ApprovalTimeline currentStatus={workflowStatus} />
        </div>
      </Card>

      {/* Action Panel */}
      {(canApprove || isFinance) && (
        <Card title="Actions">
          <div className="p-6 space-y-4">
            {/* Finance Intervention */}
            {isFinance && isFinanceStep && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Finance intervention required. Please add financial data below.</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variable Cost (VC) ₹</label>
                    <input
                      type="number"
                      value={financeData.vc}
                      onChange={e => setFinanceData(d => ({ ...d, vc: e.target.value }))}
                      placeholder="e.g. 850"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Price ₹</label>
                    <input
                      type="number"
                      value={financeData.lastPrice}
                      onChange={e => setFinanceData(d => ({ ...d, lastPrice: e.target.value }))}
                      placeholder="e.g. 1020"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Contribution %</label>
                    <input
                      type="number"
                      value={financeData.businessContribution}
                      onChange={e => setFinanceData(d => ({ ...d, businessContribution: e.target.value }))}
                      placeholder="e.g. 18"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <Button variant="primary" icon={<PlusCircle className="w-4 h-4" />} onClick={handleFinanceSubmit}>
                  Submit Finance Data & Forward to CEO
                </Button>
              </div>
            )}

            {/* Approver Actions */}
            {canApprove && !isFinanceStep && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MessageSquare className="inline w-4 h-4 mr-1" />
                    Comment {showReviseForm && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    value={comment}
                    onChange={e => { setComment(e.target.value); setCommentError(''); }}
                    rows={3}
                    placeholder="Add your comments here..."
                    className={`w-full border ${commentError ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  />
                  {commentError && <p className="text-xs text-red-600 mt-1">{commentError}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="success" icon={<CheckCircle className="w-4 h-4" />} onClick={handleApprove}>
                    Approve
                  </Button>
                  <Button
                    variant="warning"
                    icon={<RotateCcw className="w-4 h-4" />}
                    onClick={() => { setShowReviseForm(true); handleRevise(); }}
                  >
                    Request Revision
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Price List Table (Read-only) */}
      <Card title="Price List (Read Only)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Product Name', 'Item Code', 'Sales Vol.', 'Calc. Floor Price', 'Budget Price', 'Variance', 'Floor Price', 'Remarks'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PRICE_LIST.slice(0, 8).map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.productName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{item.itemCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.salesVolume.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.calculatedFloorPrice)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(item.budgetPrice)}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${getVarianceClass(item.variance)}`}>{formatPercent(item.variance)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(item.floorPrice)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{item.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Audit Trail */}
      <Card title="Audit Trail">
        <div className="divide-y divide-gray-100">
          {[...auditTrail].reverse().map(entry => (
            <div key={entry.id} className="px-6 py-4 flex items-start gap-4">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm font-semibold text-gray-900">{entry.user} <span className="text-gray-500 font-normal">({entry.role})</span></p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {entry.timestamp}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-0.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2 ${
                    entry.action.includes('Approved') ? 'bg-emerald-100 text-emerald-700' :
                    entry.action.includes('Revised') || entry.action.includes('Revision') ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {entry.action}
                  </span>
                  {entry.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Approvals;
