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
     * User Cover-Image
     * @example
     * vchcoverimage: 'https://example.com/image.jpg'
     */
    vchcoverimage: string;
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
 * Property interface to manage the map data
 * @interface
 */
export interface MapDataComponent {
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
    /**
     * Style property
     * @example
     */
    style?: string;
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
    /**
     * Type property
     * @example
     * typeProperty: 'Type property'
     */
    typeProperty: string;
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
    /**
     * Description
     * @example
     * description: 'Description'
     */
    vchdescription: string;
    /**
     * Title property
     * @example
     * vchtitle: 'Title property'
     */
    vchtitle: string;
    /**
     * Property rating
     * @example
     * decpropertyrating: 4.5
     */
    decpropertyrating: number;
    /**
     * Image url
     * @example
     * imageUrl: 'https://example.com/image.jpg'
     */
    imagenesUrl: ImageUrl[];
    /**
     * Property id
     * @example
     * propertyid: 1
     */
    propertyid: number;
}

/**
 * Interface to manage the image url
 * @interface 
 */
export interface ImageUrl {
    /**
     * Image id
     * @example
     * id: 1
     */
    id: number;
    /**
     * Image url
     * @example
     * url: 'https://example.com/image.jpg'
     */
    url: string;
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
    vchfurnituretype?: string;
    /**
     * Rental cost
     * @example
     * decrentalcost: 1000.00
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
     * vchpropertyrules: ['Property rules']
     */
    vchpropertyrules: string[];
    /**
     * Location property
     * @example
     * vchlocation: ['address', 'city', 'state', 'country'] 
     */
    vchlocation: LocationProperty;
    /**
     * Property images
     * @example
     * vchimages: ['https://example.com/image.jpg']
     */
    vchimages: string[];
    /**
     * Property services
     * @example
     * bnpropertyservices: [PropertyServices]
     */
    bnpropertyservices: PropertyServices[];
}
/**
 * Interface to manage the location property
 * @interface
 * @extends LocationProperty
 */
export interface LocationProperty {
    /**
     * Property address
     * @example
     * vchaddress: 'Property address'
     */
    vchaddress: string;
    /**
     * Property suburb
     * @example
     * vchsuburb: 'Property suburb'
     */
    vchsuburb: string;
    /**
     * Property municipality
     * @example
     * vchmunicipality: 'Property municipality'
     */
    vchmunicipality: string;
    /**
     * Property state
     * @example
     * vchstate: 'Property state'
     */
    vchstate: string;
    /**
     * Property country
     * @example
     * vchcountry: 'Property country'
     */
    vchcountry: string;
    /**
     * Property zip code
     * @example
     * intzipcode: 12345
     */
    intzipcode: number;
    /**
     * Property number exterior
     * @example
     * vchnumberexterior: 'Property number exterior'
     */
    vchnumberexterior: string;
    /**
     * Property number interior
     * @example
     * vchnumberinterior: 'Property number interior'
     */
    vchnumberinterior?: string;
    /**
     * Property latitude
     * @example
     * declatitude: 20.123456
     */
    declatitude: number;
    /**
     * Property longitude
     * @example
     * declongitude: -103.123456
     */
    declongitude: number;
}

/**
 * Interface to manage the property services
 * @interface
 * @extends PropertyServices
 */
export interface PropertyServices {
    /**
     * Include water
     * @example
     * bnwaterincluded: true | false
     */
    bnwaterincluded: boolean;
    /**
     * Include electricity
     * @example
     * bnelectricityincluded: true | false
     */
    bnelectricityincluded: boolean;
    /**
     * Included internet
     * @example
     * bninternetincluded: true | false
     */
    bninternetincluded: boolean;
    /**
     * Include gas
     * @example
     * bngasincluded: true | false
     */
    bngasincluded: boolean;
    /**
     * Include heating
     * @example
     * bnheatingincluded: true | false
     */
    bnheatingincluded: boolean;
    /**
     * Include laundry
     * @example
     * bnlaundryincluded: true | false
     */
    bnlaundryincluded: boolean;
    /**
     * Include parking
     * @example
     * bnparkingincluded: true | false
     */
    bnparkingincluded: boolean;
    /**
     * Count of parking
     * @example
     * intparkingcount: 1
     */
    intparkingcount: number;
    /**
     * Include cleaning
     * @example
     * bncleaningincluded: true | false
     */
    bncleaningincluded: boolean;
    /**
     * Include cable tv
     * @example
     * bncabletvincluded: true | false
     */
    bncabletvincluded: boolean;
}

/**
 * Interface to manage the property amenities
 * @interface
 * @extends PropertyAmenities
 */
