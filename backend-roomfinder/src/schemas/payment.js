import z from 'zod'

const paymentSchema = z.object({
    leasesid: z.number(),
    paymentmethodid: z.number(),
    dtpayment: z.string(),
    decamount: z.number(),
    vchpaymentstatus: z.string().optional(),
    stripesessionid: z.string(),
    stripe_payment_intent_id: z.string(),
    client_reference_id: z.string().optional()
})

export function validatePayment(input) {
    return paymentSchema.safeParse(input)
}

export function validatePartialPayment(input) {
    return paymentSchema.partial().safeParse(input)
}