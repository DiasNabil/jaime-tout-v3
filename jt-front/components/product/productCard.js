'use client'

import { CartContext } from "@/app/providers"
import formatPrice from "@/utils/formatPrice.mjs"
import { Button, Card, CardFooter, CardHeader, Chip, Image, Input, Skeleton } from "@nextui-org/react"
import { Suspense, forwardRef, useContext, useEffect, useState } from "react"


const ProductCard = forwardRef(({product}, ref)=>{
    const [input, setInput] = useState(0)
    const {cart, addToCart, removeFromCart} = useContext(CartContext)
    const [prod , setProd] = useState({
        ...product,
        quantity: 0,
        unitPrice:product.promo !== 0 ? product.promo : product.price
     })

    function setQuantity(value){
        setInput(value)
        let updateProd = {...prod, quantity: value}
        setProd(updateProd)

        updateProd = {...prod, quantity: Number(value)}
        
        if(value === 0 || value ===''){
            removeFromCart(updateProd)
        }

        if(value > 0) {
            addToCart(updateProd)
        }
    }

    useEffect(()=>{

        let isItemInCart = cart.products.find(product => prod._id === product._id)

        if(isItemInCart){
            setProd({
                ...prod,
                quantity: isItemInCart.quantity
            })
        }else{
            if(input !== ''){

                setProd({...prod, quantity: 0})
            }
        }
    }, [cart])






    return (
        <Skeleton isLoaded={product} className="p-4">
        <Card key={prod._id} radius="sm" isFooterBlurred className="overflow-visible border-none items-center" ref={ref} >
        <Image 
            alt={prod.name} 
            className="object-cover mt-8 mb-20"  
            isZoomed 
            src={prod.image}
        />
        <CardHeader className=" flex justify-between absolute z-10">
            {
                prod.stock > 0 ? 
                <Chip
                    size="md"
                    variant="dot"
                    color="success"
                    classNames={{
                        base: "border-none bg-success/30",
                        content: "font-semibold text-success-800"
                    }}
                >
                    stock
                </Chip>
                 : 
                <Chip
                    size="md"
                    variant="dot"
                    color="danger"
                    classNames={{
                        base: "border-none bg-danger/30",
                        content: "font-semibold text-danger-800"
                    }}
                >
                    Rupture
                </Chip>
            }
            {
                prod.promo !== 0 && 
                <Chip
                    color="primary" 
                    variant="shadow"
                    classNames={{
                        base: "border-none bg-primary/80",
                        content: "font-semibold"
                    }}
                    size="md"
                >
                    Promo
                </Chip>
            }
        </CardHeader>
        <CardFooter className="overflow-hidden bg-primary/40 shadow-md absolute z-10 bottom-1 rounded-md w-[calc(100%_-_10px)] px-unit-4 mb-unit-2 flex flex-col items-start">
            <div className="flex justify-between w-full">
                    <Chip 
                        color="primary" 
                        variant="shadow"
                        classNames={{
                            base: "border-none bg-primary/50",
                            content: "font-semibold"
                        }}
                        size="sm"
                    >
                        <span className="font-bold">KMF </span> 
                        {
                            formatPrice(prod.unitPrice) 
                        }
                    </Chip> 
                    {
                        prod.promo !== 0 && 
                        <Chip 
                        color="primary" 
                        variant="shadow"
                        classNames={{
                            base: "border-none bg-primary/50",
                            content: "font-semibold"
                        }}
                        size="sm"
                    >
                    <div className="line-through decoration-2">
                        <span className="font-bold">KMF </span> 
                        { formatPrice(prod.price) }
                    </div>
                    </Chip> 
                    }
            </div>
            <p className="font-normal tracking-wide text-white my-2.5 lg:my-2 text-xl lg:text-medium">{prod.name}</p>
            {
                prod.quantity > 0 || prod.quantity === '' ?
                <Input
                    name='quantity'
                    type="number"
                    value={prod.quantity}
                    onValueChange={(value)=>{setQuantity(value)}}
                    variant="underlined"
                    size="sm"
                    color="primary"
                    classNames={{
                        input: "w-[50%] m-auto text-center text-white text-xl font-medium"
                    }}
                /> : 
                <Button 
                isDisabled={prod.stock > 0 ? false : true } 
                color="primary" 
                variant="flat" 
                className="font-medium m-auto text-white bg-primary/50 text-medium "
                onPress={()=>setQuantity(1)}
                >
                    Ajouter au panier
                </Button>

            }
            
        </CardFooter>
    </Card>
    </Skeleton>
    )
})

export default ProductCard