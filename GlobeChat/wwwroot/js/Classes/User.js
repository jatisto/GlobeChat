"use strict";
class User {
    constructor(Login, Age, Gender) {
        this.isVisible = false;
        this.invited = false;
        this.isRenderable = true;
        this.login = Login;
        this.age = Age;
        this.gender = Gender;
    }
    Render() {
        this.element.Render();
    }
    Remove() {
        this.element.selector.remove();
    }
    Hide() {
        this.element.selector.hide();
        this.isVisible = false;
    }
    updateAvatar() {
        this.element.selector.find("img").css("background-color", "red");
    }
}
