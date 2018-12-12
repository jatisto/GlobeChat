
var currentChannelName = "Global";
var username = "";
const channelList = $(".channel-list");
const userList = $(".user-list");
const feedList = $(".feed-list");
const chatTabs = $(".chat-tabs");
const userMessage = $(".message");
const feedTop = $(".feed-top");
const feedContainer = $(".feed-container");

var channels = new Array<Channel>();
var users = new Array<User>();
var conversations: { [id: string]: Conversation; } = {};
var tabs: { [id: string]: JQuery<HTMLElement>; } = {};
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
        case "Enter": {
            if (!pvt) sendMessage(<string>userMessage.val());
            else sendPrivateMessage(activeConversation, <string>userMessage.val());
            userMessage.val(''); break
        };
    }
});

$('.body').fadeTo("slow", 0.8);
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





        