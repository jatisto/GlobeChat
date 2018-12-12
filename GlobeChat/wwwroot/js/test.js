"use strict";
var currentChannelName = "Global";
var username = "";
const channelList = $(".channel-list");
const userList = $(".user-list");
const feedList = $(".feed-list");
const chatTabs = $(".chat-tabs");
const userMessage = $(".message");
const feedTop = $(".feed-top");
const feedContainer = $(".feed-container");
var channels = new Array();
var users = new Array();
var conversations = {};
var tabs = {};
var pvt = false;
var activeConversation = "";
feedTop.html('');
var backButton = new GUIButton(feedTop, "", () => {
    pvt = false;
    feedContainer.html('');
    feedContainer.append(conversations[currentChannelName].get());
    activeConversation = currentChannelName;
    console.log("back button clicked");
    backButton.Hide();
}, "btn-secondary rounded-circle", "fa fa-arrow-circle-left");
backButton.Render();
backButton.Hide();
userMessage.keypress(function (e) {
    switch (e.key) {
        case "Enter":
            {
                if (!pvt)
                    sendMessage(userMessage.val());
                else
                    sendPrivateMessage(activeConversation, userMessage.val());
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
    console.log("Private Message sent : ");
    connection.send(NEW_PRIVATE_MESSAGE, hash, message);
}
function sendInvitation(receiver) {
    console.log("Invitation sent to : " + receiver);
    connection.send(INVITATION_SEND, receiver);
}
function acceptInvitation(hash) {
    console.log("Accepting conversation : " + hash);
    connection.send(ACCEPT_INVITATION, hash);
}
function rejectInvitation(hash) {
    console.log("rejecting conversation : " + hash);
    connection.send(REJECT_INVITATION, hash);
}
function endConversation(hash, login) {
    console.log("ending conversation : " + hash);
    connection.send(END_CONVERSATION, hash);
}

"use strict";
var CONVERSATION_STATUS;
(function (CONVERSATION_STATUS) {
    CONVERSATION_STATUS[CONVERSATION_STATUS["PENDING"] = 0] = "PENDING";
    CONVERSATION_STATUS[CONVERSATION_STATUS["ACCEPTED"] = 1] = "ACCEPTED";
    CONVERSATION_STATUS[CONVERSATION_STATUS["REJECTED"] = 2] = "REJECTED";
    CONVERSATION_STATUS[CONVERSATION_STATUS["ENDED"] = 3] = "ENDED";
    CONVERSATION_STATUS[CONVERSATION_STATUS["BLOCKED"] = 4] = "BLOCKED";
})(CONVERSATION_STATUS || (CONVERSATION_STATUS = {}));
const USER_LEFT_CHANNEL = "userLeftChannel";
const USER_JOINED_CHANNEL = "userJoinedChannel";
const USER_CONNECTION_TIMEOUT = "userConnectionTimeOut";
const USER_DISCONNECTED = "userDisconnected";
const CHANNEL_MESSAGE_RECEIVED = "channelMessageReceived";
const PRIVATE_MESSAGE_RECEIVED = "privateMessageReceived";
const INVITATION_RECEIVED = "invitationReceived";
const INVITATION_SEND = "invitationSend";
const ACCEPT_INVITATION = "acceptInvitation";
const REJECT_INVITATION = "rejectInvitation";
const END_CONVERSATION = "endConversation";
const INVITATION_ACCEPTED = "invitationAccepted";
const INVITATION_REJECTED = "invitationRejected";
const CONVERSATION_ENDED = "conversationEnded";
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
function addMessageToFeed(login, message) {
    //conversations[currentChannelName].add(new GUIChatFeedElement($(login), login, message));  
}
function joinChannel(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ajaxRequestParams("POST", "api/Channels/" + id + "/join", "", null).then((channelName) => {
            loadChannels();
            loadUsers(id);
            delete conversations[currentChannelName];
            currentChannelName = channelName;
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
        channelList.html('');
        channels.forEach((channel) => {
            channel.element = new GUIChannelListElement($(".channel-list"), channel);
            let joinButton = new GUIButton(channel.element.selector, "Join", () => { joinChannel(channel.id); }, "btn btn-primary", "fa fa-sign-in");
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
        console.log("adding user " + user.login);
        if (username != user.login) {
            user.element = new GUIUserListElement($(".user-list"), user);
            let inviteButton = new GUIButton(user.element.selector, "", () => {
                sendInvitation(user.login);
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
            activeConversation = hash;
            feedContainer.empty().append(conversations[hash].get());
            if (tabs[hash].hasClass("glow-unread"))
                tabs[hash].removeClass("glow-unread");
            backButton.selector.show();
            pvt = true;
        }
        console.log("conversation " + hash + " tab clicked clicked");
    });
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

"use strict";