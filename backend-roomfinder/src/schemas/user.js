import z from 'zod'

const userSchema = z.object({
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
    status: z.enum(["active", "inactive"])
})

export function validateUser(input) {
    return userSchema.safeParse(input)
}

export function validatePartialUser(input) {
    return userSchema.partial().safeParse(input)
}