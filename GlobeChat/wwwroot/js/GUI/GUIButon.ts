class GUIButton extends GUIElement implements GUIRenderable {
   
    constructor(parent: JQuery<HTMLElement>, Text: string, Action: () => void, css?:string, icon?:string) {
        super(parent);
        this.Text = Text;
        this.Action = Action;        
        this.selector = $(`<button class="btn">  ${this.Text} </button>`); 
        if (icon != null) this.selector.prepend(`<i class="${icon}"> </i>`);
        this.selector.click(() => this.Action());   
        if (css != null) {
            this.selector.addClass(css);
        }
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
    Text: string;
    Action: () => void;
    isVisible: boolean = false;
    readonly isRenderable: boolean = true;
}