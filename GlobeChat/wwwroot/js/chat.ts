const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .configureLogging(signalR.LogLevel.Information)    
    .build();

connection.start().catch(err => document.write(err)).then(() => { console.log(connection.keepAliveIntervalInMilliseconds) });

connection.on("messageReceived", (username: string, message: string) => {
    let m = document.createElement("div");
    console.log(message);
});

connection.on("userLefChannel", (login: string, channel: string) => {
    cv.removeUser(login);
});


connection.on("userJoinedChannel", (login: string, channel: string) => {
    console.log(login + " joined channel " + channel);
    cv.addNewUser(login, 25, "MALE");
});

function send() {
          connection.send("newMessage", "user", "test");
}

