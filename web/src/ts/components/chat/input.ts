import $ from "jquery";
import {
	ChatMessage,
	ChatMessageComponent,
	ChatParams,
	InputParams,
} from "./types";
import { createMessageElement } from "./message";

export function createInput(
	root: HTMLElement,
	params: ChatParams,
	addMessage: (message: ChatMessage) => {
		message: ChatMessage;
		element: HTMLElement;
	},
	doneSending: (messageId: string) => void
) {
	if (!params.inputParams)
		throw new Error("Input parameters are not defined");

	const inputElement = document.createElement("div");
	inputElement.classList.add("chat-input");
	inputElement.innerHTML = `
            <textarea placeholder="Type a message..."></textarea>
            <button class='primary icon send'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
            </button>
        `;
	$(inputElement)
		.find("button.send")
		.on("click", async () => {
			const text = $(inputElement).find("textarea").val() as
				| string
				| undefined;
			if (!text || text?.trim() == "") return;
			const { message, element } = addMessage({
				id: Date.now().toString(),
				content: [
					{
						type: "text",
						content: text,
					},
				],
				side: "me",
				wasEdited: false,
				doneSending: false,
				timestamp: new Date(),
			});
			$(root)
				.find(".chat-messages")
				.scrollTop($(root).find(".chat-messages")[0].scrollHeight);

			if (text && params.inputParams) {
				$(inputElement).find("textarea").val("");
				const success = await params.inputParams.sendMessage([
					{
						type: "text",
						content: text,
					},
				]);
				if ("id" in success) {
					message.id = success.id;
					element.dataset.messageId = success.id;
					doneSending(success.id);
				} else {
					$(inputElement).find("textarea").val(text);
				}
			}
		});
	return inputElement;
}
