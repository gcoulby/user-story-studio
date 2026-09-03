import type { Card } from '@/types/domain'

export const seedCards: Card[] = [
  {
    id: 'c1',
    actorId: 'a1',
    trigger: 'starting my working day',
    goal: 'see every task assigned to me in one place',
    benefit: "I know what to focus on without hunting through projects",
    conversation:
      "Team agreed 'My Work' spans every project, sorted by due date rather than grouped by project.",
    confirmation: [
      {
        id: 'ac-c1-1',
        text: 'Tasks from every project the member belongs to appear in one list',
      },
      { id: 'ac-c1-2', text: 'Overdue tasks are flagged and sorted to the top' },
    ],
    epicIds: ['e1'],
    x: 320,
    y: 60,
  },
  {
    id: 'c2',
    actorId: 'a1',
    trigger: 'I finish a piece of work',
    goal: 'mark a task done and have it drop off my active list',
    benefit: "my board reflects what's actually left",
    conversation: '',
    confirmation: [
      {
        id: 'ac-c2-1',
        text: "Completing a task removes it from 'My Work' but keeps it in project history",
      },
    ],
    epicIds: ['e1'],
    x: 680,
    y: 60,
  },
  {
    id: 'c3',
    actorId: 'a2',
    trigger: 'planning the week with the team',
    goal: 'drag tasks between columns to set what gets picked up next',
    benefit: 'priorities are visible without a status meeting',
    conversation:
      'Columns are per-project and configurable; the default set is Backlog / In progress / Review / Done.',
    confirmation: [
      {
        id: 'ac-c3-1',
        text: 'Moving a card is reflected for all viewers within two seconds',
      },
      { id: 'ac-c3-2', text: 'Column order is remembered per project' },
    ],
    epicIds: ['e1'],
    x: 680,
    y: 300,
  },
  {
    id: 'c4',
    actorId: 'a2',
    trigger: "a task hasn't been touched in days",
    goal: 'get a Monday digest of stale tasks',
    benefit: 'nothing quietly stalls',
    conversation:
      'Staleness threshold is configurable per project; default is five working days.',
    confirmation: [
      {
        id: 'ac-c4-1',
        text: 'Digest lists each task, its assignee, and days since last activity',
      },
      {
        id: 'ac-c4-2',
        text: 'Commenting on or moving a task resets its staleness',
      },
    ],
    epicIds: ['e1'],
    x: 1040,
    y: 300,
  },
  {
    id: 'c5',
    actorId: 'a3',
    trigger: 'a new teammate joins',
    goal: 'invite someone by email and assign them a role',
    benefit: 'they can start contributing on day one',
    conversation:
      'Roles for v1 are Admin, Member, Viewer. Invite links are single-use and expire after seven days.',
    confirmation: [
      { id: 'ac-c5-1', text: 'Invitee receives an email with a single-use join link' },
      { id: 'ac-c5-2', text: 'Pending invites are listed until accepted or revoked' },
    ],
    epicIds: ['e2'],
    x: 320,
    y: 500,
  },
  {
    id: 'c6',
    actorId: 'a3',
    trigger: 'setting up a new workspace',
    goal: 'create projects from a template with default columns and labels',
    benefit: "teams aren't staring at a blank board",
    conversation: '',
    confirmation: [
      {
        id: 'ac-c6-1',
        text: 'Choosing a template pre-fills columns, labels, and a sample task',
      },
      { id: 'ac-c6-2', text: 'A template can be saved from an existing project' },
    ],
    epicIds: ['e2'],
    x: 680,
    y: 500,
  },
]
