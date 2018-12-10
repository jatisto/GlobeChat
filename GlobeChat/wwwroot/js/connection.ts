
connection.on(CHANNEL_MESSAGE_RECEIVED, (login: string, message: string, channel: string) => {  
    addMessageToFeed(login, strip(message), channel);
});

connection.on(USER_JOINED_CHANNEL, (user: any, newChannel: any, channel:string) => {
    user = <User>JSON.parse(user);
    addUserToChannel(user);
    addMessageToFeed("Info:", strip(user.login + " joined channel"), channel);
});

connection.on(USER_CONNECTION_TIMEOUT, (login: string, message: string, channel:string) => {
    console.log("User timedout : " + login + " : " + message + channel)
    addMessageToFeed(login, strip(message), channel);
    removeUserFromList(login);
});

connection.on(USER_LEFT_CHANNEL, (login: string, channel: string) => {
    console.log("USER_LEFT_CHANNEL " + login + " left channel.");
    removeUserFromList(login);
});

connection.on(USER_JOINED_CHANNEL, (login: string, channel: string) => {
   
    console.log("User joined this channel");
});

connection.on(INVITATION_RECEIVED, (login: string) => {    
    addChatTab(login);
});

connection.start()
    .catch(err => console.log(err))
    .then(() => {
        console.log(connection.keepAliveIntervalInMilliseconds);
    }).then(() => {
        joinChannel(GLOBAL_CHANNEL);
    });

