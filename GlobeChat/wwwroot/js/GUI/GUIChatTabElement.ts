class GUIChatTabElement extends GUIElement implements GUIRenderable {
    constructor(parent: JQuery<HTMLElement>, name:string) {
        super(parent);
        this.name = name;
        this.selector = $(`<li class="nav-item nav-link channel-tab"> ${this.name} </li>`);
        //this.selector.click(() => { loadConversation(this.name); currentChannelName = this.name })
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