import z from 'zod'

const studentSchema = z.object({
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
    code_student: z.number().min(9).max(9),
    university: z.string()
})

export function validateStudent(input) {
    return studentSchema.safeParse(input)
}

export function validatePartialStudent(input) {
    return studentSchema.partial().safeParse(input)
} 