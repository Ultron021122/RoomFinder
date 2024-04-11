export interface UserInfo {
    email: string;
    password: string;
}

export interface User {
    type_user: string;
    name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    status: string;
    birthday: string;
    profileImage: string;
}

export interface StudentInfo extends User {
    code_student: number;
    university: string;
    phone?: string;
    street?: string;
    zip?: number;
    suburb?: string;
    municipality?: string;
    state?: string;
}

export interface LessorInfo extends User {
    code_student?: number;
    university?: string;
    phone: string;
    street: string;
    zip: number;
    suburb: string;
    municipality: string;
    state: string;
}

export interface MapData {
    position: [number, number];
    zoom: number;
}

export interface MapCoordenada {
    geocode: [number, number];
    popUp: string;
}

export interface UniversityData {
    name: string;
    geocode: [number, number];
    popUp: string;
}