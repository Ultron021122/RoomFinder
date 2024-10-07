import z from 'zod'

const propertySchema = z.object({
    lessor_id: z.number(),
    type_house: z.enum(['casa', 'departamento', 'habitación']),
    title: z.string().min(5, {
        message: 'Must be 5 or more characters long'
    }).max(60, {
        message: 'Must be less than 60 characters long'
    }),
    description: z.string().min(25),
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
    suburb: z.string(),
    municipality: z.string(),
    state: z.string(),
    country: z.string(),
    num_ext: z.string(),
    num_int: z.string().optional(),
    lat: z.number().min(-90).max(90, 'La latitud debe ser menor o igual a 90'),
    lng: z.number().min(-180).max(180, 'La longitud debe ser menor o igual a 180'),
    availability: z.enum([0, 1]),
    price: z.number().positive(),
    rules: z.array(z.string()).min(1, { message: 'Must have at least one rule' }),
})

export function validateProperty(input) {
    return propertySchema.safeParse(input)
}

export function validatePartialProperty(input) {
    return propertySchema.partial().safeParse(input)
}