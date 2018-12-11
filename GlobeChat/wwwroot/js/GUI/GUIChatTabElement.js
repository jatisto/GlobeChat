"use strict";
class GUIChatTabElement extends GUIElement {
    constructor(parent, name) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.name = name;
        this.selector = $(`<li class="nav-item nav-link channel-tab"> ${this.name} </li>`);
        //this.selector.click(() => { loadConversation(this.name); currentChannelName = this.name })
    }
    Render() {
        this.parent.append(this.selector);
        this.isVisible = true;
    }
    Remove() {
        this.selector.remove();
    }
}
