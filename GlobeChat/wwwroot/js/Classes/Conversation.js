"use strict";
class Conversation {
    constructor(name, status) {
        this.feed = new Array();
        this.name = name;
        this.status = status;
    }
    get() {
        this.feed.forEach(e => {
            this.body.html('');
            this.body.append(e.selector);
        });
        return this.body;
    }
    add(element) {
        this.feed.push(element);
    }
}
