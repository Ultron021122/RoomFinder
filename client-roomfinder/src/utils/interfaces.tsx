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
    vchemail: string;
    /**
     * User password
     * @example
     * password: '****'
     */
    vchpassword: string;
}

/**
 * User interface to manage the user data
 * @interface
 */
export interface User {
    /**
     * User id
     * @example
     * usuarioid: 1
     */
    usuarioid: number | null;
    /**
     * User name
     * @example
     * vchname: 'Sebastian'
     */
    vchname: string;
    /**
     * User last name
     * @example
     * vchpaternalsurname: 'Martinez'
     */
    vchpaternalsurname: string;
    /**
     * User last name
     * @example
     * vchmaternalsurname: 'Lopez'
    */
    vchmaternalsurname: string;
    /**
     * User email
     * @example
     * vchemail: 'example@gmail.com'
     */
    vchemail: string;
    /**
     * User password
     * @example
     * vchpassword: '****'
     */
    vchpassword: string;
    /**
     * User confirm password
     * @example
     * confirm_password: '****'
     */
    confirm_password: string;
    /**
     * User status
     * @example
     * bnstatus: true | false
     */
    bnstatus: boolean;
    /**
     * User birthday
     * @example
     * dtbirthdate: '1999-11-22'
     */
    dtbirthdate: string;
    /**
     * User image
     * @example
     * vchimage: 'https://example.com/image.jpg'
     */
    vchimage: string;
    /**
     * User type
     * @example
     * roleid: 1
    */
    roleid: number;
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
     * intcodestudent: 123456
     */
    intcodestudent: number;
    /**
     * Student university
     * @example
     * vchuniversity: 'Centro Universitario'
     */
    vchuniversity: string;
    /**
     * Student phone
     * @example
     * vchphone: '1234567890'
     */
    vchphone?: string;
    /**
     * Student street
     * @example
     * vchstreet: 'Calle 123'
     */
    vchstreet?: string;
    /**
     * Student zip
     * @example
     * intzip: 12345
     */
    intzip?: number;
    /**
     * Student suburb
     * @example
     * vchsuburb: 'Colonia'
     */
    vchsuburb?: string;
    /**
     * Student municipality
     * @example
     * vchmunicipality: 'Municipio'
     */
    vchmunicipality?: string;
    /**
     * Student state
     * @example
     * state: 'Jalisco'
     */
    vchstate?: string;
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
    intcodestudent?: number;
    /**
     * University - Not required
     */
    vchuniversity?: string;
    /**
     * Phone
     * @example
     * vchphone: '1234567890'
     */
    vchphone: string;
    /**
     * Street
     * @example
     * vchstreet: 'Calle 123'
     */
    vchstreet: string;
    /**
     * Zip
     * @example
     * intzip: 12345
     */
    intzip: number;
    /**
     * Suburb
     * @example
     * vchsuburb: 'Colonia'
     */
    vchsuburb: string;
    /**
     * Municipality
     * @example
     * vchmunicipality: 'Municipio'
     */
    vchmunicipality: string;
    /**
     * State
     * @example
     * vchstate: 'Jalisco'
     */
    vchstate: string;
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
    /**
     * University description
     * @example
     * description: 'University description'
     */
    description: string;
    /**
     * University image url
     * @example
     * imageUrl: 'https://example.com/image.jpg'
     */
    imageUrl: string;
    /**
     * University website
     * @example
     * website: 'https://example.com'
     */
    website: string;
}

/**
 * Interface to manage the roles data
 * @interface
 */
export interface Roles {
    /**
     * Role id
     * @example
     * roleid: 1
     */
    roleid: number;
    /**
     * Role name
     * @example
     * vchname: 'Role name'
     */
    vchname: string;
    /**
     * Role description
     * @example
     * vchdescription: 'Role description'
     */
    vchdescription: string;
}
/**
 * Interface to manage the folders data
 * @interface
 */
