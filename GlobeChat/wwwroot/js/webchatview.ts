class ChatView {

    constructor(div_container: string) {
        this.selectedChannel = 0;
        this.channelList = webix.ajax().get("/api/channels");
        this.userList = null;        

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
                    { //channellist
                        width: 300,
                        view: "list",
                        select: 1,
                        data: this.channelList,
                        template: '<div class ="channel-item" id=#id#> <span class="badge">#channelName# </span><span class="badge #csSclass#"> #userCount# users </span> </div>',
                    }
                    ]
                },
                {
                    view: "list" //feesd
                },
                { // userlist
                    id: "webix-user-list",
                    width: 300,
                    view: "list",
                    template: "#login# #age# #gender#"
                }
                ]
            },
                {
                    cols: [
                        { width: 300},
                        {//richtext
                            view: "richtext",
                            height: 150,
                            id: "user-message",
                            label: "My Label",
                            labelPosition: "top",
                            value: "Some text"
                        },

                        { width: 300}
                    ]
                } //secondrow
            ]
        });
        this.webixuserlist = <webix.ui.list>$$("webix-user-list");
        this.webixchannelList = <webix.ui.list>$$("webix-channel-list");
        this.webixfeed = <webix.ui.list>$$("webix-feed-list");
    }

    joinChannel(): void {
        var joinPromise = webix.ajax().get("api/channels/" + cv.selectedChannel + "/join").then(() => {
            (<webix.ui.list>$$("webix-user-list")).clearAll();
            (<webix.ui.list>$$("webix-user-list")).load("api/channels/" + cv.selectedChannel + "/users");
        });
    }

    UI: webix.ui.baseview;
    private webixuserlist: webix.ui.list;
    private webixchannelList: webix.ui.list;
    private webixfeed: webix.ui.list;
    private loadList() :void {

    }

    addNewUser(login: string, age: number, gender: string): void {
        this.webixuserlist.add({  
                id:login,
                login:login,
                age: age,
                gender: gender
            })       
    }

    removeUser(login: string): void {
        this.webixuserlist.remove(login);
    }
    channelList: any;
    userList: any;
    selectedChannel: any = 0;
}


var cv = new ChatView("webchatview");
$(document).on('click', '.channel-item', function () {
    cv.selectedChannel = $(this).attr("id");
});

$(document).on('click', '#join-button', function () {
    //cv.joinChannel();
});

var usermessage = <webix.ui.richtext>$$("user-message");
webix.event($$("user-message").$view, "keyup", function (ev) {
    switch (ev.key) {
        case "Enter": {
            
            usermessage.refresh();            
            setTimeout(() => { }, 1);
            usermessage.setValue('');
            break;
        }
    }
});

