"use strict";
class GUIUserListElement extends GUIElement {
    constructor(parent, User, css) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.User = User;
        this.selector = $(`<li class="list-group-item">
                        <img src ="https://place-hold.it/50" class="btn-danger rounded-circle"></img>
                        ${this.User.login}
                        <span class="badge">
                            ${this.User.gender}, ${this.User.age}
                        </span> </li>`);
        if (css != null)
            this.selector.addClass(css);
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
