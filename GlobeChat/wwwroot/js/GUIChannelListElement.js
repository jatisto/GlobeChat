"use strict";
class GUIChannelListElement extends GUIElement {
    constructor(parent, channel) {
        super(parent);
        this.isRenderable = true;
        this.Channel = channel;
        this.Render();
        this.isVisible = true;
    }
    Render() {
        var uc = this.Channel.userCount;
        var element = $(`<li class="list-group-item">
                        ${this.Channel.channelName}
                        <span class="badge ${getBadgeColor(uc)}">
                        ${uc} ${uc == 1 ? "user" : "users"}
                        </badge> </li>`);
        var joinButton = $(`<button class="btn btn-success float-right">
                                Join
                             </button>`);
        this.selector = element;
        element.append(joinButton);
        joinButton.click(() => {
            joinChannel(this.Channel.id);
        });
        this.parent.append(element);
    }
    Remove() {
        this.selector.remove();
    }
}
