﻿async function ajaxRequestParams(_type: string, _url: string, _params: string, _callback: null) {    
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

function addMessageToFeed(login: string, message: string, channel: string) {
    console.log("Adding message to channel " + channel)   
    new GUIChatFeedElement(feedList, login, message);
    let c = conversations[channel];
    c.add(new GUIChatFeedElement($("#" + channel), login, message));
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

function removeUserFromList(login: string) {
    if (users.length >= 0) {
        var user = users.filter(e => e.login == login)[0];
        user.element.Remove();
        users = users.filter(u => u.login != u.login);   
    }    
}

function getBadgeColor(amount: number) {    
    if (amount > 100) return "badge-danger";
    if (amount > 50) return "badge-warning";
    if (amount > 25) return "badge-success";
    return "badge-secondary";
}

async function joinChannel(id: number) {
    await ajaxRequestParams("POST", "api/Channels/" + id + "/join", "", null).then((channelName) => {        
        feedList.html("");        
        loadChannels();
        loadUsers(id);       
        currentChannelName = channelName;   
        addChatTab(channelName);
        conversations[channelName]= new Conversation(currentChannelName, CONVERSATION_STATUS.ACCEPTED);
    });
}

function generateRandomString(length:number):string
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function strip(s:string): string {
    return s.replace(/<(?:.|\n)*?>/gm, '');
}

function addUserToChannel(user: User): void{
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

function addChatTab(login: string) {        
    let tab = new GUIChatTabElement(chatTabs, login);
    let conversation = new Conversation(login, CONVERSATION_STATUS.PENDING);
    conversations[login] = conversation;
    tab.Render();
}

function loadConversation(login: string) {
    let conversation = conversations[login];
    feedList.html('');
    feedList.append(conversation.get());
}