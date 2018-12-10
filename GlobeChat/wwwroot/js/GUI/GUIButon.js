"use strict";
class GUIButton extends GUIElement {
    constructor(parent, Text, Action) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.Text = Text;
        this.Action = Action;
        this.selector = $(`<button class="btn btn-success"> ${this.Text} </button>`);
        this.selector.click(() => this.Action());
    }
    Render() {
        this.parent.append(this.selector);
        this.isVisible = true;
    }
    Remove() {
        this.selector.remove();
    }
}
