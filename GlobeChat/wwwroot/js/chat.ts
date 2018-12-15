var username = "";
var gender = "";
var avatar = "";
var croppie: Croppie;
var userUploadAvatar: any;
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
    
}

const maxAvatarSize = 1024 * 100;

const action_interval = 100;
var last_action = 0;

var channels = new Array<Channel>();
var users = new Array<User>();
var conversations: { [id: string]: Conversation; } = {};
var tabs: { [id: string]: JQuery<HTMLElement>; } = {};
var avatars: { [id: string]: TuserAvatar } = {};
var pvt = false;

feedTop.html(currentChannelName);

var backButton = new GUIButton(backButtonDiv, "", () => {
    pvt = false;
    feedContainer.html('');
    feedContainer.append(conversations[currentChannelName].get());
    activeConversation = currentChannelName;
    console.log("back button clicked");
    backButton.Hide();
    feedTop.html(currentChannelName)
}, "btn-secondary rounded-circle", "fa fa-arrow-circle-left");

backButton.Render();
backButton.Hide();

userMessage.keypress(function (e) {
    switch (e.key) {
        case "Enter": {
            if (!pvt) sendMessage(<string>userMessage.val());
            else if (conversations[activeConversation].status != CONVERSATION_STATUS.ENDED)
                    sendPrivateMessage(activeConversation, <string>userMessage.val());
            userMessage.val(''); break
        };
    }
});

//$('.body').fadeTo("slow", 0.8);
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .configureLogging(signalR.LogLevel.Information)    
    .build();

function sendMessage(message: string) {    
    console.log("Message sent : ");
    connection.send(NEW_MESSAGE, message);
}

function sendPrivateMessage(hash: string, message: string,) {
    console.log("Private Message sent : ");
    if (conversations[activeConversation].status != CONVERSATION_STATUS.ENDED)
        connection.send(NEW_PRIVATE_MESSAGE, hash, message);
}

function sendInvitation(receiver: string) {
    console.log("Invitation sent to : " + receiver);
    connection.send(INVITATION_SEND, receiver);
}

function acceptInvitation(hash: string) {
    console.log("Accepting conversation : " + hash);
    connection.send(ACCEPT_INVITATION, hash);
}

function rejectInvitation(hash: string) {
    console.log("rejecting conversation : " + hash);
    connection.send(REJECT_INVITATION, hash);
}

function endConversation(hash: string, login:string) {
    console.log("ending conversation : " + hash);
    connection.send(END_CONVERSATION, hash);
}

$(document).ready(function () {    
    searchChannel.keyup(function () {
        var valThis = <string>$(this).val();
        valThis = valThis.toLowerCase();
        console.log(valThis);
        $('.channel-list>li').each(function () {              
            var text = strip($(this).text().toLowerCase());
            text = text.trim();         
            (text.indexOf(<string>valThis) == 0) ? $(this).show() : $(this).hide();
        });
    });

    userSearch.keyup(function () {
        var valThis = <string>$(this).val();
        valThis = valThis.toLowerCase();
        console.log(valThis);
        $('.user-list>li').each(function () {
            var text = strip($(this).text().toLowerCase());
            text = text.trim();
            (text.indexOf(<string>valThis) == 0) ? $(this).show() : $(this).hide();
        });
    });

    croppie = new Croppie(<HTMLElement><unknown>document.getElementById("current-avatar"), croppieopts);
    croppie.bind({
        zoom: 0,
        url: <string><unknown>localStorage.getItem(username),
    }).then((data) => { croppie.setZoom(0); })

    
});

overlayHider.click(() => {
    overlay.fadeOut(100);
    modals.hide();
});

$(imageUploader).change(function () {     
    var newimg = readImage(this);    
});


async function readImage(input: any): Promise<string> {
    var result: string = "Error";
    if (input.files && input.files[0]) {
        var reader = new FileReader();                
        reader.onload = function (e) {
            var result: String = (<any><unknown>e).target.result;
            if (result.length < maxAvatarSize) {
                userSettingsCurrentAvatar.attr('src', (<any><unknown>e).target.result);
                userUploadAvatar = (<any><unknown>e).target.result;               
                result = userUploadAvatar;                   
                    croppie.destroy();
                croppie = new Croppie(<HTMLElement><unknown>document.getElementById("current-avatar"), croppieopts);
                croppie.bind({
                    zoom: 0,
                    url: <string>result,
                    points: [100, 100, 200, 200],                                      
                }).then(() => {
                    croppie.setZoom(0)
                });               
              }            
            else alert("Image is too big");              
        }
        reader.readAsDataURL(input.files[0]);       
    }       
    return <string>userSettingsCurrentAvatar.val();    
}

userSettingsSaveButton.click(() => {
    userUploadAvatar = croppie.result().then(function (val: any): void {         
        console.log(val);
        var data = JSON.stringify(new TuserAvatar(username, val));
        ajaxRequestParamsJSON("POST", `api/Avatars`, data, null);    
    }).then(() => {
        overlay.fadeOut();
    });
   
})

