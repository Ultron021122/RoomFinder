import z from 'zod'

const lessorSchema = z.object({
    vchname: z.string({
        required_error: 'User name is required.'
    }),
    vchpaternalsurname: z.string({
        required_error: 'User paternal surname is required.'
    }),
    vchmaternalsurname: z.string({
        required_error: 'User maternal surname is required.'
    }),
    vchemail: z.string().email(),
    vchpassword: z.string().min(8, {
        message: 'Must be 8 or more characters long'
    }),
    dtbirthdate: z.coerce.date().max(new Date(), {
        message: "Too young!"
    }),
    bnstatus: z.boolean(),
    bnverified: z.boolean(),
    vchimage: z.string().url(),
    vchcoverimage: z.string().optional(),
    roleid: z.number(),
    vchphone: z.string().superRefine((val, ctx) => {
        const phoneRegex = /^\d{10}$/; // Match a 10-digit phone number
        if (!phoneRegex.test(val)) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                min: 10,
                max: 10,
                message: "Invalid phone.",
            });
        }
    }),
    vchstreet: z.string(),
    intzip: z.number().positive().int().min(10000).max(99999),
    vchsuburb: z.string(),
    vchmunicipality: z.string(),
    vchstate: z.string(),
    vchbiography: z.string().nullable().optional()
})

export function validateLessor(input) {
    return lessorSchema.safeParse(input)
}

export function validatePartialLessor(input) {
    return lessorSchema.partial().safeParse(input)
}