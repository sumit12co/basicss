import React, { useState } from 'react';
import { Save, GitBranch, User } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { MOCK_USERS, MOCK_APPROVAL_MATRIX } from '../../data/mockData';
import type { ApprovalMatrix } from '../../types';
import { useToast } from '../../components/common/Toast';

const levels = [
  { key: 'sales_head' as keyof ApprovalMatrix, label: 'Level 1 — Sales Head', description: 'First approval in the chain' },
  { key: 'sbu_head' as keyof ApprovalMatrix, label: 'Level 2 — SBU Head', description: 'Strategic Business Unit Head' },
  { key: 'president' as keyof ApprovalMatrix, label: 'Level 3 — President', description: 'Company President' },
  { key: 'ceo' as keyof ApprovalMatrix, label: 'Level 4 — CEO', description: 'Final approval authority' },
];

const ApprovalMatrixConfig: React.FC = () => {
  const { showToast } = useToast();
  const [matrix, setMatrix] = useState<ApprovalMatrix>(MOCK_APPROVAL_MATRIX);
  const [saved, setSaved] = useState(false);

  const approverUsers = MOCK_USERS.filter(u => u.role === 'approver' && u.isActive);

  const handleSave = () => {
    setSaved(true);
    showToast('Approval matrix saved successfully!', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  const getUserById = (id: string) => MOCK_USERS.find(u => u.id === id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Approval Matrix Configuration</h2>
          <p className="text-sm text-gray-500">Configure approvers for each approval level</p>
        </div>
        <Button variant="primary" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
          Save Configuration
        </Button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 text-sm text-emerald-700 font-medium">
          ✓ Approval matrix configuration saved successfully
        </div>
      )}

      {/* Current Matrix Visual */}
      <Card title="Current Approval Chain" className="p-6">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {levels.map((level, idx) => {
            const user = getUserById(matrix[level.key]);
            return (
              <React.Fragment key={level.key}>
                <div className="flex flex-col items-center min-w-[130px]">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900 text-center">{user?.name || 'Not set'}</p>
                  <p className="text-xs text-blue-600 font-medium text-center">{level.label.split(' — ')[1]}</p>
                  <p className="text-xs text-gray-400 text-center">Level {idx + 1}</p>
                </div>
                {idx < levels.length - 1 && (
                  <div className="flex-1 border-t-2 border-dashed border-gray-200 min-w-[20px]" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Card>

      {/* Configuration Form */}
      <Card title="Configure Approvers">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {levels.map(level => {
            const currentUser = getUserById(matrix[level.key]);
            return (
              <div key={level.key} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <GitBranch className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{level.label}</p>
                    <p className="text-xs text-gray-500">{level.description}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Approver</label>
                  <select
                    value={matrix[level.key]}
                    onChange={e => setMatrix(prev => ({ ...prev, [level.key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">— Select User —</option>
                    {approverUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
                    ))}
                  </select>
                </div>

                {currentUser && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span>{currentUser.name} • {currentUser.email}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ApprovalMatrixConfig;
