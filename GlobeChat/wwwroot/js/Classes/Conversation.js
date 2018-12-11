"use strict";
class Conversation {
    constructor(hash) {
        this.unreadmessages = 0;
        this.feed = new Array();
        this.hash = hash;
        this.status = CONVERSATION_STATUS.PENDING;
        this.selector = $(`<ul class="list-group feed-list"></ul>`);
    }
    add(message) {
        this.feed.push(message);
    }
    load() {
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
