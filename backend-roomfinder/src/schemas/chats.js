import z from 'zod'

const chatSchema = z.object({
    usuario1id: z.number({
        required_error: 'User 1 id is required.'
    }),
    usuario2id: z.number({
        required_error: 'User 2 id is required.'
    })
})

export function validateChat(input) {
    return chatSchema.safeParse(input)
}

export function validatePartialChat(input) {
    return chatSchema.partial().safeParse(input)
}