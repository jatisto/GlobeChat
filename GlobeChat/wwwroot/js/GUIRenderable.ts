interface GUIRenderable {
    Render():void;
    Remove():void;
    isVisible: boolean;
    readonly isRenderable: boolean;
}
