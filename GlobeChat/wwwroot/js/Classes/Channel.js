"use strict";
class Channel {
    constructor(channelName, userCount, id) {
        this.channelName = channelName;
        this.userCount = userCount;
        this.id = id;
    }
    Render() {
        this.element.Render();
    }
    Remove() {
        this.element.Remove();
    }
}
