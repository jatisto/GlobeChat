class GUIUserListElement extends GUIElement implements GUIRenderable {
    constructor(parent: JQuery<HTMLElement>, User:User) {
        super(parent);
        this.User = User;
    }
    Render(): void {        
        var element = $(`<li class="list-group-item">
                        ${this.User.login}
                        <span class="badge">
                            ${this.User.gender}, ${this.User.age}
                        </span> </li>`);          
        this.parent.append(element)
        this.selector = element;
        this.isVisible = true;
        element.click(()=>alert(this.User.login));
    }
    Remove(): void {
        this.selector.remove();
    }
    User: User;
    isVisible: boolean = false;
    readonly isRenderable: boolean = true;
}