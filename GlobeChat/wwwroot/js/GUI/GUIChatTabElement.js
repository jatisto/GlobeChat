"use strict";
class GUIChatTabElement extends GUIElement {
    constructor(parent, login, hash, Action, css) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.name = name;
        this.selector = $(`<li class="nav-item nav-link chat-tab ${css}"> ${login} </li>`);
        this.selector.click(Action);
        this.acceptButton = new GUIButton(this.selector, "", () => {
            acceptInvitation(hash);
            this.closeButton.Render();
            this.acceptButton.Remove();
            this.rejectButton.Remove();
        }, "conversation-accept-button rounded-circle", "fa fa-plus");
        this.rejectButton = new GUIButton(this.selector, "", () => {
            rejectInvitation(hash);
            this.selector.remove();
        }, "conversation-reject-button rounded-circle", "fa fa-close");
        this.closeButton = new GUIButton(this.selector, "", () => {
            if (activeConversation == hash) {
                backButton.Hide();
                pvt = false;
                feedContainer.empty().append(conversations[currentChannelName].get());
            }
            endConversation(hash, login);
            delete conversations[hash];
            this.Remove();
        }, "conversation-close-button rounded-circle", "fa fa-close");
        this.acceptButton.Render();
        this.rejectButton.Render();
    }
    Render() {
        this.parent.append(this.selector);
        this.isVisible = true;
    }
    Remove() {
        this.selector.remove();
    }
    Hide() {
        this.selector.hide();
        this.isVisible = false;
    }
}
