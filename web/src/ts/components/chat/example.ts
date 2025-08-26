import { ChatParams } from "./types";

export function getExampleChatArgs(): ChatParams {
	return {
		messages: [
			{
				id: "1",
				content: [
					{
						type: "text",
						content: "Здрастуте!",
					},
				],
				side: "them",
				wasEdited: false,
				timestamp: new Date(new Date().getTime() - 220000),
			},
			{
				id: "2",
				content: [
					{
						type: "reply",
						content: "Здрастуте!",
					},
					{
						type: "text",
						content:
							"Здравстуйте! Меня зовут Самат С.С. Чем могу помочь?",
					},
					{
						type: "image",
						content: "/static/assets/img/image.png",
					},
				],
				side: "me",
				wasEdited: true,
				timestamp: new Date(new Date().getTime() - 120000),
			},
			{
				id: "3",
				content: [
					{
						type: "text",
						content: "Можете ответить на вопрос?",
					},
				],
				side: "them",
				wasEdited: false,
				timestamp: new Date(new Date().getTime() - 60000),
			},
			{
				id: "4",
				content: [
					{
						type: "text",
						content:
							"Конечно могу! В чём заключается Ваш вопрос? Смартфон Vivo.",
					},
				],
				side: "me",
				wasEdited: false,
				timestamp: new Date(new Date().getTime() - 30000),
			},
			{
				id: "5",
				content: [
                    {
                        type: "reply",
                        content: "Конечно могу! В чём заключается Ваш вопрос? Смартфон Vivo."
                    },
					{
						type: "text",
						content: "Есть два стула. На одном пики точенные, на другом",
					},
				],
				side: "them",
				wasEdited: false,
				timestamp: new Date(new Date().getTime() - 15000),
			},
		],
		me: {
			id: "1",
			name: "Samat S.S.",
			avatarUrl: "https://lorempicsum.photos/100",
		},
		them: {
			id: "2",
			name: "Client",
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
