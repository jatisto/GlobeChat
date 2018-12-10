"use strict";
class GUIChannelListElement extends GUIElement {
    constructor(parent, channel) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.Channel = channel;
        var uc = this.Channel.userCount;
        this.selector = $(`<li class="list-group-item">
                        ${this.Channel.channelName}
                        <span class="badge ${getBadgeColor(uc)}">
                        ${uc} ${uc == 1 ? "user" : "users"}
                        </badge> </li>`);
    }
    Render() {
        this.isVisible = true;
        this.parent.append(this.selector);
    }
    Remove() {
        this.selector.remove();
    }
}
