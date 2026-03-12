import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import type { WorkflowStatus } from '../../types';

interface Step {
  key: WorkflowStatus;
  label: string;
}

const steps: Step[] = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'sales_head_review', label: 'Sales Head' },
  { key: 'sbu_head_review', label: 'SBU Head' },
  { key: 'president_review', label: 'President' },
  { key: 'finance_intervention', label: 'Finance' },
  { key: 'ceo_review', label: 'CEO' },
  { key: 'approved', label: 'Approved' },
];

const statusOrder: WorkflowStatus[] = [
  'draft', 'submitted', 'sales_head_review', 'sbu_head_review',
  'president_review', 'finance_intervention', 'ceo_review', 'approved',
];

interface ApprovalTimelineProps {
  currentStatus: WorkflowStatus;
}

const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({ currentStatus }) => {
  const currentIdx = statusOrder.indexOf(currentStatus);

  return (
    <div className="relative">
      <div className="flex items-start justify-between relative">
        {steps.map((step, idx) => {
          const stepIdx = statusOrder.indexOf(step.key);
          const isCompleted = stepIdx < currentIdx;
          const isActive = step.key === currentStatus;
          const isPending = stepIdx > currentIdx;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1 relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                />
              )}

              {/* Step circle */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : isActive
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isActive ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
              </div>

              {/* Label */}
              <p
                className={`mt-2 text-xs font-medium text-center leading-tight ${
                  isCompleted
                    ? 'text-emerald-600'
                    : isActive
                    ? 'text-blue-600'
                    : isPending
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApprovalTimeline;
