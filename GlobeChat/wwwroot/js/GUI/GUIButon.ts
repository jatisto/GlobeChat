class GUIButton extends GUIElement implements GUIRenderable {
    constructor(parent: JQuery<HTMLElement>, Text: string, Action: () => void) {
        super(parent);
        this.Text = Text;
        this.Action = Action;        
        this.selector = $(`<button class="btn btn-success"> ${this.Text} </button>`); 
        this.selector.click(() => this.Action());   
    }
    Render(): void {                   
        this.parent.append(this.selector)
        this.isVisible = true;
             
    }
    Remove(): void {
        this.selector.remove();
    }
    Text: string;
    Action: () => void;
    isVisible: boolean = false;
    readonly isRenderable: boolean = true;
}