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
     * Verified user
     * @example
     * bnverified: true | false | null
     */
    bnverified: boolean;

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
    /**
     * User biography
     * @example
     * biography: estudiante dedicado del cucei
    */
    vchbiography?: string;
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
     * Student state
     * @example
     * state: 'Jalisco'
     */
    vchmajor: string;
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
    intzip?: string;
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
     * Student state
     */
    vchmajor?: string;
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
    intzip: string;
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
    /**
     * Rating
     * @example
     * rating: 1.0
     */
    rating: number;
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

export interface searchDistance extends UniversityData {
    fldistanceuniversity: number;
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
    intzipcode: string;
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
    /**
     * User biography
     * @example
     * biography: estudiante dedicado del cucei
    */
    vchbiography?: string;
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
    data: ChatUsers[];
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

/**
 * Interface representing property details.
 * @interface
 */
export interface Properties {
    /**
     * ID of the lessor.
     * @example 1
     */
    lessorid: number;

    /**
     * Title of the property.
     * @example "Beautiful Apartment"
     */
    vchtitle: string;

    /**
     * ID of the property.
     * @example 101
     */
    propertyid: number;

    /**
     * Type ID of the property.
     * @example 3
     */
    propertytypeid: number | string;

    /**
     * Availability status of the property.
     * @example true
     */
    bnavailability: boolean;

    /**
     * Number of rooms in the property.
     * @example 3
     */
    intnumberrooms: number;

    /**
     * Number of beds in the property.
     * @example 2
     */
    intnumberbeds: number;

    /**
     * Number of bathrooms in the property.
     * @example 2
     */
    intnumberbathrooms: number;

    /**
     * Indicates if the property is furnished.
     * @example true
     */
    bnfurnished: boolean;

    /**
     * Type of furniture in the property.
     * @example "Modern"
     */
    vchfurnituretype: string;

    /**
     * Rental cost of the property.
     * @example "1500.00"
     */
    decrentalcost: string;

    /**
     * Type property name
     * @example "Departamento"
     */
    vchtypename: string;

    /**
     * Availability date of the property.
     * @example "2025-03-01"
     */
    dtavailabilitydate: string;

    /**
     * Minimum contract duration in months.
     * @example 6
     */
    intmincontractduration: number;

    /**
     * Maximum contract duration in months.
     * @example 24
     */
    intmaxcontractduration: number;

    /**
     * Rating of the property.
     * @example 4.5
     */
    decpropertyrating: number;

    /**
     * Maximum occupancy of the property.
     * @example 4
     */
    intmaxoccupancy: number;

    /**
     * Indicates if the property has a study zone.
     * @example true
     */
    bnstudyzone: boolean;

    /**
     * Building security details.
     * @example "24/7 Security"
     */
    vchbuildingsecurity: string;

    /**
     * Transportation access details.
     * @example "Near bus stop"
     */
    vchtransportationaccess: string;

    /**
     * Property rules.
     * @example ["No smoking", "No pets"]
     */
    vchpropertyrules: string[];

    /**
     * Description of the property.
     * @example "A cozy apartment in the city center."
     */
    vchdescription: string;

    /**
     * Indicates if water is included.
     * @example true
     */
    bnwaterincluded: boolean;

    /**
     * Indicates if electricity is included.
     * @example true
     */
    bnelectricityincluded: boolean;

    /**
     * Indicates if internet is included.
     * @example true
     */
    bninternetincluded: boolean;

    /**
     * Indicates if gas is included.
     * @example true
     */
    bngasincluded: boolean;

    /**
     * Indicates if heating is included.
     * @example true
     */
    bnheatingincluded: boolean;

    /**
     * Indicates if air conditioning is included.
     * @example true
     */
    bnairconditioningincluded: boolean;

    /**
     * Indicates if laundry is included.
     * @example true
     */
    bnlaundryincluded: boolean;

    /**
     * Indicates if parking is included.
     * @example true
     */
    bnparkingincluded: boolean;

    /**
     * Indicates if cleaning services are included.
     * @example true
     */
    bncleaningincluded: boolean;

    /**
     * Indicates if cable TV is included.
     * @example true
     */
    bncabletvincluded: boolean;

    /**
     * Indicates if a washing machine is included.
     * @example true
     */
    bnwashingmachineincluded: boolean;

    /**
     * Indicates if the property has a kitchen.
     * @example true
     */
    bnkitchen: boolean;

