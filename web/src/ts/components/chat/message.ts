import { ChatMessage, ChatMessageComponent, ChatParams } from "./types";

export function extractSender(params: ChatParams, msg: ChatMessage) {
	return msg.side === "me" ? params.me : params.them;
}

export function createMessageElement(params: ChatParams, message: ChatMessage) {
	const msgEl = document.createElement("div");
	msgEl.classList.add("chat-message");
	msgEl.classList.add(`chat-message-${message.side}`);
	if (message.doneSending === false)
		msgEl.classList.add("chat-message-sending");
	msgEl.dataset.messageId = message.id;
	msgEl.innerHTML = `
            <cite>${extractSender(params, message).name}</cite>
            <div class="chat-message-content">
                ${message.content
					.map((comp) => {
						if (comp.type === "text") {
							return `<p>${comp.content}</p>`;
						} else if (comp.type === "reply") {
							return `<blockquote>${comp.content}</blockquote>`;
						} else if (comp.type === "image") {
							return `<img src="${comp.content}" alt="Image" />`;
						}
					})
					.join("")}
            </div>
        `;
	return msgEl;
}
