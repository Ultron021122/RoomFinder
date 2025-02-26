import z from 'zod'

const reviewSchema = z.object({
    propertyid: z.number({
        required_error: 'Property ID is required.'
    }),
    studentid: z.number({
        required_error: 'Student ID is required.'
    }),
    decrating: z.number().min(0).max(5),
    vchcomment: z.string().min(25)
})

export function validateReview(input) {
    return reviewSchema.safeParse(input)
}

export function validatePartialReview(input) {
    return reviewSchema.partial().safeParse(input)
}