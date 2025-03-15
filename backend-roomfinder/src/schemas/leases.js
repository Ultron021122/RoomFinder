import z from 'zod'

const leasesSchema = z.object({
    propertyid: z.number(),
    studentid: z.number(),
    dtstartdate: z.string(),
    dtenddate: z.string(),
    decmonthlycost: z.number().positive()
})

export function validateLeases(input) {
    return leasesSchema.safeParse(input)
}

export function validatePartialLeases(input) {
    return leasesSchema.partial().safeParse(input)
}