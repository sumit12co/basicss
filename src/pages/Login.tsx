import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, LogIn, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import type { UserRole } from '../types';

interface RoleOption {
  value: string;
  label: string;
  role: UserRole;
  approverLevel?: string;
  description: string;
}

const roleOptions: RoleOption[] = [
  { value: 'business', label: 'Business User', role: 'business', description: 'Validate and submit floor prices' },
  { value: 'sales_head', label: 'Sales Head (Level 1 Approver)', role: 'approver', approverLevel: 'sales_head', description: 'Level 1 approval authority' },
  { value: 'sbu_head', label: 'SBU Head (Level 2 Approver)', role: 'approver', approverLevel: 'sbu_head', description: 'Level 2 approval authority' },
  { value: 'president', label: 'President (Level 3 Approver)', role: 'approver', approverLevel: 'president', description: 'Level 3 approval authority' },
  { value: 'ceo', label: 'CEO (Level 4 Approver)', role: 'approver', approverLevel: 'ceo', description: 'Final approval authority' },
  { value: 'finance', label: 'Finance Team', role: 'finance', description: 'Add VC, review item codes, send to ERP' },
  { value: 'admin', label: 'Admin', role: 'admin', description: 'Manage users and system settings' },
];

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('business');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true);
    const option = roleOptions.find(r => r.value === selectedRole);
    if (option) {
      login(option.role, option.approverLevel);
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 800);
    }
  };

  const selectedOption = roleOptions.find(r => r.value === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4 shadow-lg">
            <Zap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Price List Portal</h1>
          <p className="text-gray-400 mt-1">Automation & Approval System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to access your dashboard</p>

          {/* SSO Button */}
          <button className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-lg py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors mb-6 cursor-pointer">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with SSO (Simulated)
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-3">
              OR SELECT ROLE FOR DEMO
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Demo Role</label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full appearance-none border border-gray-300 rounded-lg py-3 px-4 pr-10 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {roleOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {selectedOption && (
              <p className="mt-2 text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <span className="font-medium text-blue-700">Role Access: </span>
                {selectedOption.description}
              </p>
            )}
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full justify-center"
            icon={<LogIn className="w-5 h-5" />}
            loading={loading}
            onClick={handleLogin}
          >
            Sign In
          </Button>

          <p className="text-center text-xs text-gray-400 mt-4">
            This is a prototype demonstration. All data is simulated.
          </p>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          © 2025 Price List Automation Portal • v1.0 Prototype
        </p>
      </div>
    </div>
  );
};

export default Login;
