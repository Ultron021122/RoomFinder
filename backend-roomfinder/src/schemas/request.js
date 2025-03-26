import z from 'zod'

const requestSchema = z.object({
    propertyid: z.number({
        required_error: 'Property ID is required.'
    }),
    studentid: z.number({
        required_error: 'Student ID is required.'
    }), 
    statusid: z.number({
        required_error: 'Status ID is required.'
    }), 
    dtrequest: z.string().optional(), 
    vchmessage: z.string().min(25), 
    intnumguests: z.number().min(1), 
    bnhaspets: z.boolean(), 
    dtstartdate: z.string(), 
    dtenddate: z.string()
})

export function validateRequest(input) {
    return requestSchema.safeParse(input)
}

export function validatePartialRequest(input) {
    return requestSchema.partial().safeParse(input)
}