    /**
     * Indicates if the property has a living room.
     * @example true
     */
    bnlivingroom: boolean;

    /**
     * Indicates if the property has a dining room.
     * @example true
     */
    bndiningroom: boolean;

    /**
     * Indicates if a cooler is included.
     * @example true
     */
    bncoolerincluded: boolean;

    /**
     * Indicates if a garden is included.
     * @example true
     */
    bngardenincluded: boolean;

    /**
     * Indicates if a washing area is included.
     * @example true
     */
    bnwashingarea: boolean;

    /**
     * Number of parking accounts.
     * @example 2
     */
    intaccountparking: number;

    /**
     * Photos of the property.
     * @example [{ photoid: 1, url: "https://example.com/photo1.jpg" }]
     */
    objphotos: Photos[];

    /**
     * Exterior number of the property.
     * @example "1234"
     */
    vchexteriornumber: string;

    /**
     * Interior number of the property (if applicable).
     * @example "Apt 4B"
     */
    vchinteriornumber: string | null;

    /**
     * Street name of the property.
     * @example "Main St"
     */
    vchstreet: string;

    /**
     * Address complement.
     * @example "Near the park"
     */
    vchaddresscomplement: string;

    /**
     * Neighborhood of the property.
     * @example "Downtown"
     */
    vchneighborhood: string;

    /**
     * Municipality of the property.
     * @example "Springfield"
     */
    vchmunicipality: string;

    /**
     * State or province of the property.
     * @example "Illinois"
     */
    vchstateprovince: string;

    /**
     * ZIP code of the property.
     * @example 62704
     */
    intzip: string;

    /**
     * Country of the property.
     * @example "USA"
     */
    vchcountry: string;

    /**
     * Latitude of the property.
     * @example 39.7817
     */
    lat: number;

    /**
     * Longitude of the property.
     * @example -89.6501
     */
    lng: number;

    /**
     * Creation date of the property record.
     * @example "2025-01-01T12:00:00Z"
     */
    created_at: string;

    /**
     * Área
     * @example "15"
     */
    decarea: number;

    /**
     * Distance university
     * @example 6.87
     */
    fldistanceuniversity: number;

    /**
     * Additional features
     * @example "Additional features"
     */
    vchadditionalfeatures: string;

    /**
     * University
     * @example "Centro Universitario"
     */
    vchuniversity: string;
}

/**
 * Interface representing property type details.
 * @interface
 */
export interface PropertyType {
    /**
     * ID of the property type.
     * @example 1
     */
    propertytypeid: number;

    /**
     * Name of the property type.
     * @example "Apartment"
     */
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

export interface ChatUsers {
    /**
     * ID del usuario
     * @example 1
     */
    usuarioid: number;

    /**
     * Nombre del usuario
     * @example "Sebastián"
     */
    vchname: string;

    /**
     * Apellido paterno del usuario
     * @example "Martínez"
     */
    vchpaternalsurname: string;

    /**
     * Apellido materno del usuario
     * @example "López"
     */
    vchmaternalsurname: string;

    /**
     * Correo electrónico del usuario
     * @example "smldeveloper02@gmail.com"
     */
    vchemail: string;

    /**
     * Contraseña del usuario (hash)
     * @example "$2b$10$4k1dM5488iBj6FzsNNmV0uUqOuOXrRyhY/Si.GZDtZm7g9QMf.HeW"
     */
    vchpassword: string;

    /**
     * User confirm password
     * @example
     * confirm_password: '****'
     */
    confirm_password: string;

    /**
     * Fecha de nacimiento del usuario
     * @example "2006-12-31T06:00:00.000Z"
     */
    dtbirthdate: string;

    /**
     * Estado del usuario (activo/inactivo)
     * @example true
     */
    bnstatus: boolean;

    /**
     * Verificación del usuario (verificado/no verificado)
     * @example true
     */
    bnverified: boolean;

    /**
     * User biography
     * @example
     * biography: estudiante dedicado del cucei
    */
    vchbiography?: string;

    /**
     * URL de la imagen del usuario
     * @example "https://res.cloudinary.com/dal8aivch/image/upload/v1719809427/students/anvzbjybzttfigrojik4.jpg"
     */
    vchimage: string;

