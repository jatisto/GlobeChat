class GUIChatTabElement extends GUIElement implements GUIRenderable {
    constructor(parent: JQuery<HTMLElement>, login: string, hash: string, Action: () => void, css?: string) {
        super(parent);
        this.name = name;
        this.selector = $(`<li class="nav-item nav-link chat-tab ${css}"> <img src="${localStorage.getItem(login)}" class="feed-top-avatar rounded-circle"/> ${login} </li>`);
        this.selector.click(Action);        
        this.acceptButton = new GUIButton(this.selector, "", () => {
            acceptInvitation(hash);
            this.closeButton.Render();
            this.acceptButton.Remove();
            this.rejectButton.Remove();
        }, "conversation-accept-button rounded-circle", "fa fa-plus" );      
        
        this.rejectButton = new GUIButton(this.selector, "", () => {  
            rejectInvitation(hash);
            this.selector.remove();
        }, "conversation-reject-button rounded-circle", "fa fa-close");

        this.closeButton = new GUIButton(this.selector, "", () => {
            if (activeConversation == hash) {
                backButton.Hide();
                pvt = false;
                feedContainer.empty().append(conversations[currentChannelName].get());
                feedTop.html(currentChannelName);
                avatarTop.hide();
            }
            endConversation(hash, login);            
            delete conversations[hash];
            this.Remove();
        }, "conversation-close-button rounded-circle", "fa fa-close"); 
       
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
    Hide(): void {
        this.selector.hide();
        this.isVisible = false;
    }
    name: string;
    isVisible: boolean = false;
    readonly isRenderable: boolean = true;
   
    acceptButton: GUIButton;
    rejectButton: GUIButton;
    closeButton: GUIButton;
}