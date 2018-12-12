"use strict";
class GUIChatFeedElement extends GUIElement {
    constructor(parent, login, message, css) {
        super(parent);
        this.isRenderable = true;
        this.message = message;
        this.login = login;
        this.Render();
        this.isVisible = true;
    }
    Render() {
        var element = $(`<li class="list-group-item ${username == this.login ? "feed-user-message" : "feed-message"}">
                           <span class="message-time">${new Date().toLocaleString().split(',')[1]}</span> <span class="badge badge-secondary">${this.login}</span> <span>${this.message} </span>
                        </li>`);
        this.parent.append(element);
    }
    Remove() {
        this.selector.remove();
    }
    Hide() {
        this.selector.hide();
        this.isVisible = false;
    }
}
