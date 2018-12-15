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
var gender = "";
var avatar = "";
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
    console.log("back button clicked");
    backButton.Hide();
    feedTop.html(currentChannelName);
}, "btn-secondary rounded-circle", "fa fa-arrow-circle-left");
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