export interface PropertyAmenities {
    /**
     * Include kitchen
     * @example
     * bnkitchenincluded: true | false
     */
    bnkitchenincluded: boolean;
    /**
     * Include refrigerator
     * @example
     * bnrefrigeratorincluded: true | false
     */
    bnrefrigeratorincluded: boolean;
    /**
     * Include dining room
     * @example
     * bndiningroomincluded: true | false
     */
    bndiningroomincluded: boolean;
    /**
     * Include living room
     * @example
     * bnlivingroomincluded: true | false
     */
    bnlivingroomincluded: boolean;
    /**
     * Include patio
     * @example
     * bnpatioincluded: true | false
     */
    bnpatioincluded: boolean;
    /**
     * Include laundry area
     * @example
     * bnlaundryareaincluded: true | false
     */
    bnlaundryareaincluded: boolean;
    /**
     * Include air conditioning
     * @example
     * bnairconditioningincluded: true | false
     */
    bnairconditioningincluded: boolean;
    /**
     * Include heating
     * @example
     * bnheatingincluded: true | false
     */
    bnheatingincluded: boolean;
    /**
     * Include washing machine
     * @example
     * bnwashingmachineincluded: true | false
     */
    bnwashingmachineincluded: boolean;
}

/**
 * Interface to manage Sidebar user props
 * @interface
 */
export interface SidebarUserProps {
    /**
     * User name
     * @example
     * vchname: 'User name'
     */
    vchname: string;
    /**
     * User paternal surname
     * @example
     * vchpaternalsurname: 'User last name'
     */
    vchpaternalsurname: string;
    /**
     * User maternal surname
     * @example
     * vchmaternalsurname: 'User email'
     */
    vchmaternalsurname: string;
    /**
     * User email
     * @example
     * vchemail: 'User email'
     */
    vchemail: string;
    /**
     * User image
     * @example
     * vchimage: 'User image'
     */
    vchimage: string;
    /**
     * User Cover-Image
     * @example
     * vchcoverimage: 'https://example.com/image.jpg'
     */
    vchcoverimage: string;
    /*
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
    /*
    * User verified
    * @example
    * bnverified: true | false
    */
    bnverified: boolean;
    /*
    * User status
    * @example
    * bnstatus: true | false
    */
    bnstatus: boolean;
    /*
    * User role id
    * @example
    * roleid: 1
    */
    roleid: number;
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
     * User Cover-Image
     * @example
     * vchcoverimage: 'https://example.com/image.jpg'
     */
    vchcoverimage: string;
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

/**
 * Interface to manage the users chats
 * @interface
 */
export interface UserList {
    /**
     * Users data
     * @example
     * data: [User]
     */
    data: User[];
}

/**
 * Interface to manage the messages
 * @interface
 */
export interface Message {
    /**
     * Message id
     * @example
     * messageid: 1
     */
    messageid?: number;
    /**
     * Message content
     * @example
     * vchcontenido: 'Message content'
     */
    vchcontenido: string;
    /**
     * User id
     * @example
     * usuarioid: 1
     */
    usuarioid: number;
    /**
     * Chat id
     * @example
     * chatid: 1
     */
    chatid: number;
    /**
     * Message created date
     * @example
     * created_at: '2021-11-22'
     */
    created_at: Date;
}


export interface Properties {
    lessorid: number;
    vchtitle: string;
    propertyid: number;
    propertytypeid: number | string;
    bnavailability: boolean;
    intnumberrooms: number;
    intnumberbeds: number;
    intnumberbathrooms: number;
    bnfurnished: boolean;
    vchfurnituretype: string;
    decrentalcost: string;
    dtavailabilitydate: string;
    intmincontractduration: number;
    intmaxcontractduration: number;
    decpropertyrating: string;
    bnstudyzone: boolean;
    vchbuildingsecurity: string;
    vchtransportationaccess: string;
    vchpropertyrules: string;
    vchdescription: string;
    bnwaterincluded: boolean;
    bnelectricityincluded: boolean;
    bninternetincluded: boolean;
    bngasincluded: boolean;
    bnheatingincluded: boolean;
    bnairconditioningincluded: boolean;
    bnlaundryincluded: boolean;
    bnparkingincluded: boolean;
    bncleaningincluded: boolean;
    bncabletvincluded: boolean;
    bnwashingmachineincluded: boolean;
    bnkitchen: boolean;
    bnlivingroom: boolean;
    bndiningroom: boolean;
    bncoolerincluded: boolean;
    bngardenincluded: boolean;
    bnwashingarea: boolean;
    intaccountparking: number;
    objphotos: Photos[];
    vchexteriornumber: string;
    vchinteriornumber: string | null;
    vchstreet: string;
    vchaddresscomplement: string;
    vchneighborhood: string;
    vchmunicipality: string;
    vchstateprovince: string;
    intzip: number;
    vchcountry: string;
    lat: number;
    lng: number;
    created_at: string;
}

export interface PropertyType {
    propertytypeid: number;
    vchtypename: string;
}

/**
 * Interface to manage the photos data
 * @interface 
 */
export interface Photos {
    /**
     * Image id
     * @example
     * id: 1
     */
    photoid: number;
    /**
     * Image url
     * @example
     * url: 'https://example.com/image.jpg'
     */
    url: string;
}