
async function ajaxRequestParams(_type: string, _url: string, _params: any, _callback: null) {
    return new Promise<string>((resolve, reject) => {
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
    })
}

async function ajaxRequestParamsJSON(_type: string, _url: string, _params: any, _callback: null) {
    return new Promise<string>((resolve, reject) => {
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
    })
}

function loadPartial(partial: JQuery<HTMLElement>) {
    overlay.show();
    partial.addClass("fadeInDown animated").show();
}

async function joinChannel(channelName: string) {
    await ajaxRequestParams("POST", "api/Channels/" + channelName + "/join", "", null).then((channelName) => {
        loadChannels();
        loadUsers(channelName);
        delete conversations[currentChannelName];
        currentChannelName = channelName;
        feedTop.html(channelName);
        feedContainer.empty();
        conversations[channelName] = new Conversation(channelName);
        feedContainer.append(conversations[currentChannelName].get());

    });
}

function loadChannels(): void {
    var resp = ajaxRequestParams("POST", "api/getChannels", "", null);
    resp.then(function (response) {
        channels = <Channel[]><unknown>response;
        channelList.html('');
        channels.forEach((channel) => {
            channel.element = new GUIChannelListElement($(".channel-list"), channel);
            let joinButton = new GUIButton(channel.element.selector, "Join",
                () => {
                    joinChannel(channel.channelName);
                }, "btn join-button", "fa fa-sign-in")
            channel.element.Render();
            joinButton.Render();
            joinButton.selector.addClass("float-right");
        });
    });
}

function loadUsers(channelName: string): void {
    users = [];
    var resp = ajaxRequestParams("POST", "api/Channels/" + channelName + "/users", "", null);
    var resp_avatars = ajaxRequestParams("POST", "api/Channels/" + channelName + "/users/avatars", "", null);

    resp_avatars.then(function (response) {
        let _avatars = <TuserAvatar[]><unknown>response;
        _avatars.forEach((avatar) => {
            localStorage.setItem(avatar.login, avatar.image);           
        });
    }).then(() => {
        resp.then(function (response) {
            userList.html('');
            let _users = <User[]><unknown>response;
            _users.sort(function (x: User, y: User) {
                return x.login == username ? -1 : y.login == username ? 1 : 0;
            });
            _users.forEach((user) => addUserToChannel(user));
        });
    })

}

function addUserToChannel(user: User): void {
    try {
        console.log("adding user " + user.login);
        if (username != user.login) {
            user.element = new GUIUserListElement(userList, user, "");
            let inviteButton = new GUIButton(user.element.selector, "", () => {
                sendInvitation(user.login)
            }, "invite-btn float-right btn-success", "fa fa-comments");

            let blockButton = new GUIButton(user.element.selector, "", () => {
            }, "invite-btn float-right btn-danger", "fa fa-close");

            blockButton.Render();
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

function removeUserFromList(login: string) {
    console.log("removing user from list " + login);
    if (users.length >= 0) {
        try {
            var user = users.filter(e => e.login == login)[0];
            console.log("found : " + user.login + " removing")
            user.element.Remove();
            users = users.filter(u => u.login != u.login);
        } catch (e) {
            console.log(e);
        }
    }
}

function getBadgeColor(amount: number) {
    if (amount > 100) return "badge-danger";
    if (amount > 50) return "badge-warning";
    if (amount > 25) return "badge-success";
    return "badge-secondary";
}

function generateRandomString(length: number): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function addConversation(login: string, hash: string) {
    let tab = new GUIChatTabElement(chatTabs, login, hash, () => {
        if (conversations[hash].status == CONVERSATION_STATUS.ACCEPTED ||
            conversations[hash].status == CONVERSATION_STATUS.REJECTED) {
            feedContainer.empty().append(conversations[hash].get());
            if (tabs[hash].hasClass("glow-unread"))
                tabs[hash].removeClass("glow-unread");
            backButton.selector.show();
            avatarTop.html(`<img src="${localStorage.getItem(login)}" class="feed-top-avatar rounded-circle"/>`)
            activeConversation = hash;
            pvt = true;
            feedTop.text("Conversation with " + login);            
            tab.selector.addClass("active-conversation");
        }
        console.log("conversation " + hash + " tab clicked clicked");
    }, "glow-unread")
    if (hash in conversations) {
        tab.rejectButton.Remove();
        tab.acceptButton.Remove();
        tab.closeButton.Render();
    }
    chatTabs.append(tab.selector);
    tabs[hash] = tab.selector;
}

function strip(s: string): string {
    return s.replace(/<(?:.|\n)*?>/gm, '');
}

