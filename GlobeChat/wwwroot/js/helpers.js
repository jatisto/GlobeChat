"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function ajaxRequestParams(_type, _url, _params, _callback) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var request = $.ajax({
                type: _type,
                url: _url,
                data: _params,
            });
            request.done(function (res) {
                resolve(res);
            });
            request.fail(function (jqXHR, textStatus) {
                reject(jqXHR);
            });
        });
    });
}
function ajaxRequestParamsJSON(_type, _url, _params, _callback) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var request = $.ajax({
                contentType: "application/json",
                type: _type,
                url: _url,
                data: _params,
            });
            request.done(function (res) {
                resolve(res);
            });
            request.fail(function (jqXHR, textStatus) {
                reject(jqXHR);
            });
        });
    });
}
function loadPartial(partial) {
    overlay.show();
    partial.addClass("fadeInDown animated").show();
}
function joinChannel(channelName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ajaxRequestParams("POST", "api/Channels/" + channelName + "/join", "", null).then((channelName) => {
            loadChannels();
            loadUsers(channelName);
            delete conversations[currentChannelName];
            currentChannelName = channelName;
            feedTop.html(channelName);
            feedContainer.empty();
            conversations[channelName] = new Conversation(channelName);
            feedContainer.append(conversations[currentChannelName].get());
        });
    });
}
function loadChannels() {
    var resp = ajaxRequestParams("POST", "api/getChannels", "", null);
    resp.then(function (response) {
        channels = response;
        channelList.empty();
        channels.forEach((channel) => {
            channel.element = new GUIChannelListElement($(".channel-list"), channel);
            let joinButton = new GUIButton(channel.element.selector, "Join", () => {
                joinChannel(channel.channelName);
            }, "btn join-button", "fa fa-sign-in");
            channel.element.Render();
            joinButton.Render();
            joinButton.selector.addClass("float-right");
        });
    });
}
function loadUsers(channelName) {
    users = [];
    var resp = ajaxRequestParams("POST", "api/Channels/" + channelName + "/users", "", null);
    var resp_avatars = ajaxRequestParams("POST", "api/Channels/" + channelName + "/users/avatars", "", null);
    resp_avatars.then(function (response) {
        let _avatars = response;
        _avatars.forEach((avatar) => {
            localStorage.setItem(avatar.login, avatar.image);
        });
    }).then(() => {
        resp.then(function (response) {
            userList.html('');
            let _users = response;
            _users.sort(function (x, y) {
                return x.login == username ? -1 : y.login == username ? 1 : 0;
            });
            _users.forEach((user) => addUserToChannel(user));
        });
    });
}
function addUserToChannel(user) {
    try {
        console.log("adding user " + user.login);
        if (username != user.login) {
            user.element = new GUIUserListElement(userList, user, "");
            let inviteButton = new GUIButton(user.element.selector, "Invite to conversation", () => {
                conversations[currentChannelName].add(new GUIChatFeedElement($(), "info", "Invitation to " + user.login + " sent. If user accepts your invitation new Conversation Tab will pop."));
                user.invited = true;
                sendInvitation(user.login);
            }, "invite-btn float-right btn-success", "fa fa-comments");
            /* let blockButton = new GUIButton(user.element.selector, "", () => {
            }, "invite-btn float-right btn-danger", "fa fa-close");
            blockButton.Render(); */
            inviteButton.Render();
            users.push(user);
        }
        else {
            user.element = new GUIUserListElement($(".user-list"), user, "current-user");
            let settingsButton = new GUIButton(user.element.selector, "Settings", () => {
                loadPartial(userSettingsModal);
            }, "settings-btn float-right", "fa fa-cogs");
            settingsButton.Render();
        }
        user.element.Render();
    }
    catch (e) {
        console.log(e);
    }
}
function removeUserFromList(login) {
    console.log("removing user from list " + login);
    if (users.length >= 0) {
        try {
            var user = users.filter(e => e.login == login)[0];
            console.log("found : " + user.login + " removing");
            user.element.Remove();
            users = users.filter(u => u.login != u.login);
        }
        catch (e) {
            console.log(e);
        }
    }
}
function getBadgeColor(amount) {
    if (amount > 100)
        return "badge-danger";
    if (amount > 50)
        return "badge-warning";
    if (amount > 25)
        return "badge-success";
    return "badge-secondary";
}
function generateRandomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
function addConversation(login, hash) {
    let tab = new GUIChatTabElement(chatTabs, login, hash, () => {
        if (conversations[hash].status == CONVERSATION_STATUS.ACCEPTED ||
            conversations[hash].status == CONVERSATION_STATUS.REJECTED) {
            feedContainer.empty().append(conversations[hash].get());
            if (tabs[hash].hasClass("glow-unread"))
                tabs[hash].removeClass("glow-unread");
            backButton.selector.show();
            avatarTop.html(`<img src="${localStorage.getItem(login)}" class="feed-top-avatar rounded-circle"/>`);
            activeConversation = hash;
            pvt = true;
            feedTop.text("Conversation with " + login);
            for (var key in tabs)
                tabs[key].removeClass("active-conversation");
            tab.selector.addClass("active-conversation");
        }
        console.log("conversation " + hash + " tab clicked clicked");
    }, "glow-unread");
    if (hash in conversations) {
        tab.rejectButton.Remove();
        tab.acceptButton.Remove();
        tab.closeButton.Render();
    }
    chatTabs.append(tab.selector);
    tabs[hash] = tab.selector;
}
function strip(s) {
    return s.replace(/<(?:.|\n)*?>/gm, '');
}
