import { Timer } from "../pokeballs/shared/interfaces/timer";

export interface User {
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    email: string | null;
    birthDate: Date | null;
    password: string | null;
    username: string | null;
    profilePicture: string | null;
    pokeBalls: number | null;
    timer: Timer | null;
}
