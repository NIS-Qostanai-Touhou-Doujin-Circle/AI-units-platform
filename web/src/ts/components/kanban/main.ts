import $ from "jquery";
import { Task, Project } from "./types";
import { getMockProject } from "./example";
import getTemplate from "../../helpers/getTemplate";
import { KanbanBoard } from "./general";


//#region DOM
const kanbanContainer = $("#kanban-container");
const kanbanColumnTemplate = getTemplate("kanban-column-template");
const kanbanSubtaskTemplate = getTemplate("kanban-subtask-template");
const kanbanPlaceholder = $(
	'<div class="card data-card"><h3>&nbsp;</h3></div>'
).addClass("bg-gray-300");
//#endregion

function renderTaskCard(task: Task) {
	const subtaskItem = $(kanbanSubtaskTemplate!).clone().find("> div");
	subtaskItem.find(".subtask-name").text(task.name);
	subtaskItem.attr("data-id", task.id.toString());
	const { start, end, click } = subtaskHandlers(subtaskItem);
	subtaskItem.get(0)!.addEventListener("dragstart", start);
	subtaskItem.get(0)!.addEventListener("dragend", end);
	subtaskItem.get(0)!.addEventListener("click", click);
	return subtaskItem;
}

function subtaskHandlers(subtaskItem: JQuery<HTMLElement>): {
	start: (event: DragEvent) => void;
	end: (event: DragEvent) => void;
	click: (event: MouseEvent) => void;
} {
	function start(event: DragEvent) {
		if (!event.dataTransfer) return;

		event.dataTransfer.setData(
			"text/json",
			JSON.stringify({ id: subtaskItem.attr("data-id") })
		);
		event.dataTransfer.setDragImage(subtaskItem[0], 10, 10);

		setTimeout(() => {
			subtaskItem.hide();
		}, 0);
	}
	function end(event: DragEvent) {
		subtaskItem.show();
	}
	function click(event: MouseEvent) {
		event.preventDefault();
		event.stopImmediatePropagation();
		alert(`Clicked on subtask ${subtaskItem.attr("data-id")}`);
	}
	return { start, end, click };
}

const kanban = new KanbanBoard<Task>({
	createPlaceholder: () => kanbanPlaceholder,
	getStatuses: () => [
		{ status: "todo", ru_RU: "К выполнению" },
		{ status: "in_progress", ru_RU: "В процессе" },
		{ status: "done", ru_RU: "Выполнено" },
	],
	getStatusOf: (task) => task.task_status,
	renderAsKanbanCard: renderTaskCard,
})
kanban.render(getMockProject().root_task.subtasks.tasks, $('#kanban-container'));