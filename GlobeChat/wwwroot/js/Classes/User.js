"use strict";
class User {
    constructor(Login, Age, Gender) {
        this.isVisible = false;
        this.isRenderable = true;
        this.login = Login;
        this.age = Age;
        this.gender = Gender;
    }
    Render() {
        this.element.Render();
    }
    Remove() {
        this.element.Remove();
    }
}
