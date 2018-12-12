interface GUIRenderable {
    Render():void;
    Remove():void;
    Hide():void;
    isVisible: boolean;
    readonly isRenderable: boolean;
}
