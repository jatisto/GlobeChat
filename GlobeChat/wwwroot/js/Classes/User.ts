class User implements GUIRenderable{    
    constructor(Login: string, Age: number, Gender:string ) {
        this.login = Login;
        this.age = Age;
        this.gender = Gender;       
    }
    login: string;
    gender: string;
    age: number;
    element!: GUIUserListElement;   
   
    isVisible: boolean = false;
    readonly isRenderable: boolean = true;

    Render(): void {
        this.element.Render();
    }
    Remove(): void {
        this.element.Remove();
    } 
}