
connection.on(CHANNEL_MESSAGE_RECEIVED, (login: string, message: string, channel: string) => {  
    addMessageToFeed(login, strip(message), channel);
});

connection.on(USER_JOINED_CHANNEL, (user: any, newChannel: any, channel:string) => {
    user = <User>JSON.parse(user);
    addUserToChannel(user);
    addMessageToFeed("Info:", strip(user.login + " joined channel"), channel);
});

connection.on(USER_CONNECTION_TIMEOUT, (login: string, message: string, channel:string) => {
    console.log("User timed out : " + login + " : " + message + channel)
    addMessageToFeed(login, strip(message), channel);
    removeUserFromList(login);
});

connection.on(USER_LEFT_CHANNEL, (user: any, newChannel: any, channel: string) => {
    user = <User>JSON.parse(user);    
    addMessageToFeed("Info:", strip(user.login + " left channel"), channel);
    removeUserFromList(user.login);
});

connection.on(INVITATION_RECEIVED, (login: string, hash:string) => {    
    console.log("received new invitation " + login + " " + hash);   
    conversations[hash] = new Conversation(hash)
});

connection.on(PRIVATE_MESSAGE_RECEIVED, (hash:string, login: string, message: string) => {
    console.log("private message received " + hash + " "  + login + " " + message);
    conversations[hash].add(new GUIChatFeedElement($(hash), login, message));
});

connection.start()
    .catch(err => console.log(err))
    .then(() => {
        console.log(connection.keepAliveIntervalInMilliseconds);
    }).then(() => {
        joinChannel(GLOBAL_CHANNEL);
    });


