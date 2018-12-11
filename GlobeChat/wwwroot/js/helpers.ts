async function ajaxRequestParams(_type: string, _url: string, _params: string, _callback: null) {    
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

function addMessageToFeed(login: string, message: string) {
    var el = new GUIChatFeedElement(feedList, login, message);
}

async function joinChannel(id: number) {
    await ajaxRequestParams("POST", "api/Channels/" + id + "/join", "", null).then((channelName) => {
        feedList.html("");
        loadChannels();
        loadUsers(id);
        conversations[channelName] = new Conversation(channelName);
        delete conversations[currentChannelName];
        currentChannelName = channelName;
    });
}

function loadChannels(): void {    
    var resp = ajaxRequestParams("POST", "api/getChannels", "", null);
    resp.then(function (response) {      
        channels = <Channel[]><unknown>response;
        channelList.html('');
        channels.forEach((channel) => {
            channel.element = new GUIChannelListElement($(".channel-list"), channel);
            let joinButton = new GUIButton(channel.element.selector, "Join", () => { joinChannel(channel.id);  })   
            channel.element.Render();                                 
            joinButton.Render();
            joinButton.selector.addClass("float-right");
        });
    });
}

function loadUsers(id: number): void {
    users = [];
    var resp = ajaxRequestParams("POST", "api/Channels/"+id+"/users", "", null);
    resp.then(function (response) {
        userList.html('');
        let _users = <User[]><unknown>response;
        _users.forEach((user) => addUserToChannel(user));
    });
}

function addUserToChannel(user: User): void {
    try {
        user.element = new GUIUserListElement($(".user-list"), user);;
        let inviteButton = new GUIButton(user.element.selector, "Invite", () => { sendInvitation(user.login) });
        let blockButton = new GUIButton(user.element.selector, "Block", () => { });
        inviteButton.selector.addClass("invite-btn float-right");
        blockButton.selector.addClass("block-btn float-right");
        user.element.Render();
        blockButton.Render();
        inviteButton.Render();
        users.push(user);
    }
    catch (e) {
        console.log(e);
    }
}

function removeUserFromList(login: string) {
    console.log("removing user from list " + login);
    if (users.length >= 0) {
        var user = users.filter(e => e.login == login)[0];
        user.element.Remove();
        console.log("found : " + user.login + " removing")
        users = users.filter(u => u.login != u.login);   
    }    
}

function getBadgeColor(amount: number) {    
    if (amount > 100) return "badge-danger";
    if (amount > 50) return "badge-warning";
    if (amount > 25) return "badge-success";
    return "badge-secondary";
}

function generateRandomString(length:number):string
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function addConversation(login:string, hash:string) {
    let tab = new GUIChatTabElement(chatTabs, login, hash)
    if (hash in conversations) {
        tab.rejectButton.Remove();
        tab.acceptButton.Remove();
        tab.closeButton.Render();
    }
    chatTabs.append(tab.selector);
    tabs[hash] = tab.selector;
}

function strip(s:string): string {
    return s.replace(/<(?:.|\n)*?>/gm, '');
}

