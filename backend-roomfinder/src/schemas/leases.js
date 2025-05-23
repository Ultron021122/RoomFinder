import z from 'zod'

const leasesSchema = z.object({
    propertyid: z.number(),
    studentid: z.number(),
    dtstartdate: z.string(),
    dtenddate: z.string(),
    decmonthlycost: z.number().positive(),
    leasestatusid: z.number().optional(),
    // lease_number: z.string().uuid().default(() => uuidv4()),
})

export function validateLeases(input) {
    return leasesSchema.safeParse(input)
}

export function validatePartialLeases(input) {
    return leasesSchema.partial().safeParse(input)
}