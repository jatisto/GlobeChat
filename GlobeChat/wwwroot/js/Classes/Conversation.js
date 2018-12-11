"use strict";
class Conversation {
    constructor(hash) {
        this.feed = new Array();
        this.hash = hash;
    }
    add(message) {
        this.feed.push(message);
    }
    load() {
        feedList.html('');
        this.feed.forEach(m => {
            var el = $(`<li class="list-group-item">
                            <span class="badge badge-secondary">${m.login}</span> <span>${m.message} </span>
                        </li>`);
            feedList.append(el);
        });
    }
}
