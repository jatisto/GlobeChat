var ChatView = /** @class */ (function () {
    function ChatView(div_container) {
        this.selectedChannel = 0;
        this.selectedChannel = 0;
        this.channelList = webix.ajax().get("/api/channels");
        this.userList = null;
        console.log(this.channelList);
        this.UI = webix.ui({
            id: "webchatview",
            container: div_container,
            width: 1880,
            height: 1000,
            rows: [{
                    cols: [{
                            rows: [{
                                    height: 60,
                                    cols: [{
                                            view: "button",
                                            id: "settings-button",
                                            type: "iconTop",
                                            icon: "fa fa-user",
                                            label: "Settings"
                                        },
                                        {
                                            view: "button",
                                            id: "create-button",
                                            type: "iconTop",
                                            icon: "fa fa-plus",
                                            click: console.log("wtf2"),
                                            label: "Create"
                                        }, {
                                            view: "button",
                                            id: "join-button",
                                            type: "iconTop",
                                            icon: "fa fa-sign-in",
                                            label: "Join",
                                            click: this.joinChannel
                                        }
                                    ]
                                },
                                {
                                    width: 300,
                                    view: "list",
                                    select: 1,
                                    data: this.channelList,
                                    template: '<div class ="channel-item" id=#id#> <span class="badge">#channelName# </span><span class="badge #csSclass#"> #userCount# users </span> </div>'
                                }
                            ]
                        },
                        {
                            view: "list" //feesd
                        },
                        {
                            id: "webix-user-list",
                            width: 300,
                            view: "list",
                            template: "#login# #age# #gender#"
                        }
                    ]
                },
                {
                    cols: [
                        { width: 300 },
                        {
                            view: "richtext",
                            height: 150,
                            id: "user-message",
                            label: "My Label",
                            labelPosition: "top",
                            value: "Some text"
                        },
                        { width: 300 }
                    ]
                } //secondrow
            ]
        });
        this.webixuserlist = $$("webix-user-list");
        this.webixchannelList = $$("webix-channel-list");
        this.webixfeed = $$("webix-feed-list");
    }
    ChatView.prototype.joinChannel = function () {
        var joinPromise = webix.ajax().get("api/channels/" + cv.selectedChannel + "/join").then(function () {
            $$("webix-user-list").clearAll();
            $$("webix-user-list").load("api/channels/" + cv.selectedChannel + "/users");
        });
    };
    return ChatView;
}());
var cv = new ChatView("webchatview");
$(document).on('click', '.channel-item', function () {
    cv.selectedChannel = $(this).attr("id");
});
$(document).on('click', '#join-button', function () {
    //cv.joinChannel();
});
var usermessage = $$("user-message");
webix.event($$("user-message").$view, "keyup", function (ev) {
    switch (ev.key) {
        case "Enter": {
            usermessage.refresh();
            setTimeout(function () { }, 1);
            usermessage.setValue('');
            break;
        }
    }
});
