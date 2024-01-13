'use client'
import { CartContext } from '../providers';
import {loadStripe} from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js';
import CheckoutFom from '@/components/checkout/CheckoutForm';
import { Fragment, useContext, useEffect, useState } from 'react';
import { Accordion, AccordionItem, Card, CardBody, CardHeader, Divider, Image, Skeleton } from '@nextui-org/react';
import formatPrice from '@/utils/formatPrice.mjs';
import { client } from '@/utils/client.mjs';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const domainUrl = process.env.NEXT_PUBLIC_DOMAIN

export default function CheckoutPage(){


    const {cart} = useContext(CartContext)

    const [loading, setLoading] = useState(true)
    const [clientSecret, setClientSecret] = useState(undefined);
    const [lists, setLists] = useState({
        cities: [],
        shippingMethods: [],
        paymentMethods: [],
        orderStates: []
      })

    useEffect(() => {

            // Create PaymentIntent as soon as the page loads
            fetch(`${domainUrl}/api/create-payment-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ total: cart.total}),
            })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    
            client.fetch('*[_type == "city" || _type == "shippingMethod" || _type == "paymentMethod" || _type == "state"]')
            .then(data => {
                setLists({
                    cities: data.filter(e => e._type == 'city'),
                    shippingMethods: data.filter(e => e._type == 'shippingMethod'),
                    paymentMethods: data.filter(e => e._type == 'paymentMethod'),
                    orderStates: data.filter(e => e._type == 'state'),
                })
            })

            setLoading(false)



    }, []);

    const appearance = {
        theme: 'stripe',
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <section>
        <div className='container flex flex-col md:flex-row justify-between content-between gap-10'>
        
            <Card className='md:w-[50%] p-2'>
                <CardHeader className='flex flex-col'>
                    <small className='text-start w-full text-small text-default-500'>Montant a payer</small>
                    <Skeleton isLoaded={cart.total !== 0} className='text-start w-full'>
                        <p className='text-start w-full font-bold text-xl'>{formatPrice(cart.total)} KMF</p>
                    </Skeleton>
                </CardHeader>

                <CardBody>
                    <Accordion 
                        variant='splitted'
                        itemClasses={{
                            content: 'w-full'
                        }}
                    >
                        <AccordionItem key="1" title='Récapitulatif'>
                            {
                                cart && cart.products.map(product => 
                                    <Fragment key={product._id}>
                                        <div className="flex gap-2 my-4" >
                                        <Image 
                                        alt="product name" 
                                        className="object-cover rounded-md  w-unit-3xl h-unit-3xl" 
                                        src={product.image} 
                                        
                                        />
                                        <div className=" flex flex-col gap-3 w-full">
                                            <div className='flex flex-col md:flex-row md:justify-between w-full' >
                                                <p className="text-md font-semibold">{product.name}</p>
                                                <p className="text-md">
                                                    <span className="font-semibold">Prix unitaire: </span> {formatPrice(product.unitPrice)} KMF
                                                </p>
                                            </div>
                                            <p className="text-small text-default-500">
                                                <span className="font-semibold">Quantité: </span>  {product.quantity}
                                            </p>
                                        </div>
                                        </div>
                                        <Divider/>
                                    </Fragment>
                                    )
                            }
                        </AccordionItem>
                    </Accordion>
                </CardBody>
            </Card>
            {
                clientSecret && loading === false ? 
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutFom  className='md:w-[50%] p-2' lists={lists} />
                    </Elements>
                : 
                <Skeleton className='w-full md:w-[50%] h-[40vh] rounded-md'/>
            }
        </div>
        </section>
    )
}