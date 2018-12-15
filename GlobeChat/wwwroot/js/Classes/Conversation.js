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
        console.log(this.feed.length);
        var split = false;
        if (this.feed.length > 0) {
            if (this.feed[this.feed.length - 1].login == element.login) {
                this.feed[this.feed.length - 1].message += ("<br/>" + element.message);
                this.selector.find(".message-text").last().append("<br/>" + element.message);
                split = true;
            }
        }
        if (split == false) {
            var el = $(`<li class="list-group-item ${username == element.login ? "feed-user-message" : "feed-message"} ">
                        <span class="badge badge-secondary user-login-badge">${element.login}</span>
                        <span class="badge message-time"> @ ${new Date().toLocaleString().split(',')[1]}</span>
                        <span class = "message-text"> <img src="${localStorage.getItem(element.login)}" class="feed-avatar" /> ${element.message} </span>
                        </li>`);
            this.selector.append(el);
            this.feed.push(element);
        }
    }
    get() {
        return this.selector;
    }
}
