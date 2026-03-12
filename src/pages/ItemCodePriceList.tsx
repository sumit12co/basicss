import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Save, Send, AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/features/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { MOCK_PRODUCTS_WITH_ITEM_CODES } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';
import type { ProductWithItemCodes, ItemCode, ItemCodeStatus } from '../types';
import { useToast } from '../components/common/Toast';

const ItemCodePriceList: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductWithItemCodes[]>(MOCK_PRODUCTS_WITH_ITEM_CODES);
  const [editingCell, setEditingCell] = useState<{ productId: string; itemId: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const isBusinessUser = currentUser?.role === 'business';

  const toggleProduct = (productId: string) => {
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, isExpanded: !p.isExpanded } : p
    ));
  };

  const startEdit = (productId: string, item: ItemCode) => {
    setEditingCell({ productId, itemId: item.id });
    setEditValue(String(item.submittedPrice));
  };

  const saveEdit = (productId: string, itemId: string) => {
    const newPrice = parseFloat(editValue);
    if (isNaN(newPrice) || newPrice <= 0) {
      showToast('Invalid price', 'error');
      return;
    }
    const product = products.find(p => p.id === productId);
    const error = newPrice < (product?.approvedFloorPrice || 0)
      ? `Price cannot be below approved floor price (${formatCurrency(product?.approvedFloorPrice || 0)})`
      : undefined;

    setProducts(prev => prev.map(p =>
      p.id === productId
        ? {
            ...p,
            itemCodes: p.itemCodes.map(ic =>
              ic.id === itemId ? { ...ic, submittedPrice: newPrice, error } : ic
            ),
          }
        : p
    ));
    setEditingCell(null);
    if (error) {
      showToast(error, 'error');
    } else {
      showToast('Price updated', 'success');
    }
  };

  const submitToFinance = (productId: string) => {
    const product = products.find(p => p.id === productId);
    const hasErrors = product?.itemCodes.some(ic => ic.error);
    if (hasErrors) {
      showToast('Please fix price validation errors before submitting', 'error');
      return;
    }
    setProducts(prev => prev.map(p =>
      p.id === productId
        ? { ...p, itemCodes: p.itemCodes.map(ic => ({ ...ic, status: 'submitted_to_finance' as ItemCodeStatus })) }
        : p
    ));
    showToast('Submitted to Finance for review', 'success');
  };

  const getStatusCounts = (product: ProductWithItemCodes) => {
    const statuses = product.itemCodes.reduce((acc, ic) => {
      acc[ic.status] = (acc[ic.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return statuses;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Item Code Price List</h1>
        <p className="text-sm text-gray-500 mt-1">Convert approved floor prices to item code level prices</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {(['draft', 'submitted_to_finance', 'finance_approved', 'sent_to_erp'] as ItemCodeStatus[]).map(s => (
          <StatusBadge key={s} status={s} />
        ))}
      </div>

      {/* Products */}
      <div className="space-y-4">
        {products.map(product => {
          const statusCounts = getStatusCounts(product);
          const canSubmit = isBusinessUser && product.itemCodes.some(ic => ic.status === 'draft');

          return (
            <Card key={product.id}>
              {/* Product Header */}
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleProduct(product.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`transition-transform ${product.isExpanded ? 'rotate-0' : '-rotate-90'}`}>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{product.productName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Approved Floor Price: <span className="font-semibold text-blue-600">{formatCurrency(product.approvedFloorPrice)}</span>
                      <span className="mx-2">•</span>
                      {product.itemCodes.length} item codes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {Object.entries(statusCounts).map(([status, count]) => (
                      <span key={status} className="text-xs text-gray-500">
                        <StatusBadge status={status as ItemCodeStatus} />
                        <span className="ml-1">×{count}</span>
                      </span>
                    ))}
                  </div>
                  {canSubmit && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Send className="w-3 h-3" />}
                      onClick={e => { e.stopPropagation(); submitToFinance(product.id); }}
                    >
                      Submit to Finance
                    </Button>
                  )}
                </div>
              </div>

              {/* Item Codes Table */}
              {product.isExpanded && (
                <div className="border-t border-gray-100 overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        {['Item Code', 'Description', 'UOM', 'Last Price', 'Price', 'VC', 'BC', 'Status', ...(isBusinessUser ? ['Action'] : [])].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-2.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {product.itemCodes.map(ic => {
                        const isEditing = editingCell?.productId === product.id && editingCell?.itemId === ic.id;
                        const hasError = !!ic.error;

                        return (
                          <tr key={ic.id} className={`hover:bg-gray-50 ${hasError ? 'bg-red-50' : ''}`}>
                            <td className="px-4 py-3 text-sm font-mono text-gray-700">{ic.code}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{ic.description}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{ic.uom}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(ic.lastPrice)}</td>
                            <td className="px-4 py-3">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') saveEdit(product.id, ic.id);
                                    if (e.key === 'Escape') setEditingCell(null);
                                  }}
                                  className="w-24 border border-blue-400 rounded px-2 py-1 text-sm focus:outline-none"
                                  autoFocus
                                />
                              ) : (
                                <div>
                                  <span className={`text-sm font-semibold ${hasError ? 'text-red-600' : 'text-gray-900'}`}>
                                    {formatCurrency(ic.submittedPrice)}
                                  </span>
                                  {hasError && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <AlertTriangle className="w-3 h-3 text-red-500" />
                                      <span className="text-xs text-red-600">{ic.error}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{ic.variableCost ? formatCurrency(ic.variableCost) : '—'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{ic.businessContribution ? formatCurrency(ic.businessContribution) : '—'}</td>
                            <td className="px-4 py-3"><StatusBadge status={ic.status} /></td>
                            {isBusinessUser && (
                              <td className="px-4 py-3">
                                {isEditing ? (
                                  <div className="flex gap-1">
                                    <button onClick={() => saveEdit(product.id, ic.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer">
                                      <Save className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => setEditingCell(null)} className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer">
                                      <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                                    </button>
                                  </div>
                                ) : ic.status === 'draft' ? (
                                  <button onClick={() => startEdit(product.id, ic)} className="text-xs text-blue-600 hover:underline cursor-pointer">Edit</button>
                                ) : null}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ItemCodePriceList;
