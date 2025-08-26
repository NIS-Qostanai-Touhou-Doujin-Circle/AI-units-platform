export interface ChatMessage {
	id: string;
	content: ChatMessageComponent[];
	side: "me" | "them";
	wasEdited: boolean;
	doneSending?: boolean;
	timestamp: Date;
}

export interface ChatMessageComponent {
	type: "text" | "reply" | "image";
	content: string;
}

export interface ChatParticipant {
	id: string;
	name: string;
	avatarUrl: string;
}

export interface InputParams {
	sendMessage: (
		message: ChatMessageComponent[]
	) => Promise<{ id: string } | { error: string }>;
}

export interface ChatParams {
	messages: ChatMessage[];
	me: ChatParticipant;
	them: ChatParticipant;
	inputParams?: InputParams;
	source: "whatsapp" | "telegram" | "instagram";
}