    /**
     * URL de la imagen de portada del usuario
     * @example "https://res.cloudinary.com/dal8aivch/image/upload/v1731048985/users/tjkw3e6zxkjhqacr4fpm.jpg"
     */
    vchcoverimage: string;

    /**
     * ID del rol del usuario
     * @example 1
     */
    roleid: number;

    /**
     * Fecha de creación del usuario
     * @example "2024-09-12T04:25:49.293Z"
     */
    created_at: string;

    /**
     * Código de estudiante
     * @example "220976438"
     */
    intcodestudent?: string;

    /**
     * Universidad del usuario
     * @example "Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI)"
     */
    vchuniversity?: string;

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
    intzip?: string;
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

    /**
     * Código de estudiante
     * @example "220976438"
     */
    intcodestudent2?: string;

    /**
     * Universidad del usuario
     * @example "Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI)"
     */
    vchuniversity2?: string;

    /**
     * Student phone
     * @example
     * vchphone: '1234567890'
    */
    vchphone2?: string;
    /**
     * Student street
     * @example
     * vchstreet: 'Calle 123'
     */
    vchstreet2?: string;
    /**
     * Student zip
     * @example
     * intzip: 12345
     */
    intzip2?: string;
    /**
     * Student suburb
     * @example
     * vchsuburb: 'Colonia'
     */
    vchsuburb2?: string;
    /**
     * Student municipality
     * @example
     * vchmunicipality: 'Municipio'
     */
    vchmunicipality2?: string;
    /**
     * Student state
     * @example
     * state: 'Jalisco'
     */
    vchstate2?: string;

    /**
     * ID del usuario 2
     * @example 2
     */
    usuarioid2: number;

    /**
     * Nombre del usuario
     * @example "Sebastián"
     */
    vchname2: string;

    /**
     * Apellido paterno del usuario
     * @example "Martínez"
     */
    vchpaternalsurname2: string;

    /**
     * Apellido materno del usuario
     * @example "López"
     */
    vchmaternalsurname2: string;

    /**
     * Correo electrónico del usuario
     * @example "smldeveloper02@gmail.com"
     */
    vchemail2: string;

    /**
     * Contraseña del usuario (hash)
     * @example "$2b$10$4k1dM5488iBj6FzsNNmV0uUqOuOXrRyhY/Si.GZDtZm7g9QMf.HeW"
     */
    vchpassword2: string;

    /**
     * Fecha de nacimiento del usuario
     * @example "2006-12-31T06:00:00.000Z"
     */
    dtbirthdate2: string;

    /**
     * Estado del usuario (activo/inactivo)
     * @example true
     */
    bnstatus2: boolean;

    /**
     * Verificación del usuario (verificado/no verificado)
     * @example true
     */
    bnverified2: boolean;

    /**
     * URL de la imagen del usuario
     * @example "https://res.cloudinary.com/dal8aivch/image/upload/v1719809427/students/anvzbjybzttfigrojik4.jpg"
     */
    vchimage2: string;

    /**
     * URL de la imagen de portada del usuario
     * @example "https://res.cloudinary.com/dal8aivch/image/upload/v1731048985/users/tjkw3e6zxkjhqacr4fpm.jpg"
     */
    vchcoverimage2: string;

    /**
     * ID del rol del usuario
     * @example 1
     */
    roleid2: number;

    /**
     * Fecha de creación del usuario
     * @example "2024-09-12T04:25:49.293Z"
     */
    created_at2: string;

    /**
     * ID del mensaje
     * @example 80
     */
    messageid: number;

    /**
     * ID del chat
     * @example 2
     */
    chatid: number;

    /**
     * Contenido del mensaje
     * @example "cvcv"
     */
    vchcontenido: string;

    /**
     * Fecha del mensaje
     * @example "2024-09-27T11:17:55.862Z"
     */
    dtmessage: string;
}

export interface User2 {
    /**
 * ID del usuario 2
 * @example 2
 */
    usuarioid2: number;

    /**
     * Nombre del usuario
     * @example "Sebastián"
     */
    vchname2: string;

    /**
     * Apellido paterno del usuario
     * @example "Martínez"
     */
    vchpaternalsurname2: string;

    /**
     * Apellido materno del usuario
     * @example "López"
     */
    vchmaternalsurname2: string;

    /**
     * Correo electrónico del usuario
     * @example "smldeveloper02@gmail.com"
     */
    vchemail2: string;

