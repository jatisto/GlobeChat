"use strict";
class GUIUserListElement extends GUIElement {
    constructor(parent, User) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.User = User;
    }
    Render() {
        var element = $(`<li class="list-group-item">
                        ${this.User.login}
                        <span class="badge">
                            ${this.User.gender}, ${this.User.age}
                        </span> </li>`);
        this.parent.append(element);
        this.selector = element;
        this.isVisible = true;
        element.click(() => alert(this.User.login));
    }
    Remove() {
        this.selector.remove();
    }
}
