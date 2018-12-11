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
    console.log("User timed out : " + login + " : " + message + channel);
    addMessageToFeed(login, strip(message), channel);
    removeUserFromList(login);
});
connection.on(USER_LEFT_CHANNEL, (user, newChannel, channel) => {
    user = JSON.parse(user);
    addMessageToFeed("Info:", strip(user.login + " left channel"), channel);
    removeUserFromList(user.login);
});
connection.on(INVITATION_RECEIVED, (login, hash) => {
    console.log("received new invitation " + login + " " + hash);
    conversations[hash] = new Conversation(hash);
});
connection.on(PRIVATE_MESSAGE_RECEIVED, (hash, login, message) => {
    console.log("private message received " + hash + " " + login + " " + message);
    conversations[hash].add(new GUIChatFeedElement($(hash), login, message));
});
connection.start()
    .catch(err => console.log(err))
    .then(() => {
    console.log(connection.keepAliveIntervalInMilliseconds);
}).then(() => {
    joinChannel(GLOBAL_CHANNEL);
});
