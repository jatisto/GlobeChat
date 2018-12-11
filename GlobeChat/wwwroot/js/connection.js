"use strict";
connection.on(CHANNEL_MESSAGE_RECEIVED, (login, message, channel) => {
    conversations[channel].add(new GUIChatFeedElement($(channel), login, message));
    addMessageToFeed(login, strip(message));
});
connection.on(USER_JOINED_CHANNEL, (user, newChannel, channel) => {
    user = JSON.parse(user);
    addUserToChannel(user);
    addMessageToFeed("Info:", strip(user.login + " joined channel"));
});
connection.on(USER_CONNECTION_TIMEOUT, (login, message, channel) => {
    console.log("User timed out : " + login + " : " + message + channel);
    addMessageToFeed(login, strip(message));
    removeUserFromList(login);
});
connection.on(USER_LEFT_CHANNEL, (user, newChannel, channel) => {
    user = JSON.parse(user);
    addMessageToFeed("Info:", strip(user.login + " left channel"));
    removeUserFromList(user.login);
});
connection.on(INVITATION_RECEIVED, (login, hash) => {
    console.log("received new invitation " + login + " " + hash);
    addConversation(login, hash);
    conversations[hash] = new Conversation(hash);
});
connection.on(PRIVATE_MESSAGE_RECEIVED, (hash, login, message) => {
    console.log("private message received " + hash + " " + login + " " + message);
    if (hash == activeConversation)
        addMessageToFeed(login, message);
    conversations[hash].add(new GUIChatFeedElement($(hash), login, message));
    if (activeConversation != hash) {
        tabs[hash].addClass("glow-unread");
    }
});
connection.on(INVITATION_ACCEPTED, (hash, login) => {
    console.log("invitation accepted " + hash);
    if (hash in conversations) {
        conversations[hash].status = CONVERSATION_STATUS.ACCEPTED;
    }
    else {
        conversations[hash] = new Conversation(hash);
        conversations[hash].status = CONVERSATION_STATUS.ACCEPTED;
        addConversation(login, hash);
    }
    conversations[hash].add(new GUIChatFeedElement($(hash), "Conversation started", "Say hello !"));
});
connection.on(INVITATION_REJECTED, (hash, login) => {
    console.log("invitation rejected " + hash);
    if (hash in conversations) {
        delete conversations[hash];
    }
    else {
        conversations[hash] = new Conversation(hash);
        conversations[hash].status = CONVERSATION_STATUS.REJECTED;
        addConversation(login, hash);
    }
    conversations[hash].add(new GUIChatFeedElement($(hash), "INFO", "User rejected your invitation"));
});
connection.start()
    .catch(err => console.log(err))
    .then(() => {
    console.log(connection.keepAliveIntervalInMilliseconds);
}).then(() => {
    joinChannel(GLOBAL_CHANNEL);
});
