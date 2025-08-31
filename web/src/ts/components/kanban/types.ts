export interface Project {
	id: number;
	name: string;
	root_task: Task;
}

export interface Task {
	id: number;
	name: string;
	created_at: Date;
	content?: any;
	previous_task_id: number | null;
	parent_task_id: number | null;
	task_status: "todo" | "in_progress" | "done";
	assignments: TaskAssignment[];

	subtasks: {
		loaded: boolean;
		tasks: Task[];
	};
}

export interface TaskAssignment {
	user: User;
	can_edit: boolean;
}

export interface User {
	id: number;
	name: string;
	image_url?: string;
}

export interface KanbanMethods<T> {
	getStatuses(): string[];
	renderAsKanbanCard(obj: T): JQuery<HTMLElement>;
	getStatusOf(obj: T): string | undefined;
	createPlaceholder(): JQuery<HTMLElement>;
}