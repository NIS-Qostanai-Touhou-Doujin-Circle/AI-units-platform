# `c0st1nus`'s Todo List

## Database
- [ ] To update `tasks` table schema
  - [ ] Add `updated_at` - `timestamptz`
      - When the task itself was updated.
  - [ ] Add **`relation_updated_at`** - `timestamptz`
      - When the task *itself* or *any* of its descendants (at any level) is created, updated, or deleted. This field must be updated for the modified task and all of its ancestors up the chain. This is crucial for the frontend polling mechanism.

## Backend Logic
- [ ] Implement a service function for cascading timestamp updates
  - [ ] This function takes a `task_id` as input.
  - [ ] It should update the `relation_updated_at` field for the corresponding task and then recursively for all its parents (`parent_task_id`) until it reaches a root task.
  - [ ] This function will be called by all API endpoints that modify task data.

## API Endpoints
### Basic CRUD
- [ ] `POST /tasks` - Create a new task/subtask
  - [ ] Payload must include `name`, `project_id`, `status_id`.
  - [ ] Payload can optionally include `parent_task_id` and `content`.
  - [ ] By default, the new task becomes the first in its list (`previous_task_id` is `null`).
- [ ] `PATCH /tasks/{id}` - Update task properties
  - [ ] Allows changing `name` and `content`.
  - [ ] Should also handle adding/removing assignees by modifying the `task_assignments` table.
- [ ] `DELETE /tasks/{id}` - Delete a task
  - [ ] Ensure Foreign Key constraints have `ON DELETE CASCADE` to automatically delete all subtasks and related assignments.
  - [ ] Must trigger the timestamp update for the parent *before* deletion.

### Data Retrieval
- [ ] `GET /tasks/{id}` - Get a single task
  - [ ] Response should include all task fields and a list of its assignees from `task_assignments`.
- [ ] `GET /projects/{projectId}/tasks` - Get all tasks for a project
  - [ ] Returns a flat list of all tasks associated with a `project_id`.
  - [ ] The frontend will be responsible for building the tree/board structure from this list.

### Movement & Status Changes
- [ ] `PATCH /tasks/{id}/status` - Change task status (for simple clicks)
  - [ ] Payload: `{ "status_id": new_status_id }`.
  - [ ] Logic: Updates `status_id` and sets `previous_task_id` to `null` to move the task to the top of the new column.
- [ ] `PATCH /tasks/{id}/position` - Change task order (within the same status)
  - [ ] Payload: `{ "previous_task_id": target_task_id | null }`.
  - [ ] Logic: Updates the `previous_task_id` field to re-order the task.
- [ ] `PATCH /tasks/{id}/move` - Full drag-and-drop move
  - [ ] Payload: `{ "status_id": new_status_id, "previous_task_id": target_task_id | null }`.
  - [ ] Logic: A combination of the two above, allowing simultaneous change of status and position. Requires a database transaction to ensure atomicity.