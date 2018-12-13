
connection.on(CHANNEL_MESSAGE_RECEIVED, (login: string, message: string, channel: string) => {
    
        console.log("Channel message recived " + login + " " + message)
        conversations[currentChannelName].add(new GUIChatFeedElement(feedList, login, strip(message)));
      
});

connection.on(USER_JOINED_CHANNEL, (user: any, newChannel: any, channel: string) => {       
        user = <User>JSON.parse(user);
        addUserToChannel(user);
        conversations[currentChannelName].add(new GUIChatFeedElement(feedList, (<User>user).login, strip("joined the channel")));   
      
});

connection.on(USER_CONNECTION_TIMEOUT, (login: string, message: string, channel: string) => {
    if (currentChannelName == channel) {
        console.log("User timed out : " + login + " : " + message + channel)
        conversations[currentChannelName].add(new GUIChatFeedElement(feedList, login, strip(" timed out")));
        removeUserFromList(login);
    }
});

connection.on(USER_LEFT_CHANNEL, (user: any,  channel: string) => {
    if (currentChannelName == channel) {
        user = <User>JSON.parse(user);
        console.log("User left the channel : " + user.login + " : " + channel)
        conversations[currentChannelName].add(new GUIChatFeedElement(feedList, user.login, strip(" left the channel")));
        removeUserFromList(user.login);
    }   
});

connection.on(INVITATION_RECEIVED, (login: string, hash: string) => {    
    if ((hash in conversations) == false) {
        console.log("received new invitation " + login + " " + hash);
        addConversation(login, hash);
        conversations[hash] = new Conversation(hash);
    }   
});

connection.on(PRIVATE_MESSAGE_RECEIVED, (hash:string, login: string, message: string) => {
    if (hash in conversations) {
        console.log("private message received " + hash + " " + login + " " + message);       
        conversations[hash].add(new GUIChatFeedElement($(hash), login, message));
        if (activeConversation != hash) {
            tabs[hash].addClass("pulse animate glow-unread");
        }
    } 
});

connection.on(INVITATION_ACCEPTED, (hash:string, login:string) => {
    console.log("invitation accepted " + hash);
    if (hash in conversations) {
        conversations[hash].status = CONVERSATION_STATUS.ACCEPTED;
    } else {       
        conversations[hash] = new Conversation(hash);
        conversations[hash].status = CONVERSATION_STATUS.ACCEPTED;
        addConversation(login, hash);
    }    
    conversations[hash].add(new GUIChatFeedElement($(hash), "Conversation started", "Say hello !"));
});

connection.on(INVITATION_REJECTED, (hash: string, login: string) => {
    console.log("invitation rejected " + hash);
    if (hash in conversations) {
        delete conversations[hash];
    } else {
        conversations[hash] = new Conversation(hash);
        conversations[hash].status = CONVERSATION_STATUS.REJECTED;
        addConversation(login, hash);
    }
    conversations[hash].add(new GUIChatFeedElement($(hash), "INFO", "User rejected your invitation"));
});

connection.on(CONVERSATION_ENDED, (hash: string, login: string) => {
    console.log("User ended conversation " + hash);
    if (hash in conversations) {       
        conversations[hash].add(new GUIChatFeedElement($(hash), "INFO", "User ended this conversation"));
    } else {
        //conversations[hash] = new Conversation(hash);
        //conversations[hash].status = CONVERSATION_STATUS.ENDED;
        //addConversation(login, hash);
        //conversations[hash].add(new GUIChatFeedElement($(hash), "INFO", "User ended this conversation"));   
    }   
});

connection.start()
    .catch(err => console.log(err))
    .then(() => {
        console.log(connection.keepAliveIntervalInMilliseconds);
    }).then(() => {
        joinChannel("Global");
    });



