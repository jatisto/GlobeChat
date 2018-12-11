class GUIChatTabElement extends GUIElement implements GUIRenderable {
    constructor(parent: JQuery<HTMLElement>, login:string,  hash:string) {
        super(parent);
        this.name = name;
        this.selector = $(`<li class="nav-item nav-link channel-tab"> ${login} </li>`);

        this.selector.click(function () {
            tabs[hash].removeClass("glow-unread");
            if (conversations[hash].status == CONVERSATION_STATUS.ACCEPTED ||
                conversations[hash].status == CONVERSATION_STATUS.REJECTED)
                conversations[hash].load()
        })
        this.acceptButton = new GUIButton(this.selector, "Accept", () => {
            acceptInvitation(hash);
            this.closeButton.Render();
            this.acceptButton.Remove();
            this.rejectButton.Remove();
        });       
        this.rejectButton = new GUIButton(this.selector, "Reject", () => {
            rejectInvitation(hash);
            this.selector.remove();
        });
        this.closeButton = new GUIButton(this.selector, "X", () => {            
            endConversation(hash, login);
            delete conversations[hash];
            this.selector.remove();
        });
        this.acceptButton.Render();
        this.rejectButton.Render();
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

    acceptButton: GUIButton;
    rejectButton: GUIButton;
    closeButton: GUIButton;
}