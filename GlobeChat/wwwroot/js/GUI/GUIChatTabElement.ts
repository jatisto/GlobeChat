class GUIChatTabElement extends GUIElement implements GUIRenderable {
    constructor(parent: JQuery<HTMLElement>, string:name) {
        super(parent);
        this.User = User;
        this.selector = $(`<li class="nav-item nav-link channel-tab"> ${this.name} </li>`);
        this.selector.click(() => { loadConversation(this.User.login); currentChannelName = this.User.login })
    }
    Render(): void {                
        this.parent.append(this.selector)
        this.isVisible = true;        
    }
    Remove(): void {
        this.selector.remove();
    }
    name: string;
    isVisible: boolean = false;
    readonly isRenderable: boolean = true;
}