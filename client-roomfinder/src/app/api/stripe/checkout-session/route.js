import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

export async function POST(req) {
  try {
    const { origin } = new URL(req.url);
    const {property, userId, leaseRequest} = await req.json();

    // Obtener la fecha y hora actual
    const currentDate = new Date();
    const dtpayment = currentDate.toISOString(); // Formato ISO 8601

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: property.vchtitle,
              images: [property.objphotos[0].url]
            },
            unit_amount: (parseInt(property.decrentalcost) * 100)
          },
          quantity: 1
        }
      ],
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        propertyid: property.propertyid,
        studentid: userId,
        dtstartdate: leaseRequest.dtstartdate,
        dtenddate: leaseRequest.dtenddate,
        decmonthlycost: property.decrentalcost,
        paymentmethodid: 1,
        dtpayment: dtpayment
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}