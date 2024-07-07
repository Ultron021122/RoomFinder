import z from 'zod'

const sessionSchema = z.object({
    sessionid: z.number(),
    usuarioid: z.number(),
    tmlogintime: z.date(),
    tmlastactivity: z.date(),
    vchipaddress: z.string(),
});

export function validateSession(input) {
    return sessionSchema.safeParse(input)
}

export function validatePartialSession(input) {
    return sessionSchema.partial().safeParse(input)
}