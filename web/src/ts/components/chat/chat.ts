export interface ChatMessage {
	id: string;
	content: ChatMessageComponent[];
    side: 'me' | 'them';
    wasEdited: boolean;
    doneSending?: boolean;
	timestamp: Date;
}

export interface ChatMessageComponent {
    type: 'text' | 'reply' | 'image';
    /**
     * Represents the text for `text` and `reply` types.
     * Represents the url to the image for `image` type.
     */
    content: string;
}

export interface ChatParticipant {
    id: string;
    name: string;
    avatarUrl: string;
}

export interface ChatParams {
    messages: ChatMessage[];
    me: ChatParticipant;
    them: ChatParticipant;
    /**
     * If undefined, assumes no input capability
     */
    inputParams? : InputParams,
    source: 'whatsapp' | 'telegram' | 'instagram';
}

export interface InputParams {
    sendMessage: (message: string) => Promise<boolean>;
}

export class Chat {
    params: ChatParams;
    element: HTMLElement;

    constructor(element: HTMLElement, args: ChatParams) {
        this.params = {...args};
        this.element = element;

        this.render();
    }

    render() {
        if (!this.element) return;

        this.element.classList = 'chat';
        this.element.innerHTML = '';
        this.params.messages.forEach(message => {
            this.element.appendChild(this._createMessageElement(message));
        });

        if (this.params.inputParams) {
            this.element.appendChild(this._createInput());
        }
    }

    _createMessageElement(message: ChatMessage) {
        const msgEl = document.createElement('div');
        msgEl.classList.add('chat-message');
        msgEl.classList.add(`chat-message-${message.side}`);
        if (message.doneSending === false) msgEl.classList.add('chat-message-sending');
        msgEl.dataset.messageId = message.id;
        msgEl.innerHTML = `
            <div class="chat-message-content">
                ${message.content.map(comp => {
                    if (comp.type === 'text') {
                        return `<p>${comp.content}</p>`;
                    } else if (comp.type === 'reply') {
                        return `<blockquote>${comp.content}</blockquote>`;
                    } else if (comp.type === 'image') {
                        return `<img src="${comp.content}" alt="Image" />`;
                    }
                }).join('')}
            </div>
        `;
        return msgEl;
    }

    _createInput() {
        if (!this.params.inputParams) throw new Error('Input parameters are not defined');

        const inputElement = document.createElement('div');
        inputElement.classList.add('chat-input');
        inputElement.innerHTML = /*html*/`
            <textarea placeholder="Type a message..."></textarea>
            <button class='primary send'>Send</button>
        `;
        $(inputElement).find('button.send').on('click', async () => {
            const message = $(inputElement).find('textarea').val();
            if (!message || message?.trim() == '') return;
            this.addMessage({
                id: Date.now().toString(),
                content: [{
                    type: 'text',
                    content: message
                }],
                side: 'me',
                wasEdited: false,
                timestamp: new Date()
            })
            if (message && this.params.inputParams) {
                const success = await this.params.inputParams.sendMessage(message);
                if (success) {
                    $(inputElement).find('textarea').val('');
                }
            }
        });
        return inputElement;
    }

    addMessage(message: ChatMessage) {
        this.params.messages.push(message);
        this.element.appendChild(this._createMessageElement(message));
    }

    editMessage(messageId: string, newContent: ChatMessageComponent[]) {
        const message = this.params.messages.find(m => m.id === messageId);
        if (message) {
            message.content = newContent;
            message.wasEdited = true;
            $(this.element).find(`[data-message-id="${messageId}"]`).replaceWith(this._createMessageElement(message));
        }
    }

}

export function getExampleChatArgs() : ChatParams {
    return {
        messages: [{
            id: '1',
            content: [{
                type: 'text',
                content: 'Hello!'
            }],
            side: 'me',
            wasEdited: false,
            timestamp: new Date(new Date().getTime() - 120000)
        }, {
            id: '2',
            content: [{
                type: 'reply',
                content: 'Hello!'
            },{
                type: 'text',
                content: 'Hi there!'
            }],
            side: 'them',
            wasEdited: true,
            timestamp: new Date()
        }],
        me: {
            id: '1',
            name: 'You',
            avatarUrl: 'https://example.com/your-avatar.png'
        },
        them: {
            id: '2',
            name: 'Friend',
            avatarUrl: 'https://example.com/friend-avatar.png'
        },
        source: 'whatsapp',
        inputParams: {
            sendMessage(message) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        console.log(`Message sent: ${message}`);
                        resolve(true);
                    }, 1000);
                });
            },
        }
    };
}