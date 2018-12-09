class User {
    constructor(Login: string, Age: number, Gender:string ) {
        this.login = Login;
        this.age = Age;
        this.gender = Gender;       
    }
    login: string;
    gender: string;
    age: number;
    element!: GUIUserListElement;    
}