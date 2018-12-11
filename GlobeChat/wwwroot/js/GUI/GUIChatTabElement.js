"use strict";
class GUIChatTabElement extends GUIElement {
    constructor(parent, login, hash) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.name = name;
        this.selector = $(`<li class="nav-item nav-link channel-tab"> ${login} </li>`);
        this.selector.click(function () {
            tabs[hash].removeClass("glow-unread");
            if (conversations[hash].status == CONVERSATION_STATUS.ACCEPTED ||
                conversations[hash].status == CONVERSATION_STATUS.REJECTED)
                conversations[hash].load();
        });
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
    Render() {
        this.parent.append(this.selector);
        this.isVisible = true;
    }
    Remove() {
        this.selector.remove();
    }
}
