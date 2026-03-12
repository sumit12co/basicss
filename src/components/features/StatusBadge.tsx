import React from 'react';
import Badge from '../common/Badge';
import type { WorkflowStatus, ItemCodeStatus, ERPStatus } from '../../types';

interface StatusBadgeProps {
  status: WorkflowStatus | ItemCodeStatus | ERPStatus;
}

const statusConfig: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange' | 'indigo' }> = {
  draft: { label: 'Draft', variant: 'gray' },
  submitted: { label: 'Submitted', variant: 'blue' },
  sales_head_review: { label: 'Sales Head Review', variant: 'yellow' },
  sbu_head_review: { label: 'SBU Head Review', variant: 'yellow' },
  president_review: { label: 'President Review', variant: 'orange' },
  finance_intervention: { label: 'Finance Intervention', variant: 'purple' },
  ceo_review: { label: 'CEO Review', variant: 'indigo' },
  approved: { label: 'Approved', variant: 'green' },
  rejected: { label: 'Rejected', variant: 'red' },
  revised: { label: 'Revision Requested', variant: 'orange' },
  submitted_to_finance: { label: 'Submitted to Finance', variant: 'blue' },
  finance_approved: { label: 'Finance Approved', variant: 'green' },
  sent_to_erp: { label: 'Sent to ERP', variant: 'purple' },
  pending: { label: 'Pending', variant: 'gray' },
  in_progress: { label: 'In Progress', variant: 'blue' },
  success: { label: 'Success', variant: 'green' },
  failed: { label: 'Failed', variant: 'red' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || { label: status, variant: 'gray' as const };
  return <Badge variant={config.variant} dot>{config.label}</Badge>;
};

export default StatusBadge;