export interface Folder {
    /**
     * Folder name
     * @example
     * name: 'Folder name'
     */
    name: string;
    /**
     * Folder path
     * @example
     * path: 'Folder path'
     */
    path: string;
}
/** 
 * Interface to manage the properties data
 * @interface
 */
export interface Property {
    /**
     * Property id
     * @example
     * propertyid: 1
     */
    propertyid: number | null;
    /**
     * Property Type id
     * @example
     * propertytypeid: 1
     */
    propertytypeid: number;
    /**
     * Lessor id
     * @example
     * lessorid: 1
     */
    lessorid: number;
    /**
     * Property title
     * @example
     * vchtitle: 'Property title'
     */
    vchtitle: string;
    /**
     * Property description
     * @example
     * vchdescription: 'Property description'
     */
    vchdescription: string;
    /**
     * Number of rooms
     * @example
     * intnumberrooms: 1
     */
    intnumberrooms: number;
    /**
     * Number of bathrooms
     * @example
     * intnumberbathrooms: 1
     */
    intnumberbathrooms: number;
    /**
     * Maximum occupancy
     * @example
     * intmaxoccupancy: 1
     */
    intmaxoccupancy: number;
    /**
     * Furnished
     * @example
     * bnfurnished: true | false
     */
    bnfurnished: boolean;
    /**
     * Furniture type
     * @example
     * vchfurnituretype: 'Furniture type'
     */
    vchfurnituretype: string;
    /**
     * Rental cost
     * @example
     * decrentalcost: 1000
     */
    decrentalcost: number;
    /**
     * Availability date
     * @example
     * dtavailabilitydate: '2021-11-22'
     */
    dtavailabilitydate: string;
    /**
     * Minimum contract duration
     * @example
     * intmincontractduration: 1
     */
    intmincontractduration: number;
    /**
     * Maximum contract duration
     * @example
     * intmaxcontractduration: 12
     */
    intmaxcontractduration: number;
    /**
     * Property rating
     * @example
     * decpropertyrating: 4.5
     */
    decpropertyrating: number;
    /**
     * Study zone
     * @example
     * bnstudyzone: true | false
     */
    bnstudyzone: boolean;
    /**
     * Building security
     * @example
     * vchbuildingsecurity: 'Building security'
     */
    vchbuildingsecurity: string;
    /**
     * Transportation access
     * @example
     * vchtransportationaccess: 'Transportation access'
     */
    vchtransportationaccess: string;
    /**
     * Property rules
     * @example
     * vchpropertyrules: 'Property rules'
     */
    vchpropertyrules: string;
}
/** 
 * Interface to manage user profile data (session)
 * @interface
 */
export interface UserProfile {
    /**
     * User name
     * @example
     * vchname: 'Sebastian'
     */
    vchname: string;
    /**
     * User last name
     * @example
     * vchpaternalsurname: 'Martinez'
     */
    vchpaternalsurname: string;
    /**
     * User last name
     * @example
     * vchmaternalsurname: 'Lopez'
     */
    vchmaternalsurname: string;
    /**
     * User email
     * @example
     * vchemail: 'example@gmail.com'
     */
    vchemail: string;
    /**
     * User image
     * @example
     * vchimage: 'https://example.com/image.jpg'
     */
    vchimage: string;
    /**
     * User id
     * @example
     * usuarioid: 1
     */
    usuarioid: number;
    /**
     * User session id
     * @example
     * sessionid: 1
     */
    sessionid: number;
    /**
     * User birthdate
     * @example
     * dtbirthdate: '1999-11-22'
     */
    dtbirthdate: string;
    /**
     * User verified
     * @example
     * bnverified: true | false
     */
    bnverified: boolean;
    /**
     * User status
     * @example
     * bnstatus: true | false
     */
    bnstatus: boolean;
    /**
     * User role id
     * @example
     * roleid: 1
     */
    roleid: number;
}