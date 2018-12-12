"use strict";
class GUIChannelListElement extends GUIElement {
    constructor(parent, channel, css) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.Channel = channel;
        var uc = this.Channel.userCount;
        this.selector = $(`<li class="list-group-item channel-list-item">
                        ${this.Channel.channelName}
                        <span class="badge ${getBadgeColor(uc)} channel-badge">
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
    Hide() {
        this.selector.hide();
        this.isVisible = false;
    }
}
