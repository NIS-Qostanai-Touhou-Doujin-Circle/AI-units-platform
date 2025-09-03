import getTemplate from "../../helpers/getTemplate";
import { KanbanMethods } from "./types";
import $ from 'jquery';

import { polyfill } from "mobile-drag-drop";

polyfill();

const kanbanContainer = $("#kanban-container");
const kanbanColumnTemplate = getTemplate("kanban-column-template");

export class KanbanBoard<T> {
	methods: KanbanMethods<T>;
	placeholder: JQuery<HTMLElement>;
	constructor(methods: KanbanMethods<T>) {
		this.methods = methods;
		this.placeholder = this.methods.createPlaceholder();
	}

	render(objs: T[], into: JQuery<HTMLElement>) {
		// group by statuses
		const statuses = this.methods.getStatuses().reduce((acc, status) => {
			acc[status.status] = [];
			return acc;
		}, {} as Record<string, T[]>);

		// assign objects to their respective status groups
		objs.forEach((obj) => {
			const status = this.methods.getStatusOf(obj);
			if (status) {
				statuses[status].push(obj);
			} else {
				console.warn(`No status found for object: ${JSON.stringify(obj)}`);
			}
		});

		// create columns
		Object.entries(statuses).forEach(([status, items]) => {
			const column = $(kanbanColumnTemplate!).clone().find("> div");
			column.find(".kanban-status-name").text(this.translateStatus(status));
			const { dragOver, dragEnter, dragLeave, drop } =
				this.columnHandlers(column);
			column.get(0)!.addEventListener("dragover", dragOver);
			column.get(0)!.addEventListener("dragenter", dragEnter);
			column.get(0)!.addEventListener("dragleave", dragLeave);
			column.get(0)!.addEventListener("drop", drop);
			column.find('.kanban-column-subtasks').append(items.map(item => this.methods.renderAsKanbanCard(item)));
			into.append(column);
		})
	}

	translateStatus(status: string) {
		return this.methods.getStatuses().find(s => s.status === status)?.ru_RU || status;
	}

	
	columnHandlers(column: JQuery<HTMLElement>): {
		dragOver: (event: DragEvent) => void;
		dragEnter: (event: DragEvent) => void;
		dragLeave: (event: DragEvent) => void;
		drop: (event: DragEvent) => void;
	} {
		let oldSpot = -1;
		let enterCount = 0;
		const subtasks = column.find(".kanban-column-subtasks");
		const placeholder = this.placeholder;
		function dragOver(event: DragEvent) {
			event.preventDefault();
	
			const i = findSpot(event, subtasks.get(0)!);
			if (i !== oldSpot) {
				if (i < subtasks.find(".kanban-card").length) {
					placeholder.insertBefore(
						subtasks.find(".kanban-card").eq(i)
					);
				} else {
					placeholder.appendTo(subtasks);
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
				placeholder.remove();
				oldSpot = -1;
			}
		}
		function drop(event: DragEvent) {
			event.preventDefault();
			const subtaskData = event.dataTransfer?.getData("text/json");
			if (!subtaskData) return;
	
			const { id } = JSON.parse(subtaskData);
			if (!id) return;
	
			placeholder.replaceWith($(`[data-id='${id}']`));
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
}

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


