import { Chat } from "../components/chat/chat";
import { getSelectedCompanyId } from "../components/switchers/companySwitcher";
import { GetChatsResponse } from "../dto/chat";
import $ from 'jquery';
import getTemplate from "../helpers/getTemplate";
import unknownToString from "../helpers/unknownToString";
import { WAZZUP_API_URL } from "../config";
import { getSelectedUserId } from "../components/switchers/userSwitcher";

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
        data.chats.forEach(chatPreview => {
            const chatEl = previewTmplt.clone().find('> *').first();
            chatEl.find('.chat-name').text(chatPreview.chat_name);
            chatEl.find('.last-message').text(chatPreview.last_message?.content || '');
            chatEl.find('.last-message-date').text(new Date(chatPreview.last_message_date).toLocaleString());
            chatEl.find('.unread-count').text(chatPreview.unread_count > 0 ? chatPreview.unread_count.toString() : '');
            chatEl.data('chat-id', chatPreview.id);
            chatsCont.append(chatEl);
        });
    })
}



async function getChatPreviews() : Promise<GetChatsResponse> {
    const response = await fetch(`${WAZZUP_API_URL}/chats/${getSelectedCompanyId()}/${getSelectedUserId()}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch chat previews: ${response.statusText}`);
    }
    return response.json();
}

initChatsPage();