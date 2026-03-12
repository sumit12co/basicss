import type {
  User,
  PriceListItem,
  ProductWithItemCodes,
  ERPRecord,
  Notification,
  ApprovalMatrix,
  AuditEntry,
  FinanceReviewItem,
} from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Rahul Sharma', email: 'rahul@company.com', role: 'business', department: 'Business Planning', isActive: true },
  { id: 'u2', name: 'Vikram Singh', email: 'vikram@company.com', role: 'approver', approverLevel: 'sales_head', department: 'Sales', isActive: true },
  { id: 'u3', name: 'Anita Patel', email: 'anita@company.com', role: 'approver', approverLevel: 'sbu_head', department: 'SBU', isActive: true },
  { id: 'u4', name: 'Suresh Kumar', email: 'suresh@company.com', role: 'approver', approverLevel: 'president', department: 'Executive', isActive: true },
  { id: 'u5', name: 'Priya Mehta', email: 'priya@company.com', role: 'approver', approverLevel: 'ceo', department: 'Executive', isActive: true },
  { id: 'u6', name: 'Deepa Nair', email: 'deepa@company.com', role: 'finance', department: 'Finance', isActive: true },
  { id: 'u7', name: 'Admin User', email: 'admin@company.com', role: 'admin', department: 'IT', isActive: true },
  { id: 'u8', name: 'Arjun Rao', email: 'arjun@company.com', role: 'business', department: 'Business Planning', isActive: false },
  { id: 'u9', name: 'Neha Gupta', email: 'neha@company.com', role: 'finance', department: 'Finance', isActive: true },
  { id: 'u10', name: 'Ravi Teja', email: 'ravi@company.com', role: 'approver', approverLevel: 'sales_head', department: 'Sales', isActive: true },
];

export const MOCK_PRICE_LIST: PriceListItem[] = [
  { id: 'p1', productName: 'Industrial Pump A-Series', itemCode: 'IPA-001', salesVolume: 1200, git: 850, freight: 120, calculatedFloorPrice: 1045, budgetPrice: 1100, variance: -5.0, floorPrice: 1045, remarks: '', isEdited: false },
  { id: 'p2', productName: 'Hydraulic Valve Pro', itemCode: 'HVP-202', salesVolume: 800, git: 620, freight: 85, calculatedFloorPrice: 780, budgetPrice: 820, variance: -4.9, floorPrice: 780, remarks: '', isEdited: false },
  { id: 'p3', productName: 'Compressor Unit B', itemCode: 'CUB-305', salesVolume: 450, git: 1200, freight: 200, calculatedFloorPrice: 1520, budgetPrice: 1480, variance: 2.7, floorPrice: 1520, remarks: '', isEdited: false },
  { id: 'p4', productName: 'Electric Motor 5HP', itemCode: 'EM5-410', salesVolume: 2300, git: 380, freight: 60, calculatedFloorPrice: 495, budgetPrice: 510, variance: -2.9, floorPrice: 495, remarks: '', isEdited: false },
  { id: 'p5', productName: 'Gear Box Standard', itemCode: 'GBS-520', salesVolume: 670, git: 920, freight: 145, calculatedFloorPrice: 1205, budgetPrice: 1250, variance: -3.6, floorPrice: 1205, remarks: '', isEdited: false },
  { id: 'p6', productName: 'Pneumatic Cylinder C', itemCode: 'PCC-601', salesVolume: 1800, git: 280, freight: 45, calculatedFloorPrice: 365, budgetPrice: 380, variance: -3.9, floorPrice: 365, remarks: '', isEdited: false },
  { id: 'p7', productName: 'Bearing Assembly X', itemCode: 'BAX-715', salesVolume: 3200, git: 180, freight: 25, calculatedFloorPrice: 230, budgetPrice: 240, variance: -4.2, floorPrice: 230, remarks: '', isEdited: false },
  { id: 'p8', productName: 'Control Panel Basic', itemCode: 'CPB-820', salesVolume: 290, git: 1800, freight: 280, calculatedFloorPrice: 2260, budgetPrice: 2200, variance: 2.7, floorPrice: 2260, remarks: '', isEdited: false },
  { id: 'p9', productName: 'Flow Meter Digital', itemCode: 'FMD-905', salesVolume: 560, git: 650, freight: 90, calculatedFloorPrice: 820, budgetPrice: 850, variance: -3.5, floorPrice: 820, remarks: '', isEdited: false },
  { id: 'p10', productName: 'Pressure Gauge High', itemCode: 'PGH-1010', salesVolume: 4100, git: 95, freight: 15, calculatedFloorPrice: 125, budgetPrice: 130, variance: -3.8, floorPrice: 125, remarks: '', isEdited: false },
  { id: 'p11', productName: 'Solenoid Valve SV2', itemCode: 'SVS-1115', salesVolume: 920, git: 420, freight: 65, calculatedFloorPrice: 545, budgetPrice: 560, variance: -2.7, floorPrice: 545, remarks: '', isEdited: false },
  { id: 'p12', productName: 'Heat Exchanger Mini', itemCode: 'HEM-1220', salesVolume: 180, git: 2400, freight: 380, calculatedFloorPrice: 3010, budgetPrice: 2950, variance: 2.0, floorPrice: 3010, remarks: '', isEdited: false },
  { id: 'p13', productName: 'Actuator Linear AL', itemCode: 'ALL-1325', salesVolume: 750, git: 540, freight: 80, calculatedFloorPrice: 680, budgetPrice: 700, variance: -2.9, floorPrice: 680, remarks: '', isEdited: false },
  { id: 'p14', productName: 'Turbine Blade Set', itemCode: 'TBS-1430', salesVolume: 340, git: 1650, freight: 260, calculatedFloorPrice: 2080, budgetPrice: 2100, variance: -1.0, floorPrice: 2080, remarks: '', isEdited: false },
  { id: 'p15', productName: 'Conveyor Belt Heavy', itemCode: 'CBH-1535', salesVolume: 210, git: 3200, freight: 500, calculatedFloorPrice: 4010, budgetPrice: 3900, variance: 2.8, floorPrice: 4010, remarks: '', isEdited: false },
];

