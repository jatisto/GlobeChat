"use strict";
class GUIUserListElement extends GUIElement {
    constructor(parent, User, css) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.User = User;
        var iconClass = (this.User.gender == "MALE") ? "fa fa-male fa-2x male-blue" : "fa fa-female fa-2x female-pink";
        this.selector = $(`<li class="list-group-item user-item">
                        <img src ="https://place-hold.it/50" class="btn-danger rounded-circle"></img>
                        ${this.User.login}
                        <span class="user-details-badge">
                        <i class = "${iconClass} gender-icon"/>   ${this.User.age}
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
