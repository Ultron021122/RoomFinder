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
    intmonths: z.number().min(1).max(12),
    bnhaspets: z.boolean(), 
    dtstartdate: z.string(), 
    dtenddate: z.string(),
    bitConfirm: z.boolean().optional(),
})

export function validateRequest(input) {
    return requestSchema.safeParse(input)
}

export function validatePartialRequest(input) {
    return requestSchema.partial().safeParse(input)
}