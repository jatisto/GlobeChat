class GUIChannelListElement extends GUIElement implements GUIRenderable {
    constructor(parent: JQuery<HTMLElement>, channel:Channel, css?:string) {
        super(parent);
        this.Channel = channel;
        var uc = this.Channel.userCount;
        this.selector = $(`<li class="list-group-item channel-list-item">
                        ${this.Channel.channelName}
                        <span class="badge ${getBadgeColor(uc)} channel-badge">
                        ${uc} ${uc == 1 ? "user" : "users"}
                        </badge> </li>`);
    }
    Render(): void {       
        this.isVisible = true;       
        this.parent.append(this.selector)
    }
    Remove(): void {
        this.selector.remove();
    }
    Hide(): void {
        this.selector.hide();
        this.isVisible = false;
    }
    Channel: Channel;
    isVisible: boolean = false;
    readonly isRenderable: boolean = true;
}