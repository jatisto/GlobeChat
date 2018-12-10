abstract class GUIElement {
    constructor(parent:JQuery<HTMLElement>) {
        this.parent = parent; 
        this.selector = $();
    }
    parent: JQuery<HTMLElement>    
    selector: JQuery<HTMLElement>;    
}