import z from 'zod'

const servicesSchema = z.object({
    intAccountParking: z.number(),
    bnWaterIncluded: z.boolean(),
    bnElectricityIncluded: z.boolean(),
    bnInternetIncluded: z.boolean(),
    bnGasIncluded: z.boolean(),
    bnHeatingIncluded: z.boolean(),
    bnAirConditioningIncluded: z.boolean(),
    bnLaundryIncluded: z.boolean(),
    bnParkingIncluded: z.boolean(),
    bnCleaningIncluded: z.boolean(),
    bnCableTVIncluded: z.boolean(),
    bnWashingMachineIncluded: z.boolean(),
    bnKitchen: z.boolean(),
    bnLivingRoom: z.boolean(),
    bnDiningRoom: z.boolean(),
    bnCoolerIncluded: z.boolean(),
    bnGardenIncluded: z.boolean(),
    bnWashingArea: z.boolean(),
});

const locationSchema = z.object({
    street: z.string(),
    zip: z.string().superRefine((val, ctx) => {
        const zipRegex = /^\d{5}$/; // Match a 5-digit zip code
        if (!zipRegex.test(val)) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                min: 5,
                max: 5,
                message: "Invalid zip"
            })
        }
    }),
    address: z.string(),
    suburb: z.string().optional(),
    municipality: z.string(),
    state: z.string(),
    country: z.string(),
    num_ext: z.string(),
    num_int: z.string().optional(),
    lat: z.number().min(-90).max(90, 'La latitud debe ser menor o igual a 90'),
    lng: z.number().min(-180).max(180, 'La longitud debe ser menor o igual a 180'),
});

const propertySchema = z.object({
    lessorid: z.number(),
    propertytypeid: z.number(),
    vchtitle: z.string().min(5, {
        message: 'Must be 5 or more characters long'
    }).max(60, {
        message: 'Must be less than 60 characters long'
    }),
    vchdescription: z.string().min(25),
    bnavailability: z.boolean(),
    intnumberrooms: z.number(),
    intnumberbeds: z.number(),
    intnumberbathrooms: z.number(),
    intmaxoccupancy: z.number(),
    objservices: servicesSchema,
    objphotos: z.array(z.string()).min(5, { message: 'Must have at least five photos' }),
    objlocation: locationSchema,
    decrentalcost: z.number().positive(),
    decpropertyrating: z.number().min(0).max(5),
    vchbuildingsecurity: z.string().optional(),
    vchtransportationaccess: z.string().optional(),
    intmincontractduration: z.number().min(1, { message: 'Must be at least 1 month' }),
    intmaxcontractduration: z.number().min(1, { message: 'Must be at least 1 month' }),
    vchfurnituretype: z.string().optional(),
    bnfurnished: z.boolean(),
    bnStudyZone: z.boolean(),
    vchpropertyrules: z.array(z.string()).min(1, { message: 'Must have at least one rule' }),
    dtavailabilitydate: z.string().datetime(),
})

export function validateProperty(input) {
    return propertySchema.safeParse(input)
}

export function validatePartialProperty(input) {
    return propertySchema.partial().safeParse(input)
}