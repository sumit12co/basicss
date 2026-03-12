import React, { useState } from 'react';
import { UserPlus, Search, Edit3, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { MOCK_USERS } from '../../data/mockData';
import type { User, UserRole } from '../../types';
import { useToast } from '../../components/common/Toast';

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'business', label: 'Business User' },
  { value: 'approver', label: 'Approver' },
  { value: 'finance', label: 'Finance' },
  { value: 'admin', label: 'Admin' },
];

const roleBadge = (role: UserRole) => {
  const map = { business: 'blue', approver: 'green', finance: 'purple', admin: 'orange' } as const;
  return <Badge variant={map[role]}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>;
};

const UserManagement: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'business' as UserRole, department: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    const user = users.find(u => u.id === id);
    showToast(`${user?.name} ${user?.isActive ? 'deactivated' : 'activated'}`, user?.isActive ? 'warning' : 'success');
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) errors.email = 'Invalid email';
    if (!form.department.trim()) errors.department = 'Department is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    const newUser: User = {
      id: `u${Date.now()}`,
      ...form,
      isActive: true,
    };
    setUsers(prev => [...prev, newUser]);
    setAddModal(false);
    setForm({ name: '', email: '', role: 'business', department: '' });
    showToast('User added successfully', 'success');
  };

  const handleEdit = () => {
    if (!editUser || !validate()) return;
    setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...form } : u));
    setEditUser(null);
    showToast('User updated', 'success');
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, role: u.role, department: u.department });
    setFormErrors({});
  };

  const FormContent = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
        <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. John Doe" />
        {formErrors.name && <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@company.com" />
        {formErrors.email && <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
        <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {roleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
        <input type="text" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Sales" />
        {formErrors.department && <p className="text-xs text-red-600 mt-1">{formErrors.department}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500">{users.filter(u => u.isActive).length} active users</p>
        </div>
        <Button variant="primary" icon={<UserPlus className="w-4 h-4" />} onClick={() => { setAddModal(true); setForm({ name: '', email: '', role: 'business', department: '' }); setFormErrors({}); }}>
          Add User
        </Button>
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['User', 'Email', 'Department', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(u => (
                <tr key={u.id} className={`hover:bg-gray-50 ${!u.isActive ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.department}</td>
                  <td className="px-4 py-3">{roleBadge(u.role)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.isActive ? 'green' : 'gray'} dot>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600 cursor-pointer" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => toggleActive(u.id)} className={`p-1.5 rounded cursor-pointer ${u.isActive ? 'hover:bg-red-50 text-red-500' : 'hover:bg-emerald-50 text-emerald-500'}`} title={u.isActive ? 'Deactivate' : 'Activate'}>
                        {u.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New User"
        footer={<><Button variant="outline" onClick={() => setAddModal(false)}>Cancel</Button><Button variant="primary" icon={<UserPlus className="w-4 h-4" />} onClick={handleAdd}>Add User</Button></>}>
        <FormContent />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User"
        footer={<><Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button><Button variant="primary" icon={<Save className="w-4 h-4" />} onClick={handleEdit}>Save Changes</Button></>}>
        <FormContent />
      </Modal>
    </div>
  );
};

export default UserManagement;
