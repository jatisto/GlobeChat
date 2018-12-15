"use strict";
class GUIButton extends GUIElement {
    constructor(parent, Text, Action, css, icon) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.Text = Text;
        this.Action = Action;
        this.selector = $(`<button class="btn">  ${this.Text} </button>`);
        if (icon != null)
            this.selector.prepend(`<i class="${icon}"> </i>`);
        this.selector.click(() => this.Action());
        if (css != null) {
            this.selector.addClass(css);
        }
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

"use strict";
class GUIChannelListElement extends GUIElement {
    constructor(parent, channel, css) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.Channel = channel;
        var uc = this.Channel.userCount;
        this.selector = $(`<li class="list-group-item channel-list-item">
                        ${this.Channel.channelName}
                        <span class="badge ${getBadgeColor(uc)} channel-badge">
                        ${uc} ${uc == 1 ? "user" : "users"}
                        </badge> </li>`);
    }
    Render() {
        this.isVisible = true;
        this.parent.append(this.selector);
    }
    Remove() {
        this.selector.remove();
    }
    Hide() {
        this.selector.hide();
        this.isVisible = false;
    }
}

"use strict";
class GUIChatFeedElement extends GUIElement {
    constructor(parent, login, message, css) {
        super(parent);
        this.isRenderable = true;
        this.message = message;
        this.login = login;
        this.Render();
        this.isVisible = true;
    }
    Render() {
        var element = $(`<li class="list-group-item ${username == this.login ? "feed-user-message" : "feed-message"}">
                           <span class="message-time">${new Date().toLocaleString().split(',')[1]}</span> 
                           <span class="badge badge-secondary">${this.login}</span> <span>${this.message} </span>
                        </li>`);
        this.parent.append(element);
    }
    Remove() {
        this.selector.remove();
    }
    Hide() {
        this.selector.hide();
        this.isVisible = false;
    }
}

"use strict";
class GUIChatTabElement extends GUIElement {
    constructor(parent, login, hash, Action, css) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        this.name = name;
        this.selector = $(`<li class="nav-item nav-link chat-tab ${css}"> <img src="${localStorage.getItem(login)}" class="feed-top-avatar rounded-circle"/> ${login} </li>`);
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

"use strict";
class GUIElement {
    constructor(parent) {
        this.parent = parent;
        this.selector = $();
    }
}

"use strict";

"use strict";
class GUIUserListElement extends GUIElement {
    constructor(parent, User, css) {
        super(parent);
        this.isVisible = false;
        this.isRenderable = true;
        var user_img;
        this.User = User;
        var iconClass = (this.User.gender == "MALE") ? "fa fa-male fa-2x male-blue" : "fa fa-female fa-2x female-pink";
        if (localStorage.getItem(this.User.login) === null) {
            user_img = (this.User.gender == "MALE") ? user_male : user_female;
        }
        else
            user_img = localStorage.getItem(this.User.login);
        this.selector = $(`<li class="list-group-item user-item">
                        <img src ="${user_img}" width="60px" height="60px" class="user-list-avatar rounded-circle"></img>
                        ${this.User.login}
                        <span class="user-details-badge">
                        <i class = "${iconClass} gender-icon"/>   ${this.User.age}
                        </span> </li>`);
        if (css != null)
            this.selector.addClass(css);
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