class GUIChatFeedElement extends GUIElement implements GUIRenderable {
    constructor(parent: JQuery<HTMLElement>, message:string) {
        super(parent);
        this.message = message;
        this.Render();
        this.isVisible = true;
    }
    Render(): void {      
        var element = $(`<li class="list-group-item">
                            ${this.message}
                        </li>`);
        this.parent.append(element)
    }
    Remove(): void {
       
    }
    message: string;
    isVisible: boolean;
    readonly isRenderable: boolean = true;
}