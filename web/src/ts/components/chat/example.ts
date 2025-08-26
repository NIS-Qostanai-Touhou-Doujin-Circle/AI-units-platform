import { ChatParams } from "./types";

export function getExampleChatArgs(): ChatParams {
	return {
		messages: [
			{
				id: "1",
				content: [
					{
						type: "text",
						content: "Hello!",
					},
				],
				side: "me",
				wasEdited: false,
				timestamp: new Date(new Date().getTime() - 120000),
			},
			{
				id: "2",
				content: [
					{
						type: "reply",
						content: "Hello!",
					},
					{
						type: "text",
						content: "Hi there!",
					},
					{
						type: "image",
						content: "/static/assets/img/image.png",
					},
				],
				side: "them",
				wasEdited: true,
				timestamp: new Date(),
			},
		],
		me: {
			id: "1",
			name: "You",
			avatarUrl: "https://lorempicsum.photos/100",
		},
		them: {
			id: "2",
			name: "Friend",
			avatarUrl: "https://lorempicsum.photos/100",
		},
		source: "whatsapp",
		inputParams: {
			sendMessage(message) {
				return new Promise((resolve) => {
					setTimeout(() => {
						console.log(`Message sent: ${message}`);
						resolve({ id: Date.now().toString() });
					}, 1000);
				});
			},
		},
	};
}
