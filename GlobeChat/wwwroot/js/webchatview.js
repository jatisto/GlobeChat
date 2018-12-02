webix.ui({
    container: "webchatview",
    style: "flat",
    height: 800,
    rows: [
        {
            view: "list",
            type: "header", template: "My App!",
            data: "/api/channels"
        },
        {
            view: "list",
            autoConfig: true,
            data: {
                title: "My Fair Lady", year: 1964, votes: 533848, rating: 8.9, rank: 5
            }
        },
    ]
});
console.log("webchatview_init");
