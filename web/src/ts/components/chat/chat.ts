import $ from "jquery";
import { ChatMessage, ChatMessageComponent, ChatParams } from "./types";
import { createMessageElement } from "./message";
import { createInput } from "./input";

export class Chat {
	params: ChatParams;
	element: HTMLElement;

	constructor(element: HTMLElement, args: ChatParams) {
		this.params = { ...args };
		this.element = element;

		this.render();
	}

	render() {
		if (!this.element) return;

		const el = $(this.element);

		el.addClass("chat");
		el.empty();
		el.append('<div class="chat-messages"></div>');

		this.params.messages.forEach((message) => {
			el.find(".chat-messages").append(
				createMessageElement(this.params, message)
			);
		});

		if (this.params.inputParams) {
			el.append(
				createInput(
					this.element,
					this.params,
					(message) => this.addMessage(message),
					(id) => this.doneSending(id)
				)
			);
		}
	}

	getMessageEl(messageId: string): HTMLElement | null {
		return (
			$(this.element).find(`[data-message-id="${messageId}"]`).get(0) ||
			null
		);
	}

	addMessage(message: ChatMessage): {
		message: ChatMessage;
		element: HTMLElement;
	} {
		this.params.messages.push(message);
		const el = createMessageElement(this.params, message);
		$(this.element).find(".chat-message").last().after(el);
		return { message, element: el };
	}

	doneSending(messageId: string) {
		const message = this.params.messages.find((m) => m.id === messageId);
		if (message) {
			message.doneSending = true;
			$(this.element)
				.find(`[data-message-id="${messageId}"]`)
				.removeClass("chat-message-sending");
		} else {
			console.warn(`Message with id ${messageId} not found`);
		}
	}

	editMessage(messageId: string, newContent: ChatMessageComponent[]) {
		const message = this.params.messages.find((m) => m.id === messageId);
		if (message) {
			message.content = newContent;
			message.wasEdited = true;
			$(this.element)
				.find(`[data-message-id="${messageId}"]`)
				.replaceWith(createMessageElement(this.params, message));
		}
	}
}

export { getExampleChatArgs } from "./example";