export const MOCK_PRODUCTS_WITH_ITEM_CODES: ProductWithItemCodes[] = [
  {
    id: 'p1',
    productName: 'Industrial Pump A-Series',
    approvedFloorPrice: 1045,
    isExpanded: false,
    itemCodes: [
      { id: 'ic1', code: 'IPA-001-S', description: 'Small Size', uom: 'PCS', submittedPrice: 980, lastPrice: 950, variableCost: 820, businessContribution: 160, status: 'draft' },
      { id: 'ic2', code: 'IPA-001-M', description: 'Medium Size', uom: 'PCS', submittedPrice: 1045, lastPrice: 1020, variableCost: 870, businessContribution: 175, status: 'draft' },
      { id: 'ic3', code: 'IPA-001-L', description: 'Large Size', uom: 'PCS', submittedPrice: 1150, lastPrice: 1100, variableCost: 950, businessContribution: 200, status: 'draft' },
    ],
  },
  {
    id: 'p2',
    productName: 'Hydraulic Valve Pro',
    approvedFloorPrice: 780,
    isExpanded: false,
    itemCodes: [
      { id: 'ic4', code: 'HVP-202-A', description: 'Type A', uom: 'PCS', submittedPrice: 780, lastPrice: 760, variableCost: 650, businessContribution: 130, status: 'submitted_to_finance' },
      { id: 'ic5', code: 'HVP-202-B', description: 'Type B', uom: 'PCS', submittedPrice: 820, lastPrice: 800, variableCost: 680, businessContribution: 140, status: 'submitted_to_finance' },
    ],
  },
  {
    id: 'p3',
    productName: 'Compressor Unit B',
    approvedFloorPrice: 1520,
    isExpanded: false,
    itemCodes: [
      { id: 'ic6', code: 'CUB-305-1P', description: '1 Phase', uom: 'SET', submittedPrice: 1520, lastPrice: 1480, variableCost: 1280, businessContribution: 240, status: 'finance_approved' },
      { id: 'ic7', code: 'CUB-305-3P', description: '3 Phase', uom: 'SET', submittedPrice: 1680, lastPrice: 1620, variableCost: 1400, businessContribution: 280, status: 'finance_approved' },
    ],
  },
  {
    id: 'p4',
    productName: 'Electric Motor 5HP',
    approvedFloorPrice: 495,
    isExpanded: false,
    itemCodes: [
      { id: 'ic8', code: 'EM5-410-AC', description: 'AC Motor', uom: 'PCS', submittedPrice: 495, lastPrice: 480, variableCost: 410, businessContribution: 85, status: 'sent_to_erp' },
      { id: 'ic9', code: 'EM5-410-DC', description: 'DC Motor', uom: 'PCS', submittedPrice: 540, lastPrice: 520, variableCost: 450, businessContribution: 90, status: 'sent_to_erp' },
      { id: 'ic10', code: 'EM5-410-VFD', description: 'VFD Motor', uom: 'PCS', submittedPrice: 620, lastPrice: 600, variableCost: 520, businessContribution: 100, status: 'sent_to_erp' },
    ],
  },
  {
    id: 'p5',
    productName: 'Gear Box Standard',
    approvedFloorPrice: 1205,
    isExpanded: false,
    itemCodes: [
      { id: 'ic11', code: 'GBS-520-R1', description: 'Ratio 1:10', uom: 'PCS', submittedPrice: 1205, lastPrice: 1180, variableCost: 1010, businessContribution: 195, status: 'draft' },
      { id: 'ic12', code: 'GBS-520-R2', description: 'Ratio 1:20', uom: 'PCS', submittedPrice: 1280, lastPrice: 1250, variableCost: 1070, businessContribution: 210, status: 'draft' },
    ],
  },
];

