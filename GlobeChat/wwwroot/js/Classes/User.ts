class User implements GUIRenderable{    
    constructor(Login: string, Age?: number, Gender?:string ) {
        this.login = Login;
        this.age = Age;
        this.gender = Gender;           
       
    }
    login: string;
    gender: string | undefined;
    age: number | undefined;
    element!: GUIUserListElement;      
    isVisible: boolean = false;
    invited: boolean = false;
    readonly isRenderable: boolean = true;

    Render(): void {
        this.element.Render();
    }
    Remove(): void {
        this.element.selector.remove();
    }
    Hide(): void {
        this.element.selector.hide();
        this.isVisible = false;
    }
    updateAvatar(): void{
        this.element.selector.find("img").css("background-color", "red");
    }
}