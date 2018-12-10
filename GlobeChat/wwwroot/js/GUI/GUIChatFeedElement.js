"use strict";
class GUIChatFeedElement extends GUIElement {
    constructor(parent, login, message) {
        super(parent);
        this.isRenderable = true;
        this.message = message;
        this.login = login;
        this.Render();
        this.isVisible = true;
    }
    Render() {
        var element = $(`<li class="list-group-item">
                            <span class="badge badge-secondary">${this.login}</span> <span>${this.message} </span>
                        </li>`);
        this.parent.append(element);
    }
    Remove() {
    }
}
