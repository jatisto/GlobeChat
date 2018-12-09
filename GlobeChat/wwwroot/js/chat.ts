var channelList = $(".channel-list");
var userList = $(".user-list");
var feedList = $(".feed-list");
var userMessage = $(".message");
var channels = new Array<Channel>();
var users = new Array<User>();
var GUIUsers = new Array<GUIUserListElement>();

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

connection.on(CHANNEL_MESSAGE_RECEIVED, (login: string, message: string) => {
    console.log("Message received : " + login + " : " + message)
    feedList.scrollTop(feedList[0].scrollHeight);
    addMessageToFeed(login, message);
});

connection.on(USER_JOINED_CHANNEL, (login: string, message: string) => {
    console.log("User joined : " + login + " : " + message)
    addMessageToFeed(login, message);
});

connection.on(USER_CONNECTION_TIMEOUT, (login: string, message: string) => {
    addMessageToFeed(login, message);
    //removeUser(login);
});

/*    
connection.on(USER_LEFT_CHANNEL, (login: string, channel: string) => {
    cv.removeUser(login);
    cv.updateChannelListEntry(channel, -1);
});
*/

connection.on(USER_JOINED_CHANNEL, (login: string, channel: string) => {    
    //cv.addNewUser(login, 25, MALE);
    //cv.updateChannelListEntry(channel, +1);
    console.log("User joined this channel");
});


connection.start()
    .catch(err => console.log(err))
    .then(() => {
        console.log(connection.keepAliveIntervalInMilliseconds);
        joinGlobalChannel();
    });




    