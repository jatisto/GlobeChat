"use strict";
connection.on(CHANNEL_MESSAGE_RECEIVED, (login, message, channel) => {
    console.log("Channel message recived " + login + " " + message);
    conversations[currentChannelName].add(new GUIChatFeedElement(feedList, login, strip(message)));
});
connection.on(USER_JOINED_CHANNEL, (user, newChannel, channel) => {
    user = JSON.parse(user);
    addUserToChannel(user);
    conversations[currentChannelName].add(new GUIChatFeedElement(feedList, user.login, strip("joined the channel")));
});
connection.on(USER_CONNECTION_TIMEOUT, (login, message, channel) => {
    if (currentChannelName == channel) {
        console.log("User timed out : " + login + " : " + message + channel);
        conversations[currentChannelName].add(new GUIChatFeedElement(feedList, "info", strip(" timed out")));
        removeUserFromList(login);
    }
});
connection.on(USER_LEFT_CHANNEL, (user, channel) => {
    if (currentChannelName == channel) {
        user = JSON.parse(user);
        console.log("User left the channel : " + user.login + " : " + channel);
        conversations[currentChannelName].add(new GUIChatFeedElement(feedList, user.login, strip(" left the channel")));
        removeUserFromList(user.login);
    }
});
connection.on(INVITATION_RECEIVED, (login, hash) => {
    if ((hash in conversations) == false) {
        console.log("received new invitation " + login + " " + hash);
        addConversation(login, hash);
        conversations[hash] = new Conversation(hash);
    }
});
connection.on(PRIVATE_MESSAGE_RECEIVED, (hash, login, message) => {
    if (hash in conversations) {
        console.log("private message received " + hash + " " + login + " " + message);
        conversations[hash].add(new GUIChatFeedElement($(hash), login, message));
        if (activeConversation != hash) {
            tabs[hash].addClass("glow-unread");
        }
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
    conversations[hash].add(new GUIChatFeedElement($(hash), "info", "Say hello !"));
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
        users.filter(u => u.login == login)[0].invited = false;
    }
    conversations[hash].add(new GUIChatFeedElement($(hash), "info", "User rejected your invitation"));
});
connection.on(CONVERSATION_ENDED, (hash, login) => {
    console.log("User ended conversation " + hash);
    if (hash in conversations) {
        conversations[hash].add(new GUIChatFeedElement($(hash), "info", "User ended this conversation"));
        users.filter(u => u.login == login)[0].invited = false;
    }
});
connection.start()
    .catch(err => console.log(err))
    .then(() => {
    console.log(connection.keepAliveIntervalInMilliseconds);
}).then(() => {
    joinChannel("Global");
});
