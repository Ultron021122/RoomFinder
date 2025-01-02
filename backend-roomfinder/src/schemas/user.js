import z from 'zod'

const userSchema = z.object({
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
    vchcoverimage: z.string().url().optional(),
    roleid: z.number()
})

export function validateUser(input) {
    return userSchema.safeParse(input)
}

export function validatePartialUser(input) {
    return userSchema.partial().safeParse(input)
}