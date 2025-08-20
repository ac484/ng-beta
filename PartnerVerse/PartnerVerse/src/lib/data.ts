import type { Partner, Workflow } from './types';

export const partners: Partner[] = [];

export const sampleWorkflow: Workflow = {
    id: 'wf-1',
    name: 'Standard Partner Onboarding',
    nodes: [
        { id: 'n1', type: 'start', label: 'Start', position: { x: 50, y: 200 } },
        { id: 'n2', type: 'task', label: 'Initial Contact', position: { x: 250, y: 200 } },
        { id: 'n3', type: 'decision', label: 'KYC Check', position: { x: 450, y: 200 } },
        { id: 'n4', type: 'task', label: 'Send Welcome Kit', position: { x: 650, y: 100 } },
        { id: 'n5', type: 'task', label: 'Schedule Onboarding Call', position: { x: 650, y: 300 } },
        { id: 'n6', type: 'end', label: 'End', position: { x: 850, y: 200 } },
    ],
    edges: [
        { id: 'e1-2', source: 'n1', target: 'n2' },
        { id: 'e2-3', source: 'n2', target: 'n3' },
        { id: 'e3-4', source: 'n3', target: 'n4', label: 'Pass' },
        { id: 'e3-5', source: 'n3', target: 'n5', label: 'Fail' },
        { id: 'e4-6', source: 'n4', target: 'n6' },
        { id: 'e5-6', source: 'n5', target: 'n6' },
    ],
};
