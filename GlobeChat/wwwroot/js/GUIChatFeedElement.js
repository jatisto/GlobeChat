"use strict";
class GUIChatFeedElement extends GUIElement {
    constructor(parent, message) {
        super(parent);
        this.isRenderable = true;
        this.message = message;
        this.Render();
        this.isVisible = true;
    }
    Render() {
        var element = $(`<li class="list-group-item">
                            ${this.message}
                        </li>`);
        this.parent.append(element);
    }
    Remove() {
    }
}
