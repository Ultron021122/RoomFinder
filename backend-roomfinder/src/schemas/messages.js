import z from 'zod'

const messageSchema = z.object({
    chatid: z.number(),
    vchcontenido: z.string({
        required_error: 'Message content is required.'
    }),
    created_at: z.date(),
    usuarioid: z.number()
})

export function validateMessage(input) {
    return messageSchema.safeParse(input)
}

export function validatePartialMessage(input) {
    return messageSchema.partial().safeParse(input)
}