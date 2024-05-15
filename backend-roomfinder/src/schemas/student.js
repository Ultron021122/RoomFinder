import z from 'zod'

const studentSchema = z.object({
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
    bnstatus: z.enum(["active", "inactive"]),
    vchimage: z.string().url(),
    roleid: z.number(),
    intcodestudent: z.number().positive(),
    vchuniversity: z.string()
})

export function validateStudent(input) {
    return studentSchema.safeParse(input)
}

export function validatePartialStudent(input) {
    return studentSchema.partial().safeParse(input)
} 