export const MOCK_ERP_RECORDS: ERPRecord[] = [
  { id: 'e1', itemCode: 'IPA-001-S', productName: 'Industrial Pump A-Series', price: 980, status: 'success', lastUpdated: '2025-03-10 14:30', retryCount: 0 },
  { id: 'e2', itemCode: 'IPA-001-M', productName: 'Industrial Pump A-Series', price: 1045, status: 'success', lastUpdated: '2025-03-10 14:31', retryCount: 0 },
  { id: 'e3', itemCode: 'HVP-202-A', productName: 'Hydraulic Valve Pro', price: 780, status: 'in_progress', lastUpdated: '2025-03-10 15:00', retryCount: 0 },
  { id: 'e4', itemCode: 'HVP-202-B', productName: 'Hydraulic Valve Pro', price: 820, status: 'in_progress', lastUpdated: '2025-03-10 15:01', retryCount: 0 },
  { id: 'e5', itemCode: 'CUB-305-1P', productName: 'Compressor Unit B', price: 1520, status: 'failed', lastUpdated: '2025-03-10 15:15', errorMessage: 'ERP connection timeout. Item code not found in LN system.', retryCount: 2 },
  { id: 'e6', itemCode: 'CUB-305-3P', productName: 'Compressor Unit B', price: 1680, status: 'failed', lastUpdated: '2025-03-10 15:16', errorMessage: 'Validation error: Price exceeds maximum limit.', retryCount: 1 },
  { id: 'e7', itemCode: 'EM5-410-AC', productName: 'Electric Motor 5HP', price: 495, status: 'pending', lastUpdated: '2025-03-10 15:30', retryCount: 0 },
  { id: 'e8', itemCode: 'EM5-410-DC', productName: 'Electric Motor 5HP', price: 540, status: 'pending', lastUpdated: '2025-03-10 15:30', retryCount: 0 },
  { id: 'e9', itemCode: 'GBS-520-R1', productName: 'Gear Box Standard', price: 1205, status: 'pending', lastUpdated: '2025-03-10 15:30', retryCount: 0 },
  { id: 'e10', itemCode: 'PCC-601-ST', productName: 'Pneumatic Cylinder C', price: 365, status: 'success', lastUpdated: '2025-03-10 13:45', retryCount: 0 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'action_required', title: 'Price List Pending Approval', description: 'March 2025 price list has been submitted for your approval. Please review and take action.', timestamp: '2025-03-10 09:00', isRead: false, link: '/approvals', role: ['approver'] },
  { id: 'n2', type: 'action_required', title: 'Finance Intervention Required', description: 'Price list approved by President. Please add VC, Last Price and Business Contribution.', timestamp: '2025-03-10 11:30', isRead: false, link: '/approvals', role: ['finance'] },
  { id: 'n3', type: 'success', title: 'Sales Head Approved', description: 'Vikram Singh has approved the March 2025 price list. Moving to SBU Head review.', timestamp: '2025-03-10 10:15', isRead: true, link: '/approvals', role: ['business'] },
  { id: 'n4', type: 'warning', title: 'Price Revision Requested', description: 'Anita Patel has requested revision for 3 items. Comment: "Please review freight costs for Q2."', timestamp: '2025-03-09 16:45', isRead: false, link: '/approvals', role: ['business'] },
  { id: 'n5', type: 'action_required', title: 'Item Code Prices Pending Review', description: '42 item code prices submitted by Business team. Please review and approve.', timestamp: '2025-03-10 14:00', isRead: false, link: '/finance-review', role: ['finance'] },
  { id: 'n6', type: 'error', title: 'ERP Integration Failed', description: '2 records failed to sync with LN system. Please retry or investigate errors.', timestamp: '2025-03-10 15:16', isRead: false, link: '/erp-integration', role: ['finance', 'admin'] },
  { id: 'n7', type: 'info', title: 'New User Added', description: 'Admin has added Ravi Teja as Sales Head approver.', timestamp: '2025-03-09 10:00', isRead: true, link: '/admin/users', role: ['admin'] },
  { id: 'n8', type: 'success', title: 'ERP Update Successful', description: '8 item codes successfully updated in LN system for March 2025.', timestamp: '2025-03-10 14:32', isRead: true, link: '/erp-integration', role: ['finance'] },
];

