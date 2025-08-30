import $ from "jquery";
import { Task, Project } from "./types";
import { getMockProject } from "./example";
import getTemplate from "../../helpers/getTemplate";
import { polyfill } from "mobile-drag-drop";

polyfill();

//#region DOM
const kanbanContainer = $("#kanban-container");
const kanbanColumnTemplate = getTemplate("kanban-column-template");
const kanbanSubtaskTemplate = getTemplate("kanban-subtask-template");
const kanbanPlaceholder = $(
	'<div class="card data-card"><h3>&nbsp;</h3></div>'
).addClass("bg-gray-300");
//#endregion

export function renderTaskAsKanban(task: Task) {
	// group subtasks by status (including empty statuses)
	const groupedSubtasks = {
		todo: [],
		in_progress: [],
		done: [],
	} as Record<string, Task[]>;
	for (const subtask of task.subtasks.tasks) {
		groupedSubtasks[subtask.task_status].push(subtask);
	}

	// clear container
	kanbanContainer.empty();

	// render columns
	for (const [status, subtasks] of Object.entries(groupedSubtasks)) {
		const column = $(kanbanColumnTemplate!).clone().find("> div");
		column.find(".kanban-status-name").text(translateStatus(status));
		const { dragOver, dragEnter, dragLeave, drop } = columnHandlers(column);
		column.get(0)!.addEventListener("dragover", dragOver);
		column.get(0)!.addEventListener("dragenter", dragEnter);
		column.get(0)!.addEventListener("dragleave", dragLeave);
		column.get(0)!.addEventListener("drop", drop);

		const subtaskList = column.find(".kanban-column-subtasks");
		for (const subtask of subtasks) {
			const subtaskItem = $(kanbanSubtaskTemplate!).clone().find("> div");
			subtaskItem.find(".subtask-name").text(subtask.name);
			subtaskItem.attr("data-id", subtask.id.toString());
            const { start, end, click } = subtaskHandlers(subtaskItem);
			subtaskItem.get(0)!.addEventListener("dragstart", start);
			subtaskItem.get(0)!.addEventListener("dragend", end);
			subtaskItem.get(0)!.addEventListener("click", click);
			subtaskList.append(subtaskItem);
		}
		kanbanContainer.append(column);
	}
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

/** Returns the index of the card that would be pushed out by the drop
 * Based on the mouse position and the card heights, this function calculates
 * which card would be displaced if a new card is dropped.
 * may return the length of the card list, indicating the new card should be appended.
 */
function findSpot(event: DragEvent, columnSubtasks: HTMLElement): number {
	const cardElements = columnSubtasks.querySelectorAll(".kanban-card");
	const cardHeights = Array.from(cardElements).map(
		(card) => card.clientHeight
	);
	const mouseY = event.clientY - columnSubtasks.getBoundingClientRect().top;

	let totalHeight = 0;
	for (let i = 0; i < cardHeights.length; i++) {
		totalHeight += cardHeights[i];
		if (mouseY < totalHeight) {
			return i;
		}
	}
	return cardHeights.length;
}

function columnHandlers(column: JQuery<HTMLElement>): {
	dragOver: (event: DragEvent) => void;
	dragEnter: (event: DragEvent) => void;
	dragLeave: (event: DragEvent) => void;
	drop: (event: DragEvent) => void;
} {
	let oldSpot = -1;
	let enterCount = 0;
	const subtasks = column.find(".kanban-column-subtasks");
	function dragOver(event: DragEvent) {
		event.preventDefault();

		const i = findSpot(event, subtasks.get(0)!);
		if (i !== oldSpot) {
			if (i < subtasks.find(".kanban-card").length) {
				kanbanPlaceholder.insertBefore(
					subtasks.find(".kanban-card").eq(i)
				);
			} else {
				kanbanPlaceholder.appendTo(subtasks);
			}
		}
		oldSpot = i;
	}
	function dragEnter(event: DragEvent) {
		event.preventDefault();
		enterCount++;
	}
	function dragLeave(event: DragEvent) {
		event.preventDefault();
		enterCount--;
		if (enterCount === 0) {
			kanbanPlaceholder.remove();
			oldSpot = -1;
		}
	}
	function drop(event: DragEvent) {
		event.preventDefault();
		const subtaskData = event.dataTransfer?.getData("text/json");
		if (!subtaskData) return;

		const { id } = JSON.parse(subtaskData);
		if (!id) return;

		kanbanPlaceholder.replaceWith($(`[data-id='${id}']`));
	}
	kanbanContainer.on("drop", (ev) => {
		oldSpot = -1;
		enterCount = 0;
	});
	return {
		dragOver,
		dragEnter,
		dragLeave,
		drop,
	};
}

function translateStatus(status: string) {
	const statusMap: Record<string, string> = {
		todo: "К выполнению",
		in_progress: "В процессе",
		done: "Завершено",
	};
	return statusMap[status] || status;
}

renderTaskAsKanban(getMockProject().root_task);
