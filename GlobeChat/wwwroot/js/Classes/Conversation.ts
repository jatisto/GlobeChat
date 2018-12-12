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
    add(element: GUIChatFeedElement) {
        var el = $(`<li class="list-group-item">
                            <span class="badge badge-secondary">${element.login}</span> <span>${element.message} </span>
                        </li>`);
        this.selector.append(el);
        this.feed.push(element);
    }
    public get() :JQuery<HTMLElement> {   
        return this.selector;
    }
}