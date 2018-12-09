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
function loadChannels() {
    var resp = ajaxRequestParams("POST", "api/getChannels", "", null);
    resp.then(function (response) {
        channels = response;
        channelList.html('');
        channels.forEach((channel) => { new GUIChannelListElement($(".channel-list"), channel); });
    });
}
function addMessageToFeed(login, message) {
    new GUIChatFeedElement(feedList, message);
}
function loadUsers(id) {
    var resp = ajaxRequestParams("POST", "api/Channels/" + id + "/users", "", null);
    resp.then(function (response) {
        userList.html('');
        users = response;
        users.forEach((user) => {
            user.element = new GUIUserListElement($(".user-list"), user);
            ;
            user.element.Render();
        });
    });
}
function removeUserFromList(login) {
    var element = GUIUsers.filter(e => e.User.login == login)[0];
    element.Remove();
    users = users.filter(u => u.login != u.login);
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
function joinGlobalChannel() {
    return __awaiter(this, void 0, void 0, function* () {
        yield ajaxRequestParams("POST", "api/Channels/1/join", "", null).then(() => {
            console.log("Joined channel");
            loadChannels();
            loadUsers(GLOBAL_CHANNEL);
        });
    });
}
function joinChannel(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ajaxRequestParams("POST", "api/Channels/" + id + "/join", "", null).then(() => {
            console.log("Joined channel");
            feedList.html("");
            loadChannels();
            loadUsers(id);
        });
    });
}
