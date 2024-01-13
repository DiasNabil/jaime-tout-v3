'use client'

import { CartContext } from "@/app/providers";
import { client } from "@/utils/client.mjs";
import { Button, Card, Input, Select, SelectItem} from "@nextui-org/react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";


const domainUrl = process.env.NEXT_PUBLIC_DOMAIN

export default function CheckoutFom({lists}){
    const stripe = useStripe();
    const elements = useElements();
    const {cart, setCart, updateCart, resetCart} = useContext(CartContext)
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    const [data, setData] = useState({
      firstName: '',
      lastName: '',
      mail: '',
      phone: '',
      address: '',
      city: '',
      paymentMethod: {},
      shippingMethod: {},
    })
    const [shippingCost, setshippingCost] = useState(0)
    const [otherCity, setOtherCity] = useState(false)
    const router = useRouter()



    useEffect(()=>{
      updateCart()
      
      if(data.shippingMethod.value === 'deliver'){
        setCart(prev => {
          return {
            ...prev, 
            total: prev.total + shippingCost
          }
        })
      }


    }, [data.shippingMethod, data.city])

    async function handleSubmit(e){
        e.preventDefault()
        setIsLoading(true);

        let order = {
          _type: 'invoice',
          firstName: data.firstName,
          lastName: data.lastName,
          mail: data.mail,
          phone: data.phone,
          address: data.address,
          city:data.city,
          shippingMethod: {
            _ref: data.shippingMethod._id,
            _type: 'shippingMethod'
          },
          paymentMethod: {
            _ref: data.paymentMethod._id,
            _type: 'paymentMethod'
          },
          cart: JSON.stringify(cart)
        }

        if(data.paymentMethod.value === 'card'){
          if (!stripe || !elements) {
              // Stripe.js hasn't yet loaded.
              // Make sure to disable form submission until Stripe.js has loaded.
              setMessage("Une erreur est survenue.");
              return;
            }
            
            const payment = await stripe.confirmPayment({
              elements,
              redirect: 'if_required',
            });
          
            if(payment.paymentIntent?.status === 'succeeded'){
              order.state =  {
                _ref: lists.orderStates.find(state => state.value === 'payed')._id,
                _type: 'state'
              }

              client.create(order)
              .then(res=> {
                  cart.products.forEach(prod=>{
                    client.patch(prod._id)
                    .inc({sale: prod.quantity})
                    .dec({stock: prod.quantity})
                    .commit()
                  })
                  resetCart()
                  router.push(`/confirmation/${res._id}`)
              }, error => {
                  setMessage("Paiement effectuée, mais une erreur est survenue lors de l'enregistrement de la commande. Veuillez nous contacter.")
                  setIsLoading(false)
                }
              )
            }
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Otherwise, your customer will be redirected to
            // your `return_url`. For some payment methods like iDEAL, your customer will
            // be redirected to an intermediate site first to authorize the payment, then
            // redirected to the `return_url`.
            if(payment.error){
              console.log(payment)
              if (payment.error.type === "card_error" || payment.error.type === "validation_error") {
                setMessage('Votre paiement à echoué, veuillez réessayer.');
                setIsLoading(false)
              } else {
                setMessage("Une erreur est survenue.");
                setIsLoading(false)
              }
            }
        
        }else {

          order.state =  {
            _ref: lists.orderStates.find(state => state.value === 'confirmed')._id,
            _type: 'state'
          }

          client.create(order)
          .then(res=> {
              cart.products.forEach(prod=>{
                client.patch(prod._id)
                .inc({sale: prod.quantity})
                .dec({stock: prod.quantity})
                .commit()
              })
              resetCart()
              router.push(`/confirmation/${res._id}`)
          }, error => {
                setMessage("Une erreur est survenue.")
                setIsLoading(true)
              }
          )

          
        }

    }

    const paymentElementOptions = {
        layout: "tabs",
    };

    function handleChange(e){
      let value = e.target.value
      const name = e.target.name

      if(name === 'shippingMethod' || name === 'paymentMethod' ){
        const concat = lists.shippingMethods.concat(lists.paymentMethods)
        value = concat.find(e => e._id === value)
      }

      if(name === 'city'){
        let city = lists.cities.find(e => e._id === value)

        if(city){
          setshippingCost(Number(city.cost))
          value = city.name

          if(city.name === 'Autre ville'){
            setOtherCity(true)
            value = ''
          }else{
            setOtherCity(false)
          }
        }
      }


      setData(prev => {return {...prev,[name]: value}})
    }




    return (
        <form onSubmit={handleSubmit} className=" md:w-[50%] flex flex-col gap-4">
          <div className="flex gap-4">
            <Input type="text" className="w-[50%]" name="lastName" value={data.lastName} variant="underlined"  label='Votre nom' onChange={handleChange} isRequired={true}/>
            <Input type="text" className="w-[50%]" name="firstName" value={data.firstName} variant="underlined"  label='Votre prenom' onChange={handleChange} isRequired={true}/>
          </div>
            <Input type="mail" name="mail" value={data.mail} variant="underlined" label='Votre mail' onChange={handleChange} isRequired={true}/>
            <Input type="number" name="phone" value={data.phone} variant="underlined" label='Votre numero de téléphone' onChange={handleChange} isRequired={true}/>
            <div className="flex gap-4">
              <Input type="text" className="w-[50%]" name="address" value={data.address} variant="underlined"  label='Votre addresse' onChange={handleChange} isRequired={true}/>
              <Select name='city' className="w-[50%]" variant="underlined" label='Selectionner votre ville' onChange={handleChange} isRequired={true}>
                {
                  lists.cities.map(city => {
                  return <SelectItem key={city._id} value={city}>{city.name}</SelectItem>
                  })
                }
              </Select>
            </div>
            {
              otherCity && <Input type="text" name="city" value={data.city} variant="underlined"  label='Votre ville' onChange={handleChange} isRequired={true}/>
            }

            <Select name='shippingMethod' variant="underlined" label='Selectionner un moyen de livraison' onChange={handleChange} isRequired={true}>
              {
                lists.shippingMethods.map(ship => {
                return ( 
                  <SelectItem key={ship._id}  value={ship}>
                    {ship.value === 'deliver' ? `${ship.name} ${shippingCost} KMF` : ship.name}
                  </SelectItem>)
                })
              }
            </Select>
            <Select name='paymentMethod' variant="underlined" label='Selectionner un moyen de paiement' onChange={handleChange} isRequired={true}>
              {
                lists.paymentMethods.map(meth => {
                return <SelectItem key={meth._id} value={meth}>{meth.name}</SelectItem>
                })
              }
            </Select>
            {
              data.paymentMethod.value === 'card' && 
              <Card className="mt-4 p-4">
                <PaymentElement id="payment-element" options={paymentElementOptions}/>
              </Card>
            }

            {message && <Card id="payment-message" className="mt-4 bg-danger border-none p-2 text-white">{message}</Card>}
            <Button color="primary" isDisabled={!stripe || !elements} variant="shadow" className="font-bold" isLoading={isLoading} type="submit">
              Valider le paiment
            </Button>

        </form>
    )
}