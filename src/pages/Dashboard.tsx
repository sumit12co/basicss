import React, { useState } from 'react';
import {
  Package, BarChart3, Calendar, Activity, Search, Download,
  Send, Edit3, Save, X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/features/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { MOCK_PRICE_LIST } from '../data/mockData';
import { formatCurrency, formatPercent, formatNumber, getVarianceClass } from '../utils/helpers';
import type { PriceListItem, WorkflowStatus } from '../types';
import { useToast } from '../components/common/Toast';

const ITEMS_PER_PAGE = 10;

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState<PriceListItem[]>(MOCK_PRICE_LIST);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editRemark, setEditRemark] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>('draft');

  const isBusinessUser = currentUser?.role === 'business';
  const canSubmit = isBusinessUser && workflowStatus === 'draft';

  const filtered = items.filter(item =>
    item.productName.toLowerCase().includes(search.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const startEdit = (item: PriceListItem) => {
    setEditingId(item.id);
    setEditValue(String(item.floorPrice));
    setEditRemark(item.remarks);
  };

  const saveEdit = (id: string) => {
    const newPrice = parseFloat(editValue);
    if (isNaN(newPrice) || newPrice <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }
    const item = items.find(i => i.id === id);
    if (item && newPrice !== item.calculatedFloorPrice && !editRemark.trim()) {
      showToast('Remarks are mandatory when floor price is edited', 'error');
      return;
    }
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, floorPrice: newPrice, remarks: editRemark, isEdited: newPrice !== i.calculatedFloorPrice } : i
    ));
    setEditingId(null);
    showToast('Floor price updated successfully', 'success');
  };

  const handleSubmit = () => {
    const missing = items.filter(i => i.isEdited && !i.remarks.trim());
    if (missing.length > 0) {
      showToast(`Remarks required for ${missing.length} edited item(s)`, 'error');
      return;
    }
    setWorkflowStatus('submitted');
    showToast('Price list submitted for approval successfully!', 'success');
  };

  const handleExport = () => {
    showToast('Exporting to Excel... (simulated)', 'info');
  };

  const metrics = [
    { label: 'Total Products', value: items.length, icon: <Package className="w-6 h-6 text-blue-500" />, bg: 'bg-blue-50' },
    // Total SKUs: sum of item codes across all products (mock: products + additional item codes)
    { label: 'Total SKUs', value: items.length + 12, icon: <BarChart3 className="w-6 h-6 text-emerald-500" />, bg: 'bg-emerald-50' },
    { label: 'Current Month', value: 'Mar 2025', icon: <Calendar className="w-6 h-6 text-purple-500" />, bg: 'bg-purple-50' },
    { label: 'Workflow Status', value: workflowStatus.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), icon: <Activity className="w-6 h-6 text-amber-500" />, bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Price List Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">March 2025 Floor Price List</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={workflowStatus} />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <Card key={m.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{m.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${m.bg} flex items-center justify-center`}>
                {m.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Table Card */}
      <Card
        title="Floor Price List"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
              Export
            </Button>
            {canSubmit && (
              <Button variant="primary" size="sm" icon={<Send className="w-4 h-4" />} onClick={handleSubmit}>
                Submit for Approval
              </Button>
            )}
          </div>
        }
      >
        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Product Name', 'Item Code', 'Sales Vol.', 'GIT', 'Freight', 'Calc. Floor Price', 'Budget Price', 'Variance', 'Floor Price', 'Remarks'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
                {isBusinessUser && workflowStatus === 'draft' && (
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map(item => (
                <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${item.isEdited ? 'bg-amber-50' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.productName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{item.itemCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatNumber(item.salesVolume)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(item.git)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(item.freight)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(item.calculatedFloorPrice)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(item.budgetPrice)}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${getVarianceClass(item.variance)}`}>
                    {formatPercent(item.variance)}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="w-24 border border-blue-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <span className={`text-sm font-semibold ${item.isEdited ? 'text-amber-600' : 'text-gray-900'}`}>
                        {formatCurrency(item.floorPrice)}
                        {item.isEdited && <span className="text-xs text-amber-500 ml-1">(edited)</span>}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editRemark}
                        onChange={e => setEditRemark(e.target.value)}
                        placeholder="Remarks (required if edited)"
                        className="w-40 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">{item.remarks || '—'}</span>
                    )}
                  </td>
                  {isBusinessUser && workflowStatus === 'draft' && (
                    <td className="px-4 py-3">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => saveEdit(item.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer" title="Save">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer" title="Cancel">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(item)} className="p-1 text-blue-500 hover:bg-blue-50 rounded cursor-pointer" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} items
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
