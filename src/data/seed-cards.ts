import type { Card } from '@/types/domain'

export const seedCards: Card[] = [
  {
    id: 'c1',
    actorId: 'a1',
    trigger: 'Policyholder has an insured loss',
    goal: 'submit a claim online',
    benefit: "I don't have to call and wait on hold",
    conversation:
      'Discussed with support team — mobile upload of photos came up as a hard requirement, not a nice-to-have.',
    confirmation: [
      {
        id: 'ac-c1-1',
        text: 'Form rejects submission with no supporting document',
      },
      {
        id: 'ac-c1-2',
        text: 'Confirmation reference number is emailed within 60s',
      },
    ],
    epicIds: ['e1'],
    x: 300,
    y: 60,
  },
  {
    id: 'c2',
    actorId: 'a2',
    trigger: 'New claim is submitted',
    goal: 'assign a severity tier to the claim',
    benefit: 'urgent claims get handled first',
    conversation:
      'Agreed severity tiers reuse the underwriting risk bands rather than inventing a new scale.',
    confirmation: [
      {
        id: 'ac-c2-1',
        text: 'Tier is set before the claim leaves the intake queue',
      },
      {
        id: 'ac-c2-2',
        text: 'Handler can override the suggested tier with a reason',
      },
    ],
    epicIds: ['e1'],
    x: 640,
    y: 260,
  },
  {
    id: 'c3',
    actorId: 'a2',
    trigger: 'Claim is missing required evidence',
    goal: 'request the specific missing document from the policyholder',
    benefit: "the claim isn't stalled on ambiguity",
    conversation: '',
    confirmation: [
      { id: 'ac-c3-1', text: 'Policyholder receives a list naming each missing item' },
    ],
    epicIds: ['e1'],
    x: 640,
    y: 440,
  },
  {
    id: 'c4',
    actorId: 'a3',
    trigger: 'Claim tier is set to high',
    goal: 'review the claim against policy terms',
    benefit: 'payout decisions are defensible',
    conversation:
      'Underwriting flagged this needs read access to the full claim history, not just this claim.',
    confirmation: [
      { id: 'ac-c4-1', text: 'Underwriter sees full claim timeline' },
      { id: 'ac-c4-2', text: 'Decision is logged with a rationale field' },
    ],
    epicIds: ['e2'],
    x: 980,
    y: 460,
  },
]
