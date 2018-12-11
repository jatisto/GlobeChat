class Conversation {
    constructor(hash: string) {       
        this.hash = hash;
        this.status = CONVERSATION_STATUS.PENDING;
        this.selector = $(`<ul class="list-group feed-list"></ul>`);
    }

    hash: string;
    selector: JQuery<HTMLElement>;
    status: CONVERSATION_STATUS;
    unreadmessages: number = 0;
    feed: GUIChatFeedElement[] = new Array();
    add(message: GUIChatFeedElement) {
        this.feed.push(message);
        
    }
    public load() {
        feedList.html('');
        pvt = true;
        activeConversation = this.hash;
        this.feed.forEach(m => {
            var el = $(`<li class="list-group-item">
                            <span class="badge badge-secondary">${m.login}</span> <span>${m.message} </span>
                        </li>`);
            feedList.append(el);
        });
    }
}