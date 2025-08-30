import $ from "jquery";
import { Task, Project } from "./types";
import { getMockProject } from "./example";
import getTemplate from "../../helpers/getTemplate";

//#region DOM
const kanbanContainer = $('#kanban-container');
const kanbanColumnTemplate = getTemplate('kanban-column-template');
const kanbanSubtaskTemplate = getTemplate('kanban-subtask-template');
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
        const column = $(kanbanColumnTemplate!).clone().find('> div');
        column.find('.kanban-status-name').text(translateStatus(status));
        column.get(0)!.addEventListener('dragenter', dragEnterColumn);
        column.get(0)!.addEventListener('dragleave', dragLeaveColumn);
        column.get(0)!.addEventListener('dragover', dragOverColumn);
        column.get(0)!.addEventListener('drop', dropToColumn);
        
        const subtaskList = column.find('.kanban-column-subtasks');
        for (const subtask of subtasks) {
            const subtaskItem = $(kanbanSubtaskTemplate!).clone().find('> div');
            subtaskItem.find('.subtask-name').text(subtask.name);
            subtaskItem.attr('data-id', subtask.id.toString());
            subtaskItem.get(0)!.addEventListener('dragstart', onGrabSubtask);
            subtaskList.append(subtaskItem);
        }
        kanbanContainer.append(column);
    }
}


function onGrabSubtask(event: DragEvent) {
    const subtaskItem = $(event.currentTarget!).closest('.kanban-card');

    if (!event.dataTransfer) return;

    event.dataTransfer.setData('text/json', JSON.stringify({ id: subtaskItem.attr('data-id') }));
    event.dataTransfer.setDragImage(subtaskItem[0], 10, 10);
}

function dragOverColumn(event: DragEvent) {
    event.preventDefault();
}

function dragEnterColumn(event: DragEvent) {
    if (!event.dataTransfer) return;

    const subtaskData = event.dataTransfer.getData('text/json');
    if (!subtaskData) return;

    const { id } = JSON.parse(subtaskData);
    if (!id) return;

    const column = $(event.currentTarget!).closest('.kanban-column');

    column.data('drag-counter', (column.data('drag-counter') || 0) + 1);
    column.addClass('bg-primary-200');
}

function dragLeaveColumn(event: DragEvent) {
    const column = $(event.currentTarget!).closest('.kanban-column');

    column.data('drag-counter', (column.data('drag-counter') || 0) - 1);

    if (+column.data('drag-counter') === 0) {
        column.removeClass('bg-primary-200');
    }
}

function dropToColumn(event: DragEvent) {
    event.preventDefault();
    const column = $(event.currentTarget!).closest('.kanban-column');

    const subtaskData = event.dataTransfer?.getData('text/json');
    if (!subtaskData) return;

    const { id } = JSON.parse(subtaskData);
    if (!id) return;

    column.data('drag-counter', 0);
    column.removeClass('bg-primary-200');

    // Find the subtask element and move it to the new column
    const subtaskElement = $(`.kanban-card[data-id="${id}"]`);
    if (subtaskElement.length) {
        column.find('.kanban-column-subtasks').append(subtaskElement);
    }
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