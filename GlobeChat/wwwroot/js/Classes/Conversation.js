"use strict";
class Conversation {
    constructor(hash) {
        this.unreadmessages = 0;
        this.feed = new Array();
        this.hash = hash;
        this.status = CONVERSATION_STATUS.PENDING;
        this.selector = $(`<ul class="list-group feed-list"></ul>`);
    }
    add(element) {
        var el = $(`<li class="list-group-item">
                            <span class="badge badge-secondary">${element.login}</span> <span>${element.message} </span>
                        </li>`);
        this.selector.append(el);
        this.feed.push(element);
    }
    get() {
        return this.selector;
    }
}
