import z from 'zod'

const paymentOrderSchema = z.object({
    orderid: z.number(), 
    leasesid: z.number(), 
    amount: z.number(), 
    status: z.string(),
    vchcontent: z.string().optional(),
    bitpayment: z.boolean().optional(),
})

export function validatePaymentOrder(input) {
    return paymentOrderSchema.safeParse(input)
}

export function validatePartialPaymentOrder(input) {
    return paymentOrderSchema.partial().safeParse(input)
}