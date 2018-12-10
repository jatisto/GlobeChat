"use strict";
class GUIUserListElement extends GUIElement {
    constructor(parent, User) {
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
    }
    Render() {
        this.parent.append(this.selector);
        this.isVisible = true;
    }
    Remove() {
        this.selector.remove();
    }
}
