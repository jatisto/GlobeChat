var currentChannelName = "Global";
var channelList = $(".channel-list");
var userList = $(".user-list");
var feedList = $(".feed-list");
var chatTabs = $(".chat-tabs");
var userMessage = $(".message");

var channels = new Array<Channel>();
var users = new Array<User>();
//var GUIUsers = new Array<GUIUserListElement>();
var conversations: { [id: string]: Conversation; } = {};
userMessage.keypress(function (e) {
    switch (e.key) {
        case "Enter": { sendMessage(<string>userMessage.val()); userMessage.val('');  break };
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

function sendInvitation(receiver: string) {
    console.log("Invitation sent to : " + receiver);
    connection.send(INVITATION_SEND, receiver);
}


        