import Stripe from 'stripe';
import { LeasesModel } from '../model/postgresql/leases.js';
import { PaymentModel } from '../model/postgresql/payments.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookHandler = async(req, res) => {
  const sig = req.headers['stripe-signature'] // firma de seguridad de stripe
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    console.log('No stripe-signature header value was provided.');
    return res.status(400).send('Webhook Error: No stripe-signature header value was provided.');
  }
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar los eventos del webhook
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      // console.log('Event data: ', paymentIntent)
      break;
    case 'payment_intent.payment_failed':
      const paymentFailed = event.data.object;
      console.log('PaymentIntent failed.');
      // console.log('Event data: ', paymentFailed)
      // Manejar el fallo del pago
      break;
    case 'payment_intent.created':
      const paymentCreated = event.data.object;
      console.log('PaymentIntent created.');
      // console.log('Event data: ', paymentCreated)
      // Manejar el fallo del pago
      break;
    case 'charge.succeeded':
      const changeSucceded = event.data.object;
      console.log('Change succeded.');
      // console.log('Event data: ', changeSucceded)
      // Manejar el fallo del pago
      break;
    case 'checkout.session.completed':{
      const sessionCompleted = event.data.object;

      // crear el arrendamiento e informacion de pago
      try {
        const lease = await LeasesModel.create({
          propertyid: sessionCompleted.metadata.propertyid,
          studentid: sessionCompleted.metadata.studentid,
          dtstartdate: sessionCompleted.metadata.dtstartdate,
          dtenddate: sessionCompleted.metadata.dtenddate,
          decmonthlycost: sessionCompleted.metadata.decmonthlycost
        })
        
        await PaymentModel.create({
          leasesid: lease.leasesid,
          paymentmethodid: sessionCompleted.metadata.paymentmethodid,
          dtpayment: sessionCompleted.metadata.dtpayment,
          decamount: sessionCompleted.amount_total,
          vchpaymentstatus: sessionCompleted.status,
          stripesessionid: sessionCompleted.id,
          stripe_payment_intent_id: sessionCompleted.payment_intent,
          client_reference_id: sessionCompleted.metadata.studentid // ¿id del usuario que hace el pago?, de ser así NO modificar, de lo contrario revisar esta parte
        })

      } catch (error) {
        console.log('Error: ', error)
      }}
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}

export default webhookHandler;