class Channel {
    constructor(channelName: string, userCount: number, id:number) {
        this.channelName = channelName;
        this.userCount = userCount;
        this.id = id;       
    }
    channelName: string;
    userCount: number;
    id: number;
    element!: GUIChannelListElement;
    Render(): void {
        this.element.Render();        
    }
    Remove(): void {
        this.element.Remove();
    }
}