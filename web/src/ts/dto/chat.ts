export type GetChatsResponse = {
    chats: ChatPreview[];
    total: number;
}

export type ChatPreview = {
    channel_id: string;
    channel_type: string;
    chat_name: string;
    id: string;
    last_message: DtoMessage | null;
    last_message_date: string;
    responsible_user: unknown | null;
    unread_count: number;
}

export type GetChatResponse = {
    channel_id: string; 
    channel_type: string;
    id: string;
    messages: DtoMessage[];
    messages_count: number;
}

export type GetChatMessagesResponse = DtoMessage[];

export type DtoMessage = {
    content: string,
    created_at: string,
    id: string,
    is_inbound: boolean,
}

export type DtoMessageComponent = {
    content: string;
    type: 'text' | 'image' | 'reply';
}
