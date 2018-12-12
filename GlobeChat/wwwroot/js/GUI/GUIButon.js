"use strict";
class GUIButton extends GUIElement {
    constructor(parent, Text, Action, css, icon) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.Text = Text;
        this.Action = Action;
        this.selector = $(`<button class="btn">  ${this.Text} </button>`);
        if (icon != null)
            this.selector.prepend(`<i class="${icon}"> </i>`);
        this.selector.click(() => this.Action());
        if (css != null) {
            this.selector.addClass(css);
        }
    }
    Render() {
        this.parent.append(this.selector);
        this.isVisible = true;
    }
    Remove() {
        this.selector.remove();
    }
    Hide() {
        this.selector.hide();
        this.isVisible = false;
    }
}
