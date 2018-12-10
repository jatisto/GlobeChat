class GUIChannelListElement extends GUIElement implements GUIRenderable {
    constructor(parent: JQuery<HTMLElement>, channel:Channel) {
        super(parent);
        this.Channel = channel;
        var uc = this.Channel.userCount;
        this.selector = $(`<li class="list-group-item">
                        ${this.Channel.channelName}
                        <span class="badge ${getBadgeColor(uc)}">
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
    Channel: Channel;
    isVisible: boolean = false;
    readonly isRenderable: boolean = true;
}