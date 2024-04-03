import z from 'zod'

const lessorSchema = z.object({
    type_user: z.enum(["student", "lessor"]),
    name: z.string({
        required_error: 'User name is required.'
    }),
    last_name: z.string({
        required_error: 'User last name is required.'
    }),
    email: z.string().email(),
    password: z.string().min(8, {
        message: 'Must be 8 or more characters long'
    }),
    birthday: z.coerce.date().max(new Date(), {
        message: "Too young!"
    }),
    status: z.enum(["active", "inactive"]),
    image: z.string().url(),
    phone: z.string().superRefine((val, ctx) => {
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
    street: z.string(),
    zip: z.number().positive().int().min(10000).max(99999),
    suburb: z.string(),
    municipality: z.string(),
    state: z.string()
})

export function validateLessor(input) {
    return lessorSchema.safeParse(input)
}

export function validatePartialLessor(input) {
    return lessorSchema.partial().safeParse(input)
}