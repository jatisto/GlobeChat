"use strict";
class GUIUserListElement extends GUIElement {
    constructor(parent, User, css) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        var user_img;
        this.User = User;
        var iconClass = (this.User.gender == "MALE") ? "fa fa-male fa-2x male-blue" : "fa fa-female fa-2x female-pink";
        if (localStorage.getItem(this.User.login) === null) {
            user_img = (this.User.gender == "MALE") ? user_male : user_female;
        }
        else
            user_img = localStorage.getItem(this.User.login);
        this.selector = $(`<li class="list-group-item user-item">
                        <img src ="${user_img}" width="60px" height="60px" class=" rounded-circle"></img>
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
