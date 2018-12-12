class GUIUserListElement extends GUIElement implements GUIRenderable {
    constructor(parent: JQuery<HTMLElement>, User:User, css?:string) {
        super(parent);
        this.User = User;
        this.selector = $(`<li class="list-group-item">
                        <img src ="https://place-hold.it/50" class="btn-danger rounded-circle"></img>
                        ${this.User.login}
                        <span class="badge">
                            ${this.User.gender}, ${this.User.age}
                        </span> </li>`);
        if (css != null) this.selector.addClass(css);
    }
    Render(): void {                
        this.parent.append(this.selector)
        this.isVisible = true;        
    }
    Remove(): void {
        this.selector.remove();
    }
    Hide(): void {
        this.selector.hide();
        this.isVisible = false;
    }
    User: User;
    isVisible: boolean = false;
    readonly isRenderable: boolean = true;
}