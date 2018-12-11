class Conversation {

    constructor(hash: string) {
        this.hash = hash;
    }

    hash: string;
    feed: GUIChatFeedElement[] = new Array();
    add(message: GUIChatFeedElement) {
        this.feed.push(message);
    }
    load() {
        feedList.html('');
        this.feed.forEach(m => {
            var el = $(`<li class="list-group-item">
                            <span class="badge badge-secondary">${m.login}</span> <span>${m.message} </span>
                        </li>`);
            feedList.append(el);
        });
    }

}