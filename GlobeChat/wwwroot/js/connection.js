"use strict";
connection.on(CHANNEL_MESSAGE_RECEIVED, (login, message, channel) => {
    addMessageToFeed(login, strip(message), channel);
});
connection.on(USER_JOINED_CHANNEL, (user, newChannel, channel) => {
    user = JSON.parse(user);
    addUserToChannel(user);
    addMessageToFeed("Info:", strip(user.login + " joined channel"), channel);
});
connection.on(USER_CONNECTION_TIMEOUT, (login, message, channel) => {
    console.log("User timedout : " + login + " : " + message + channel);
    addMessageToFeed(login, strip(message), channel);
    removeUserFromList(login);
});
connection.on(USER_LEFT_CHANNEL, (login, channel) => {
    console.log("USER_LEFT_CHANNEL " + login + " left channel.");
    removeUserFromList(login);
});
connection.on(USER_JOINED_CHANNEL, (login, channel) => {
    console.log("User joined this channel");
});
connection.on(INVITATION_RECEIVED, (login) => {
    addChatTab(login);
});
connection.start()
    .catch(err => console.log(err))
    .then(() => {
    console.log(connection.keepAliveIntervalInMilliseconds);
}).then(() => {
    joinChannel(GLOBAL_CHANNEL);
});
