import z from 'zod'

const typePropertySchema = z.object({
    vchtypename: z.string().min(5, {
        message: 'Must be 5 or more characters long'
    }).max(60, {
        message: 'Must be less than 60 characters long'
    }),
});

export function validateTypeProperty(input) {
    return typePropertySchema.safeParse(input);
}

export function validatePartialTypeProperty(input) {
    return typePropertySchema.partial().safeParse(input);
}