# Clipper Hub — Initial Data Model

This is the first data contract for the MVP. It is a planning baseline, not a deployed database schema.

## Entities

### Account
- id: string
- platform: TikTok | Instagram | YouTube | Other
- handle: string
- displayName: string
- status: active | paused | restricted
- notes: string
- createdAt: ISO datetime
- updatedAt: ISO datetime

### Content
- id: string
- title: string
- accountId: Account.id
- platform: string
- status: idea | scripting | editing | review | scheduled | published
- hook: string
- caption: string
- publishAt: ISO datetime | null
- publishedUrl: string | null
- createdAt: ISO datetime
- updatedAt: ISO datetime

### Project
- id: string
- name: string
- objective: string
- status: active | paused | completed
- startAt: ISO datetime | null
- dueAt: ISO datetime | null

### Task
- id: string
- projectId: Project.id | null
- title: string
- status: todo | doing | done
- priority: low | medium | high
- dueAt: ISO datetime | null
- assignedTo: string | null

### Asset
- id: string
- name: string
- type: video | audio | image | font | preset | other
- location: string
- tags: string[]
- createdAt: ISO datetime

## Rules
- Use stable IDs; do not rely on array positions.
- Keep account/content references via IDs.
- Validate imported JSON before replacing saved data.
- Never delete user data silently; confirm destructive actions and provide backup.
- Demo metrics must be labeled until backed by actual records.

## MVP sequence
1. Accounts CRUD
2. Content CRUD + account relation
3. Projects and Tasks
4. Assets catalog
5. Dashboard KPIs derived from real local records
6. Database migration and multi-device sync
