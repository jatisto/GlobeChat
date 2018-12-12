class GUIChatFeedElement extends GUIElement implements GUIRenderable {
    constructor(parent: JQuery<HTMLElement>, login: string, message: string, css?: string) {
        super(parent);
        this.message = message;
        this.login = login;
        this.Render();
        this.isVisible = true;
    }
    Render(): void {      
        var element = $(`<li class="list-group-item">
                            <span class="badge badge-secondary">${this.login}</span> <span>${this.message} </span>
                        </li>`);
        this.parent.append(element)
    }
    Remove(): void {     
        this.selector.remove();
    }
    Hide(): void {
        this.selector.hide();
        this.isVisible = false;
    }
    login: string;
    message: string;
    isVisible: boolean;
    readonly isRenderable: boolean = true;

}