export const MOCK_APPROVAL_MATRIX: ApprovalMatrix = {
  sales_head: 'u2',
  sbu_head: 'u3',
  president: 'u4',
  ceo: 'u5',
};

export const MOCK_AUDIT_TRAIL: AuditEntry[] = [
  { id: 'a1', action: 'Price List Submitted', user: 'Rahul Sharma', role: 'Business User', timestamp: '2025-03-10 09:00', comment: 'March 2025 price list submitted for approval' },
  { id: 'a2', action: 'Approved', user: 'Vikram Singh', role: 'Sales Head', timestamp: '2025-03-10 10:15', comment: 'Reviewed and approved. Prices look reasonable.' },
  { id: 'a3', action: 'Revised', user: 'Anita Patel', role: 'SBU Head', timestamp: '2025-03-09 16:45', comment: 'Please review freight costs for Q2. Some items seem high.' },
  { id: 'a4', action: 'Price Updated', user: 'Rahul Sharma', role: 'Business User', timestamp: '2025-03-10 08:30', comment: 'Updated freight for 3 items as requested' },
  { id: 'a5', action: 'Resubmitted', user: 'Rahul Sharma', role: 'Business User', timestamp: '2025-03-10 08:45', comment: 'Revised prices resubmitted after addressing SBU Head comments' },
  { id: 'a6', action: 'Approved', user: 'Anita Patel', role: 'SBU Head', timestamp: '2025-03-10 11:00', comment: 'Revisions look good. Approved.' },
  { id: 'a7', action: 'Finance Intervention', user: 'Deepa Nair', role: 'Finance', timestamp: '2025-03-10 12:00', comment: 'Added VC and business contribution for all products' },
];

export const MOCK_FINANCE_REVIEW: FinanceReviewItem[] = [
  { id: 'fr1', productName: 'Industrial Pump A-Series', itemCode: 'IPA-001-S', submittedPrice: 980, lastPrice: 950, budgetPrice: 1000, variableCost: 820, businessContribution: 160, financeComment: '', status: 'pending' },
  { id: 'fr2', productName: 'Industrial Pump A-Series', itemCode: 'IPA-001-M', submittedPrice: 1045, lastPrice: 1020, budgetPrice: 1050, variableCost: 870, businessContribution: 175, financeComment: '', status: 'pending' },
  { id: 'fr3', productName: 'Industrial Pump A-Series', itemCode: 'IPA-001-L', submittedPrice: 1150, lastPrice: 1100, budgetPrice: 1180, variableCost: 950, businessContribution: 200, financeComment: '', status: 'approved' },
  { id: 'fr4', productName: 'Hydraulic Valve Pro', itemCode: 'HVP-202-A', submittedPrice: 780, lastPrice: 760, budgetPrice: 800, variableCost: 650, businessContribution: 130, financeComment: 'Price within acceptable range', status: 'approved' },
  { id: 'fr5', productName: 'Hydraulic Valve Pro', itemCode: 'HVP-202-B', submittedPrice: 820, lastPrice: 800, budgetPrice: 840, variableCost: 680, businessContribution: 140, financeComment: '', status: 'pending' },
  { id: 'fr6', productName: 'Compressor Unit B', itemCode: 'CUB-305-1P', submittedPrice: 1520, lastPrice: 1480, budgetPrice: 1550, variableCost: 1280, businessContribution: 240, financeComment: '', status: 'rejected' },
  { id: 'fr7', productName: 'Compressor Unit B', itemCode: 'CUB-305-3P', submittedPrice: 1680, lastPrice: 1620, budgetPrice: 1700, variableCost: 1400, businessContribution: 280, financeComment: '', status: 'pending' },
  { id: 'fr8', productName: 'Electric Motor 5HP', itemCode: 'EM5-410-AC', submittedPrice: 495, lastPrice: 480, budgetPrice: 510, variableCost: 410, businessContribution: 85, financeComment: 'Approved for ERP submission', status: 'approved' },
];