    /**
     * Contraseña del usuario (hash)
     * @example "$2b$10$4k1dM5488iBj6FzsNNmV0uUqOuOXrRyhY/Si.GZDtZm7g9QMf.HeW"
     */
    vchpassword2: string;

    /**
     * Fecha de nacimiento del usuario
     * @example "2006-12-31T06:00:00.000Z"
     */
    dtbirthdate2: string;

    /**
     * Estado del usuario (activo/inactivo)
     * @example true
     */
    bnstatus2: boolean;

    /**
     * Verificación del usuario (verificado/no verificado)
     * @example true
     */
    bnverified2: boolean;

    /**
     * URL de la imagen del usuario
     * @example "https://res.cloudinary.com/dal8aivch/image/upload/v1719809427/students/anvzbjybzttfigrojik4.jpg"
     */
    vchimage2: string;

    /**
     * URL de la imagen de portada del usuario
     * @example "https://res.cloudinary.com/dal8aivch/image/upload/v1731048985/users/tjkw3e6zxkjhqacr4fpm.jpg"
     */
    vchcoverimage2: string;

    /**
     * ID del rol del usuario
     * @example 1
     */
    roleid2: number;

    /**
     * Fecha de creación del usuario
     * @example "2024-09-12T04:25:49.293Z"
     */
    created_at2: string;
}


/**
 * User interface to manage the user data Edit
 * @interface
 */
export interface UserEdit {
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
     * User birthday
     * @example
     * dtbirthdate: '1999-11-22'
     */
    dtbirthdate: string;
    /**
     * User type
     * @example
     * roleid: 1
    */
    roleid: number;
    /**
     * User biography
     * @example
     * biography: estudiante dedicado del cucei
    */
    vchbiography: string;
}

/**
 * Student interface to manage the student data Edit
 * @interface
 * @extends User
 */
export interface StudentEdit extends UserEdit {
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
     * Student state
     * @example
     * state: 'Jalisco'
     */
    vchmajor: string;
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
    intzip?: string;
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
 * Lessor interface to manage the lessor data Edit
 * @interface
 * @extends User
 */
export interface LessorEdit extends UserEdit {
    /**
     * Code student - Not required
     */
    intcodestudent?: number;
    /**
     * University - Not required
     */
    vchuniversity?: string;
    /**
     * Student state
     */
    vchmajor?: string;
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
    intzip: string;
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
 * Interface to manage the request from the user
 * @interface
 */
export interface LeaseRequest {
    /**
     * Request id
     * @example
     * requestid: 1
     */
    requestid: number;
    /**
     * Property id
     * @example
     * propertyid: 1
     */
    propertyid: number;
    /**
     * Student id
     * @example
     * studentid: 1
     */
    studentid: number;
    /**
     * Status id
     * @example
     * statusid: 2
     */
    statusid: number;
    /**
     * Request date
     * @example
     * dtrequest: '2025-01-01'
     */
    dtrequest: string;
    /**
     * Message content
     * @example
     * vchmessage: 'Solicitud'
     */
    vchmessage: string;
    /**
     * Number guests
     * @example
     * intnumguests: 2
     */
    intnumguests: number;
    /**
     * Number months
     * @example
     * intmonths: 2
     */
    intmonths: number;
    /**
     * Has pets
     * @example
     * bnhaspets: true
     */
    bnhaspets: boolean;
    /**
     * Start date
     * @example
     * dtstartdate: '2025-01-01'
     */
    dtstartdate: string;
    /**
     * End date
     * @example
     * dtenddate: '2025-01-01'
     */
    dtenddate: string;
    /**
     * Created at
     * @example
     * created_at: '2025-01-01'
     */
    created_at: string;
    /**
     * Updated at
     * @example
     * updated_at: '2025-01-01'
     */
    updated_at: string;
    /**
     * Confirmed
     * @example
     * bitconfirm: false
     */
    bitconfirm?: boolean;
}

/**
 * Interface to manage the request from the user
 * @interface
 */
export interface vwLeaseRequest {
    /**
     * Request id
     * @example
     * requestid: 1
     */
    requestid: number;
    /**
     * Property id
     * @example
     * propertyid: 1
     */
    propertyid: number;
    /**
     * Student id
     * @example
     * studentid: 1
     */
    studentid: number;
    /**
     * Status id
     * @example
     * statusid: 2
     */
    statusid: number;
    /**
     * Request date
     * @example
     * dtrequest: '2025-01-01'
     */
    dtrequest: string;
    /**
     * Message content
     * @example
     * vchmessage: 'Solicitud'
     */
    vchmessage: string;
    /**
     * Number guests
     * @example
     * intnumguests: 2
     */
    intnumguests: number;
    /**
     * Number months
     * @example
     * intmonths: 2
     */
    intmonths: number;
    /**
     * Has pets
     * @example
     * bnhaspets: true
     */
    bnhaspets: boolean;
    /**
     * Start date
     * @example
     * dtstartdate: '2025-01-01'
     */
    dtstartdate: string;
    /**
     * End date
     * @example
     * dtenddate: '2025-01-01'
     */
    dtenddate: string;
    /**
     * Created at
     * @example
     * created_at: '2025-01-01'
     */
    created_at: string;
    /**
     * Updated at
     * @example
     * updated_at: '2025-01-01'
     */
    updated_at: string;
    /**
     * Confirmed
     * @example
     * bitConfirm: false
     */
    bitconfirm?: boolean;
    vchtitle: string;
    vchdescription: string;
    propertytypeid: number;
    lessorid: number;
    vchname: string;
    vchpaternalsurname: string;
    vchmaternalsurname: string;
    decrentalcost: number;
    vchstudentname: string;
    vchstudentpaternalsurname: string;
    vchstudentmaternalsurname: string;
}

/**
 * Interface representing request status details.
 */
export interface RequestStatus {
    /**
     * Status id
     * @example
     * statusid: 1
     */
    statusid: number;
    /**
     * Status name
     * @example
     * vchstatusid: 'Aceptado'
     */
    vchstatusname: string;
    /**
     * Active
     * @example
     * bnactive: true
     */
    bnactive: boolean;
    /**
     * Created date
     * @example
     * created_at: '1990-01-01'
     */
    created_at: string;
    /**
     * Updated date
     * @example
     * update_at: '1990-01-01'
     */
    update_at: string;
}

/**
 * Interface representing lease status details.
 */
export interface LeaseStatus {
    /**
     * Lease status id
     * @example
     * leasestatusid: 1
     */
    leasestatusid: number;
    /**
     * Status name
     * @example
     * vchstatusid: 'Aceptado'
     */
    vchstatusname: string;
    /**
     * Active
     * @example
     * bnactive: true
     */
    bnactive: boolean;
    /**
     * Created date
     * @example
     * created_at: '1990-01-01'
     */
    created_at: string;
    /**
     * Updated date
     * @example
     * update_at: '1990-01-01'
     */
    update_at: string;
}

/**
 * Interface representing property opinions
 */
export interface PropertyOpinions {
    /**
     * Review ID
     * @example
     * reviewid: 1
     */
    reviewid: number | null;
    /**
     * Property ID
     * @example
     * propertyid: 1
     */
    propertyid: number;
    /**
     * Student id
     * @example
     * studentid: 1
     */
    studentid: number;
    /**
     * Rating
     * @example
     * decrating: 1.1
     */
    decrating: number;
    /**
     * Comment
     * @example
     * vchcomment: 'Comentario'
     */
    vchcomment: string;
    /**
     * Created
     * @example
     * created_at = '2025-01-01'
     */
    created_at: string;
    /**
     * Updated
     * @example
     * updated_at = '2025-01-01'
     */
    updated_at: string;
    /**
     * Name
     * @example
     * vchname: 'Name'
     */
    vchname: string;
    /**
     * Paternal surname
     * @example
     * vchpaternalsurname: 'Paternalsurname'
     */
    vchpaternalsurname: string;
    /**
     * Maternal surname
     * @example
     * vchmaternalsurname: 'Maternal surname';
     */
    vchmaternalsurname: string;
    /**
     * Image
     * @example
     * vchimage: 'http://url.com'
     */
    vchimage: string;
    /**
     * Role ID
     * @example
     * roleid: 1;
     */
    roleid: number;

}

/**
 * Interface representing coordinates
 */
export interface Coordinate {
    /**
     * Latitude
     * @example
     * lat: 12.25
     */
    lat: number;
    /**
     * Longitute
     * @example
     * lng: 12.25
     */
    lng: number;
}

/**
 * Interface representing the request history
 * @interface
 */
export interface RequestHistory {
    /**
     * Request id
     * @example
     * requestid: 1
     */
    requestid: number;
    /**
     * Property id
     * @example
     * propertyid: 1
     */
    propertyid: number;
    /**
     * Student id
     * @example
     * studentid: 1
     */
    studentid: number;
    /**
     * Status id
     * @example
     * statusid: 1
     */
    statusid: number;
    /**
     * Request date
     * @example
     * dtrequest: '2025-01-01'
     */
    dtrequest: string;
    /**
     * Message content
     * @example
     * vchmessage: 'Solicitud'
     */
    vchmessage: string;
    /**
     * Number guests
     * @example
     * intnumguests: 2
     */
    intnumguests: number;
    /**
     * Has pets
     * @example
     * bnhaspets: true
     */
    intmonths: number;
    /**
     * Has pets
     * @example
     * bnhaspets: true
     */
    bnhaspets: boolean;
    /**
     * Start date
     * @example
     * dtstartdate: '2025-01-01'
     */
    dtstartdate: string;
    /**
     * End date
     * @example
     * dtenddate: '2025-01-01'
     */
    dtenddate: string;
    /**
     * Created date
     * @example
     * created_at: '2025-01-01'
     */
    created_at: string;
    /**
     * Updated date
     * @example
     * updated_at: '2025-01-01'
     */
    updated_at: string;

}

/**
 * Interface representing the request history
 * @interface
 */
export interface vwLeasesGET {
    /**
     * Lease id
     * @example
     * leasesid: 1
     */
    leasesid: number;
    /**
     * Property id
     * @example
     * propertyid: 1
     */
    propertyid: number;
    /**
     * Student id
     * @example
     * studentid: 1
     */
    studentid: number;
    /**
     * Start date
     * @example
     * dtstartdate: '2025-01-01'
     */
    dtstartdate: string;
    /**
     * End date
     * @example
     * dtenddate: '2025-01-01'
     */
    dtenddate: string;
    /**
     * Monthly cost
     * @example
     * decmonthlycost: 1500.00
     */
    decmonthlycost: number;
    /**
     * Created date
     * @example
     * created_at: '2025-01-01'
     */
    created_at: string;
    /**
     * Status id
     * @example
     * leasestatusid: 1
     */
    leasestatusid: number;
    /**
     * Lease number
     * @example
     * lease_number: 'UU-123456'
     */
    lease_number: string;
    /**
     * Request id
     * @example
     * requestid: 1
     */
    requestid: number;
    /**
     * Description
     * @example
     * vchdescription: 'Description'
     */
    vchdescription: string;
    /**
     * Property title
     * @example
     * vchtitle: 'Property Title'
     */
    vchtitle: string;
    /**
     * Property type id
     * @example
     * propertytypeid: 1
     */
    propertytypeid: number;
    /**
     * Property type name
     * @example
     * vchtypename: 'Property Type Name'
     */
    vchtypename: string;
    /**
     * Property status name
     * @example
     * vchstatusname: 'Property Status Name'
     */
    vchstatusname: string;
    /**
     * Student name
     * @example
     * vchstudentname: 'Student Name'
     */
    vchstudentname: string;
    /**
     * Student paternal surname
     * @example
     * vchstudentpaternalsurname: 'Paternalsurname'
     */
    vchstudentpaternalsurname: string;
    /**
     * Student maternal surname
     * @example
     * vchstudentmaternalsurname: 'Maternal surname';
     */
    vchstudentmaternalsurname: string;
    /**
     * Lessor ID
     * @example
     * lessorid: 1
     */
    lessorid: number;
    /**
     * Lessor name
     * @example
     * vchlessorname: 'Lessor Name'
     */
    vchlessorname: string;
    /**
     * Lessor paternal surname
     * @example
     * vchlessorpaternalsurname: 'Paternalsurname'
     */
    vchlessorpaternalsurname: string;
    /**
     * Lessor maternal surname
     * @example
     * vchlessormaternalsurname: 'Maternal surname';
     */
    vchlessormaternalsurname: string;
}

/**
 * Interface representing the orders of the properties
 * @interface
 */
export interface Orders {
    /**
     * Order id
     * @example
     * orderid: 1
     */
    orderid: number;
    /**
     * Leases id
     * @example
     * leasesid: 1
     */
    leasesid: number;
    /**
     * Amount
     * @example
     * amount: 1500.00
     */
    amount: number;
    /**
     * Status
     * @example
     * status: 'Pending'
     */
    status: string;
    /**
     * Created date
     * @example
     * created_at: '2025-01-01'
     */
    created_at: string;
    /**
     * Updated date
     * @example
     * updated_at: '2025-01-01'
     */
    updated_at: string;
    /**
     * Concept
     * @example
     * vchconcept: 'Rent payment'
     */
    vchconcept: string;
    /**
     * Bit payment
     * @example
     * bitpayment: true
     */
    bitpayment: boolean;
}

/**
 * Interface representing the orders of the properties
 * @interface
 */
export interface vwOrders {
    /**
     * Order id
     * @example
     * orderid: 1
     */
    orderid: number;
    /**
     * Leases id
     * @example
     * leasesid: 1
     */
    leasesid: number;
    /**
     * Amount
     * @example
     * amount: 1500.00
     */
    amount: number;
    /**
     * Status
     * @example
     * status: 'Pending'
     */
    status: string;
    /**
     * Created date
     * @example
     * created_at: '2025-01-01'
     */
    created_at: string;
    /**
     * Updated date
     * @example
     * updated_at: '2025-01-01'
     */
    updated_at: string;
    /**
     * Concept
     * @example
     * vchconcept: 'Rent payment'
     */
    vchconcept: string;
    /**
     * Bit payment
     * @example
     * bitpayment: true
     */
    bitpayment: boolean;
    /**
     * Property id
     * @example
     * propertyid: 101
     */
    propertyid: number;
    /**
     * Student id
     * @example
     * studentid: 202
     */
    studentid: number;
    /**
     * Start date
     * @example
     * dtstartdate: '2025-01-01'
     */
    dtstartdate: string;
    /**
     * End date
     * @example
     * dtenddate: '2025-12-31'
     */
    dtenddate: string;
    /**
     * Monthly cost
     * @example
     * decmonthlycost: 1500.00
     */
    decmonthlycost: number;
    /**
     * Lease status id
     * @example
     * leasestatusid: 1
     */
    leasestatusid: number;
    /**
     * Lease number
     * @example
     * lease_number: 'A123'
     */
    lease_number: string;
    /**
     * Request id
     * @example
     * requestid: 303
     */
    requestid: number;
    /**
     * Lessor id
     * @example
     * lessorid: 404
     */
    lessorid: number;
    /**
     * Lessor name
     * @example
     * vchlessorname: 'John'
     */
    vchlessorname: string;
    /**
     * Lessor paternal surname
     * @example
     * vchlessorpaternalsurname: 'Doe'
     */
    vchlessorpaternalsurname: string;
    /**
     * Lessor maternal surname
     * @example
     * vchlessormaternalsurname: 'Smith'
     */
    vchlessormaternalsurname: string;
    /**
     * Lessor email
     * @example
     * vchlessoremail: 'john.doe@example.com'
     */
    vchlessoremail: string;
    /**
     * Lessor status
     * @example
     * bnstatus: true
     */
    bnstatus: boolean;
    /**
     * Lessor role id
     * @example
     * roleid: 1
     */
    roleid: number;
    /**
     * Lessor cover image
     * @example
     * vchleassorcoverimage: 'image_url_here'
     */
    vchleassorcoverimage: string;
    /**
     * Lessor biography
     * @example
     * vchleassorbiography: 'Lessor biography here...'
     */
    vchleassorbiography: string;
    /**
     * Student name
     * @example
     * vchstudentname: 'Alice'
     */
    vchstudentname: string;
    /**
     * Student paternal surname
     * @example
     * vchstudentpaternalsurname: 'Johnson'
     */
    vchstudentpaternalsurname: string;
    /**
     * Student maternal surname
     * @example
     * vchstudentmaternalsurname: 'Brown'
     */
    vchstudentmaternalsurname: string;
    /**
     * Student email
     * @example
     * vchstudentemail: 'alice.johnson@example.com'
     */
    vchstudentemail: string;
    /**
     * Student image
     * @example
     * vchimage: 'student_image_url_here'
     */
    vchimage: string;
    /**
     * Student role id
     * @example
     * studentroleid: 2
     */
    studentroleid: number;
    /**
     * Student cover image
     * @example
     * vchstudentcoverimage: 'student_cover_image_url_here'
     */
    vchstudentcoverimage: string;
    /**
     * Student biography
     * @example
     * vchstudentbiography: 'Student biography here...'
     */
    vchstudentbiography: string;

    objphotos: Photos[];
}