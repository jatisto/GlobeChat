"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var username = "";
var croppie;
var userUploadAvatar;
var activeConversation = "";
var currentChannelName = "Global";
const channelList = $(".channel-list");
const userList = $(".user-list");
const feedList = $(".feed-list");
const chatTabs = $(".chat-tabs");
const userMessage = $(".message");
const feedTop = $(".feed-top");
const feedContainer = $(".feed-container");
const searchChannel = $(".search-channel");
const userSearch = $(".search-user");
const userSettingsModal = $(".user-settings-modal");
const userSettingsSaveButton = $(".user-settings-save");
const imageUploader = $("#imageUploader");
const userSettingsCurrentAvatar = $("#current-avatar");
const overlay = $(".overlay");
const overlayHider = $(".hide-overlay");
const modals = $(".chatmodal");
const backButtonDiv = $(".back-button-div");
const croppieDiv = $("#croppie-div");
const avatarTop = $(".avatar-top");
const croppieopts = {
    enableExif: false,
    enforceBoundary: true,
    viewport: {
        width: 250,
        height: 250,
    },
    boundary: { width: 300, height: 300 },
};
const maxAvatarSize = 1024 * 100;
const action_interval = 100;
var last_action = 0;
var channels = new Array();
var users = new Array();
var conversations = {};
var tabs = {};
var avatars = {};
var pvt = false;
feedTop.html(currentChannelName);
var backButton = new GUIButton(backButtonDiv, "", () => {
    pvt = false;
    feedContainer.html('');
    feedContainer.append(conversations[currentChannelName].get());
    activeConversation = currentChannelName;
    backButton.Hide();
    feedTop.html(currentChannelName);
    avatarTop.html('');
    for (var key in tabs)
        tabs[key].removeClass("active-conversation");
}, "btn-secondary rounded-circle back-button", "fa fa-arrow-circle-left");
backButton.Render();
backButton.Hide();
userMessage.keypress(function (e) {
    switch (e.key) {
        case "Enter":
            {
                if (!pvt)
                    sendMessage(userMessage.val());
                else if (conversations[activeConversation].status != CONVERSATION_STATUS.ENDED)
                    sendPrivateMessage(activeConversation, userMessage.val());
                userMessage.val('');
                break;
            }
            ;
    }
});
//$('.body').fadeTo("slow", 0.8);
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
    if (conversations[activeConversation].status != CONVERSATION_STATUS.ENDED)
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
$(document).ready(function () {
    searchChannel.keyup(function () {
        var valThis = $(this).val();
        valThis = valThis.toLowerCase();
        console.log(valThis);
        $('.channel-list>li').each(function () {
            var text = strip($(this).text().toLowerCase());
            text = text.trim();
            (text.indexOf(valThis) == 0) ? $(this).show() : $(this).hide();
        });
    });
    userSearch.keyup(function () {
        var valThis = $(this).val();
        valThis = valThis.toLowerCase();
        console.log(valThis);
        $('.user-list>li').each(function () {
            var text = strip($(this).text().toLowerCase());
            text = text.trim();
            (text.indexOf(valThis) == 0) ? $(this).show() : $(this).hide();
        });
    });
    croppie = new Croppie(document.getElementById("current-avatar"), croppieopts);
    croppie.bind({
        zoom: 0,
        url: localStorage.getItem(username),
    }).then((data) => { croppie.setZoom(0); });
    console.log("setting localstorage");
    localStorage.setItem("info", info);
});
overlayHider.click(() => {
    overlay.fadeOut(100);
    modals.hide();
});
$(imageUploader).change(function () {
    var newimg = readImage(this);
});
function readImage(input) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = "Error";
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var result = e.target.result;
                if (result.length < maxAvatarSize) {
                    userSettingsCurrentAvatar.attr('src', e.target.result);
                    userUploadAvatar = e.target.result;
                    result = userUploadAvatar;
                    croppie.destroy();
                    croppie = new Croppie(document.getElementById("current-avatar"), croppieopts);
                    croppie.bind({
                        zoom: 0,
                        url: result,
                        points: [100, 100, 200, 200],
                    }).then(() => {
                        croppie.setZoom(0);
                    });
                }
                else
                    alert("Image is too big");
            };
            reader.readAsDataURL(input.files[0]);
        }
        return userSettingsCurrentAvatar.val();
    });
}
userSettingsSaveButton.click(() => {
    userUploadAvatar = croppie.result().then(function (val) {
        console.log(val);
        var data = JSON.stringify(new TuserAvatar(username, val));
        ajaxRequestParamsJSON("POST", `api/Avatars`, data, null);
    }).then(() => {
        overlay.fadeOut();
    });
});

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
const user_male = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABd1BMVEUAAAAAbfAAbfAAbfAAbfAAbO8AbfAAb/EAa/IAbfAAbfAAbe8Abu4AbfAAbPEAcewAbfEAbfAAdusAVf8Abe8Abe8Aa+8Abu8AbfAAbPAAbe8AbfAAbfAAbfAAbu8AbvEAb/QAbPAAbfAAbvAAbfAAbe8AbfEAbvEAbfAAbfAAbfAAbPAAbe8Abu8AbfEAbfAAbO8AZuYAbe0AbfAAbfAAbPEAbfEAbe8AbfAAavEAbfAAbvAAgP8AbfAAbvAAbfEAbfAAafAAbfAAbPEAAP8AbfEAbO8AcfAAbfAAbPAAbfEAcO8AbvEAbfAAbvEAbfAAbvEAbfAAbfAAbO4AbfAAceMAbfAAgP8AbvAAbPAAbfAAbe8AbfEAbfAAbfAAbfAAbf8AbPAAbfAAcPUAbfMAbe8AbfAAbPEAbu8AbfAAbfAAbfAAbfEAbfEAbfAAbvAAa+8Abe8Ac/IAbu8AbfAAbfAAbfAAbPIAbfAAb/IAcfEAbfAAAACYmbfNAAAAe3RSTlMAd/7tv5JlNybA/XAsqH8bn4oNA5TmPnLeIVL19O+CSBfB33nJXsNYvbi3tbSzspZQCg6+nWqxg+MktmQC3KpZ9xHMXAHCQCLGrn4wbemQzo6YvC3iCZsGQ5nnP9RE7PwHVbsZKpHuWl/H+qY4NvulHzEUgIX48SjXJxLYoy1/AAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB+IMDg8HLiq8Vi4AAAGQSURBVEjHzdRnU8JAEIDhI0GRCAoigghW7GLFgmJBURQbFsSGBQv23vPnNTIOQ7KBvdwX3+/PZOZ2N4SwpGOIiNrj/i3m9UXFhhIjPRb0pabfNzVTf5kvK/8biIUSC9aK7DRtlVTYXpW7DA4Bj53V8lVy1WCx26RcRIMHiWuhNa5D4nrwCBpQuBG+oCYU9sK4GYVbYNyKwm0suJ0Fd7DgThbcxYJ9LLibBffAuBeD9X0w7h9AYD9RaRCBh9TwMAKPqGE/5sECKngUg8dgGxzH4AkYT6LmPBUC8TQKizOQDYg4bIGwA4mdYQDPIrE4p7QRDovngwq8IGKxGJXbRRGP3XK8RIGX5XiFAq+yYMU/MEaB1+TYisfrETne2MRiT1y5JC4s3gK2M8Ej8TZ0GDs4vGuD8B4K7ycJmO6gED70JcNEpaPjFJcH26MnJG+nZ+cq2JtOkILFLy6V+Or6prDMdGu+y8HCfQBLpR5i7ixOPdJQqadnTwYbDbRUKvTyypG3tBYq9f5BPrVaQr6005++AYaN1pT5pVUhAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTEyLTE0VDE0OjA3OjQ2KzAxOjAwYTIPgAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0xMi0xNFQxNDowNzo0NiswMTowMBBvtzwAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC";
const user_female = "data:image/png;base64,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";
const info = "data:image/png;base64,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";

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

"use strict";