import type { Contract } from '@/types';

export const contracts: Contract[] = [
  {
    id: 'CTR-001',
    name: 'Foundation and Structural Frame for Tower A',
    contractor: 'BuildRight Inc.',
    client: 'Urban Development Group',
    startDate: new Date('2023-01-15'),
    endDate: new Date('2024-01-14'),
    totalValue: 1250000,
    status: 'Active',
    scope: 'Complete foundation work and erect the main structural frame for the 20-story Tower A, including all necessary materials and labor.',
    payments: [
      { id: 'PAY-001', amount: 125000, status: 'Paid', requestDate: new Date('2023-02-15'), paidDate: new Date('2023-03-01') },
      { id: 'PAY-002', amount: 250000, status: 'Paid', requestDate: new Date('2023-05-20'), paidDate: new Date('2023-06-05') },
      { id: 'PAY-003', amount: 250000, status: 'Pending', requestDate: new Date('2023-08-18'), },
    ],
    changeOrders: [
      { id: 'CO-001', title: 'Additional reinforcement in basement level 2', description: 'Client requested higher-grade steel reinforcement due to updated seismic codes.', status: 'Approved', date: new Date('2023-04-10'), impact: { cost: 50000, scheduleDays: 14 } },
    ],
    versions: [
      { version: 1, date: new Date('2023-01-15'), changeSummary: 'Initial contract signing.' },
      { version: 2, date: new Date('2023-04-10'), changeSummary: 'CO-001: Additional reinforcement.' },
    ],
  },
  {
    id: 'CTR-002',
    name: 'HVAC Installation for Commercial Complex',
    contractor: 'Cooling Systems Co.',
    client: 'Prime Properties',
    startDate: new Date('2023-03-01'),
    endDate: new Date('2023-09-30'),
    totalValue: 780000,
    status: 'Active',
    scope: 'Installation of all heating, ventilation, and air conditioning systems for the new 5-building commercial complex.',
     payments: [
      { id: 'PAY-004', amount: 78000, status: 'Paid', requestDate: new Date('2023-03-30'), paidDate: new Date('2023-04-15') },
      { id: 'PAY-005', amount: 156000, status: 'Pending', requestDate: new Date('2023-06-25') },
    ],
    changeOrders: [],
    versions: [
      { version: 1, date: new Date('2023-03-01'), changeSummary: 'Initial contract signing.' },
    ],
  },
  {
    id: 'CTR-003',
    name: 'Site Landscaping and Exterior Finishing',
    contractor: 'GreenScapes LLC',
    client: 'Urban Development Group',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    totalValue: 450000,
    status: 'Completed',
    scope: 'Full site landscaping, including irrigation, planting, paving, and exterior lighting for Tower A and surrounding areas.',
    payments: [
      { id: 'PAY-006', amount: 225000, status: 'Paid', requestDate: new Date('2024-03-15'), paidDate: new Date('2024-04-01') },
      { id: 'PAY-007', amount: 225000, status: 'Paid', requestDate: new Date('2024-07-05'), paidDate: new Date('2024-07-20') },
    ],
    changeOrders: [],
    versions: [
      { version: 1, date: new Date('2024-01-01'), changeSummary: 'Initial contract signing.' },
    ],
  },
  {
    id: 'CTR-004',
    name: 'Interior Electrical Wiring - Residential Block',
    contractor: 'Spark Electricals',
    client: 'Evergreen Homes',
    startDate: new Date('2023-06-15'),
    endDate: new Date('2023-12-15'),
    totalValue: 320000,
    status: 'On Hold',
    scope: 'Complete electrical wiring for all 150 units in the new residential block, including outlets, switches, and main panel connections.',
    payments: [
      { id: 'PAY-008', amount: 50000, status: 'Paid', requestDate: new Date('2023-07-15'), paidDate: new Date('2023-08-01') },
    ],
    changeOrders: [],
    versions: [
      { version: 1, date: new Date('2023-06-15'), changeSummary: 'Initial contract signing.' },
    ],
  },
    {
    id: 'CTR-005',
    name: 'Plumbing & Sanitary Works for Mall',
    contractor: 'AquaFlow Plumbers',
    client: 'Galleria Malls Ltd.',
    startDate: new Date('2023-08-01'),
    endDate: new Date('2024-02-28'),
    totalValue: 620000,
    status: 'Active',
    scope: 'Installation of all plumbing and sanitary systems across the 3-floor shopping mall.',
    payments: [
      { id: 'PAY-009', amount: 62000, status: 'Paid', requestDate: new Date('2023-09-01'), paidDate: new Date('2023-09-15') },
      { id: 'PAY-010', amount: 124000, status: 'Pending', requestDate: new Date('2023-11-20'), },
    ],
    changeOrders: [
      { id: 'CO-002', title: 'Upgrade to touchless faucets in all public restrooms', description: 'Client decision to upgrade fixtures for improved hygiene.', status: 'Approved', date: new Date('2023-10-05'), impact: { cost: 35000, scheduleDays: 10 } },
      { id: 'CO-003', title: 'Additional grease trap for food court kitchens', description: 'Regulatory requirement identified post-planning.', status: 'Pending', date: new Date('2023-11-15'), impact: { cost: 25000, scheduleDays: 7 } },
    ],
    versions: [
      { version: 1, date: new Date('2023-08-01'), changeSummary: 'Initial contract signing.' },
      { version: 2, date: new Date('2023-10-05'), changeSummary: 'CO-002: Upgraded faucets.' },
    ],
  },
];
