"use strict";
var currentChannelName = "Global";
var channelList = $(".channel-list");
var userList = $(".user-list");
var feedList = $(".feed-list");
var chatTabs = $(".chat-tabs");
var userMessage = $(".message");
var channels = new Array();
var users = new Array();
var conversations = {};
userMessage.keypress(function (e) {
    switch (e.key) {
        case "Enter":
            {
                sendMessage(userMessage.val());
                userMessage.val('');
                break;
            }
            ;
    }
});
$('.body').fadeTo("slow", 0.8);
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .configureLogging(signalR.LogLevel.Information)
    .build();
function sendMessage(message) {
    console.log("Message sent : ");
    connection.send(NEW_MESSAGE, message);
}
function sendPrivateMessage(hash, message) {
    console.log("Message sent : ");
    connection.send(NEW_PRIVATE_MESSAGE, hash, message);
}
function sendInvitation(receiver) {
    console.log("Invitation sent to : " + receiver);
    connection.send(INVITATION_SEND, receiver);
}

"use strict";
var CONVERSATION_STATUS;
(function (CONVERSATION_STATUS) {
    CONVERSATION_STATUS[CONVERSATION_STATUS["PENDING"] = 0] = "PENDING";
    CONVERSATION_STATUS[CONVERSATION_STATUS["ACCEPTED"] = 1] = "ACCEPTED";
    CONVERSATION_STATUS[CONVERSATION_STATUS["REJECTED"] = 2] = "REJECTED";
    CONVERSATION_STATUS[CONVERSATION_STATUS["BLOCKED"] = 3] = "BLOCKED";
})(CONVERSATION_STATUS || (CONVERSATION_STATUS = {}));
const USER_LEFT_CHANNEL = "userLeftChannel";
const USER_JOINED_CHANNEL = "userJoinedChannel";
const USER_CONNECTION_TIMEOUT = "userConnectionTimeOut";
const USER_DISCONNECTED = "userDisconnected";
const CHANNEL_MESSAGE_RECEIVED = "channelMessageReceived";
const PRIVATE_MESSAGE_RECEIVED = "privateMessageReceived";
const INVITATION_RECEIVED = "invitationReceived";
const INVITATION_SEND = "invitationSend";
const NEW_MESSAGE = "newMessage";
const NEW_PRIVATE_MESSAGE = "newPrivateMessage";
const MALE = "Male";
const FEMAILE = "Female";
const GLOBAL_CHANNEL = 1;

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
function addMessageToFeed(login, message, channel) {
    var el = new GUIChatFeedElement(feedList, login, message);
}
function joinChannel(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ajaxRequestParams("POST", "api/Channels/" + id + "/join", "", null).then((channelName) => {
            feedList.html("");
            loadChannels();
            loadUsers(id);
            currentChannelName = channelName;
        });
    });
}
function loadChannels() {
    var resp = ajaxRequestParams("POST", "api/getChannels", "", null);
    resp.then(function (response) {
        channels = response;
        channelList.html('');
        channels.forEach((channel) => {
            channel.element = new GUIChannelListElement($(".channel-list"), channel);
            let joinButton = new GUIButton(channel.element.selector, "Join", () => { joinChannel(channel.id); });
            channel.element.Render();
            joinButton.Render();
            joinButton.selector.addClass("float-right");
        });
    });
}
function loadUsers(id) {
    users = [];
    var resp = ajaxRequestParams("POST", "api/Channels/" + id + "/users", "", null);
    resp.then(function (response) {
        userList.html('');
        let _users = response;
        _users.forEach((user) => addUserToChannel(user));
    });
}
function addUserToChannel(user) {
    try {
        user.element = new GUIUserListElement($(".user-list"), user);
        ;
        let inviteButton = new GUIButton(user.element.selector, "Invite", () => { sendInvitation(user.login); });
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
function removeUserFromList(login) {
    console.log("removing user from list " + login);
    if (users.length >= 0) {
        var user = users.filter(e => e.login == login)[0];
        user.element.Remove();
        console.log("found : " + user.login + " removing");
        users = users.filter(u => u.login != u.login);
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
function strip(s) {
    return s.replace(/<(?:.|\n)*?>/gm, '');
}

"use strict";