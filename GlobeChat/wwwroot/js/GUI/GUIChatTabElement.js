"use strict";
class GUIChatTabElement extends GUIElement {
    constructor(parent, string) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.User = User;
        this.selector = $(`<li class="nav-item nav-link channel-tab"> ${this.name} </li>`);
        this.selector.click(() => { loadConversation(this.User.login); currentChannelName = this.User.login; });
    }
    Render() {
        this.parent.append(this.selector);
        this.isVisible = true;
    }
    Remove() {
        this.selector.remove();
    }
}
