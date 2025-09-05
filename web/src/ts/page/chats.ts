import { Chat } from "../components/chat/chat";
import { getSelectedCompanyId } from "../components/switchers/companySwitcher";
import { ChatPreview, DtoMessage, GetChatMessagesResponse, GetChatResponse, GetChatsResponse } from "../dto/chat";
import $ from 'jquery';
import getTemplate from "../helpers/getTemplate";
import unknownToString from "../helpers/unknownToString";
import { WAZZUP_API_URL } from "../config";
import { getSelectedUserId, getSelectedUserName } from "../components/switchers/userSwitcher";
import { ChatMessage } from "../components/chat/types";

const chatsCont = $('#chats-container');
const chatMsgCont = $('#chat-messages-container');
const previewTmplt = $(getTemplate('chat-preview-template'));

export function initChatsPage() {
    const company = getSelectedCompanyId();
    if (!company) {
        console.warn("No company selected, skipping chats page initialization.");
        return;
    }
    getChatPreviews().then(data => {
        chatsCont.empty();
        if (data.chats.length === 0) {
            chatsCont.append($('<div>No chats available.</div>'));
            return;
        }
        data.chats.forEach(chatPreview => {
            const chatEl = previewTmplt.clone().find('> *').first();
            chatEl.find('.chat-name').text(chatPreview.chat_name);
            chatEl.find('.last-message').text(chatPreview.last_message?.content || '');
            chatEl.find('.last-message-date').text(new Date(chatPreview.last_message_date).toLocaleString());
            chatEl.find('.unread-count').text(chatPreview.unread_count > 0 ? chatPreview.unread_count.toString() : '');
            chatEl.data('chat-id', chatPreview.id);
            chatEl.on('click', chatClickHandler(chatPreview));
            chatsCont.append(chatEl);
        });
    })
}

function chatClickHandler(chatPreview: ChatPreview) {
    return async function(this: HTMLElement, ev: JQuery.ClickEvent) {
        const chatId = $(this).data('chat-id');
        if (!chatId) {
            console.error("Chat ID not found on clicked element.");
            return;
        }
        const chatComponent = new Chat(chatMsgCont.get(0)!, {
            me: {
                name: "Мы",
                id: `${getSelectedUserId()!}`,
                avatarUrl: ''
            },
            them: {
                name: chatPreview.chat_name,
                id: `${chatId}`,
                avatarUrl: ''
            },
            //@ts-ignore
            source: chatPreview.channel_type,
            messages: await getMessagesForChat(chatId),
        });
        toggleChat(true);
    }
}

function toggleChat(show: boolean) {
    if (show) {
        chatsCont.parent().addClass('hidden');
        chatMsgCont.parent().removeClass('hidden');
    } else {
        chatsCont.parent().removeClass('hidden');
        chatMsgCont.parent().addClass('hidden');
    }
}

async function getMessagesForChat(chatId: number): Promise<ChatMessage[]> {
    const response = await fetch(`${WAZZUP_API_URL}/chats/${getSelectedCompanyId()}/${chatId}/${getSelectedUserId()}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch messages for chat ${chatId}: ${response.statusText}`);
    }
    const chat: GetChatResponse = await response.json();
    const messages = chat.messages;
    return messages.map(msg => ({
        id: msg.id,
        senderId: msg.id,
        content: [
            {
                type: 'text',
                content: unknownToString(msg.content)
            }
        ],
        timestamp: new Date(msg.created_at),
        isRead: true,
        side: 'me',
        wasEdited: false,
    }));
}

async function getChatPreviews() : Promise<GetChatsResponse> {
    const response = await fetch(`${WAZZUP_API_URL}/chats/${getSelectedCompanyId()}/${getSelectedUserId()}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch chat previews: ${response.statusText}`);
    }
    return response.json();
}

initChatsPage();