import z from 'zod'

const recoverySchema = z.object({
    usuarioid: z.number(),
    vchtoken: z.string()
})

export function validateRecovery(input) {
    return recoverySchema.safeParse(input)
}

export function validatePartialRecovery(input) {
    return recoverySchema.partial().safeParse(input)
}