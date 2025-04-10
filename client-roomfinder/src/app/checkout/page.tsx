'use client';

import { LeaseRequest, Property, UserProfile } from '@/utils/interfaces';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { Spinner } from '@nextui-org/react';
import { useSession } from 'next-auth/react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutButtonProps {
  property: Property
  leaseRequest: LeaseRequest
}

const CheckoutButton = ({property, leaseRequest} : CheckoutButtonProps) => {

  const [loading, setLoading] = useState(false)
  const session = useSession()

  const handleClick = async () => {
    
    if(session.status === 'unauthenticated' || session.status === 'loading') return
    const userData = session.data?.user as UserProfile

    try {
      setLoading(true)
      const {data} = await axios.post('/api/stripe/checkout-session', { property, userId: userData.usuarioid, leaseRequest }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const stripe = await stripePromise;
      stripe?.redirectToCheckout({sessionId: data.id}) 
    } catch (error) {
      toast.error('No se pudo establecer la sesión de pago', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      }
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    { !loading ? (
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Proceder al pago
      </button>
    ) : (
      <Spinner/>
    )}
    </>
  );
};

export default CheckoutButton;