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

function loadChannels(): void {    
    var resp = ajaxRequestParams("POST", "api/getChannels", "", null);
    resp.then(function (response) {      
        channels = <Channel[]><unknown>response;
        channelList.html('');
        channels.forEach((channel) => { new GUIChannelListElement($(".channel-list"), channel) });
    });
}

function addMessageToFeed(login: string, message: string) {
    new GUIChatFeedElement(feedList, message);
}

function loadUsers(id:number): void {
    var resp = ajaxRequestParams("POST", "api/Channels/"+id+"/users", "", null);
    resp.then(function (response) {
        userList.html('');
        users = <User[]><unknown>response;
        users.forEach((user) =>
        {           
            user.element = new GUIUserListElement($(".user-list"), user);;
            user.element.Render();            
        });
    });
}

function removeUserFromList(login: string) {
    var element = GUIUsers.filter(e => e.User.login == login)[0];
    element.Remove();
    users = users.filter(u => u.login != u.login);   
}

function getBadgeColor(amount: number) {    
    if (amount > 100) return "badge-danger";
    if (amount > 50) return "badge-warning";
    if (amount > 25) return "badge-success";
    return "badge-secondary";
}

async function joinGlobalChannel() {
   await ajaxRequestParams("POST", "api/Channels/1/join", "", null).then(() => {       
        console.log("Joined channel");
        loadChannels();     
        loadUsers(GLOBAL_CHANNEL);       
    });   
}

async function joinChannel(id: number) {
    await ajaxRequestParams("POST", "api/Channels/" + id + "/join", "", null).then(() => {
        console.log("Joined channel");
        feedList.html("");        
        loadChannels();
        loadUsers(id);
    });
}

