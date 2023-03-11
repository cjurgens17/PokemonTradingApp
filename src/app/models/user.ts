export class User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    admin: boolean;

    constructor(id: number, email: string, password: string, firstName: string, lastName: string, address: string, admin: boolean){
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.admin = admin;
    }
}