
var currentChannelName = "Global";
var channelList = $(".channel-list");
var userList = $(".user-list");
var feedList = $(".feed-list");
var chatTabs = $(".chat-tabs");
var userMessage = $(".message");
var feedTop = $(".feed-top");
var channels = new Array<Channel>();
var users = new Array<User>();
var pvt = false;
var activeConversation = "";
var conversations: { [id: string]: Conversation; } = {};
var tabs: { [id: string]: JQuery<HTMLElement>; } = {};

var backBurton = new GUIButton(feedTop, "Go back to channel", () => {
    pvt = false;
    conversations[currentChannelName].load();
})
backBurton.Render();

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
    connection.send(ACCEPT_INVITATION, hash);
}





        