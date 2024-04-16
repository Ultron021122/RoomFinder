/**
 * Interface to manage the user data
 * @interface
 */
export interface UserInfo {
    /**
     * User email
     * @example
     * email: 'example@gmail.com'
     */
    email: string;
    /**
     * User password
     * @example
     * password: '****'
     */
    password: string;
}

/**
 * User interface to manage the user data
 * @interface
 */
export interface User {
    /**
     * User type
     * @example
     * type_user: 'student' | 'lessor'
     */
    type_user: string;
    /**
     * User name
     * @example
     * name: 'Sebastian'
     */
    name: string;
    /**
     * User last name
     * @example
     * last_name: 'Martinez'
     */
    last_name: string;
    /**
     * User email
     * @example
     * email: 'example@gmail.com'
     */
    email: string;
    /**
     * User password
     * @example
     * password: '****'
     */
    password: string;
    /**
     * User confirm password
     * @example
     * confirm_password: '****'
     */
    confirm_password: string;
    /**
     * User status
     * @example
     * status: 'active' | 'inactive'
     */
    status: string;
    /**
     * User birthday
     * @example
     * birthday: '1999-11-22'
     */
    birthday: string;
    /**
     * User image
     * @example
     * image: 'https://example.com/image.jpg'
     */
    image: string;
}

/**
 * Student interface to manage the student data
 * @interface
 * @extends User
 */
export interface StudentInfo extends User {
    /**
     * Student code
     * @example
     * code_student: 123456
     */
    code_student: number;
    /**
     * Student university
     * @example
     * university: 'Centro Universitario'
     */
    university: string;
    /**
     * Student phone
     * @example
     * phone: '1234567890'
     */
    phone?: string;
    /**
     * Student street
     * @example
     * street: 'Calle 123'
     */
    street?: string;
    /**
     * Student zip
     * @example
     * zip: 12345
     */
    zip?: number;
    /**
     * Student suburb
     * @example
     * suburb: 'Colonia'
     */
    suburb?: string;
    /**
     * Student municipality
     * @example
     * municipality: 'Municipio'
     */
    municipality?: string;
    /**
     * Student state
     * @example
     * state: 'active' | 'inactive'
     */
    state?: string;
}

/**
 * Lessor interface to manage the lessor data
 * @interface
 * @extends User
 */
export interface LessorInfo extends User {
    /**
     * Code student - Not required
     */
    code_student?: number;
    /**
     * University - Not required
     */
    university?: string;
    /**
     * Phone
     * @example
     * phone: '1234567890'
     */
    phone: string;
    /**
     * Street
     * @example
     * street: 'Calle 123'
     */
    street: string;
    /**
     * Zip
     * @example
     * zip: 12345
     */
    zip: number;
    /**
     * Suburb
     * @example
     * suburb: 'Colonia'
     */
    suburb: string;
    /**
     * Municipality
     * @example
     * municipality: 'Municipio'
     */
    municipality: string;
    /**
     * State
     * @example
     * state: 'active' | 'inactive'
     */
    state: string;
}

/**
 * Property interface to manage the property data
 * @interface
 */
export interface MapData {
    /**
     * Property name
     * @example
     * name: 'Property name'
     */
    name: string;
    /**
     * Property position
     * @example
     * position: [20.123456, -103.123456]
     */
    position: [number, number];
    /**
     * Property zoom
     * @example
     * zoom: 15
     */
    zoom: number;
}

/**
 * Interface to manage the map coordinates
 * @interface
 */
export interface MapCoordenada {
    /**
     * Geocode latitude and longitude
     * @example
     * geocode: [20.123456, -103.123456]
     */
    geocode: [number, number];
    /**
     * Popup message
     * @example
     * popUp: 'Popup message'
     */
    popUp: string;
}

/**
 * Interface to manage the university data
 * @interface
 */
export interface UniversityData {
    /**
     * University name
     * @example
     * name: 'University name'
     */
    name: string;
    /**
     * University geocode latitude and longitude
     * @example
     * geocode: [20.123456, -103.123456]
     */
    geocode: [number, number];
    /**
     * University popup message
     * @example
     * popUp: 'Popup message'
     */
    popUp: string;
}

/**
 * Interface to manage the roles data
 * @interface
 */
export interface Roles {
    /**
     * Role name
     * @example
     * name: 'Role name'
     */
    name: string;
    /**
     * Role value
     * @example
     * value: 'Role value'
     */
    value: string;
}