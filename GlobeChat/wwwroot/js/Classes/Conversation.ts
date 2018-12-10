
class Conversation {
    constructor(name: string, status: CONVERSATION_STATUS) {
        this.name = name;
        this.status = status;           
    }
    name: string;
    status: CONVERSATION_STATUS;
    private body!: JQuery<HTMLElement>;    
    feed: GUIChatFeedElement[] = new Array();
    get(): JQuery<HTMLElement>{
        this.feed.forEach(e => {
            this.body.html('');
            this.body.append(e.selector);
        })
        return this.body;
    }
    add(element: GUIChatFeedElement): void {
        this.feed.push(element);
    }
    
}