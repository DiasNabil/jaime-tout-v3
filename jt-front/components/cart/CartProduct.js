import { CartContext } from "@/app/providers";
import formatPrice from "@/utils/formatPrice.mjs";
import {Card, CardBody, Image, CardFooter, Divider, Chip, Input} from "@nextui-org/react";
import { useContext, useState } from "react";
import { RxCross1 } from "react-icons/rx";


export default function CartProduct({prod, setValidCart}) {
  
  prod.stock > prod.quantity ?  setValidCart(false) : setValidCart(true)
  const {addToCart, removeFromCart} = useContext(CartContext)
  const [product , setProduct] = useState(prod)

  function setQuantity(value){
    let updateProd = {...prod, quantity: value}
    setProduct(updateProd)

    updateProd = {...prod, quantity: Number(value)}
    
    if(value === 0){
        removeFromCart(updateProd)
    }

    if(value > 0) {
        console.log('test', updateProd)
        addToCart(updateProd)
    }
}

function handleClick(){
  removeFromCart(prod)
}

  

  return (
    <Card radius="sm" className="border-none min-h-card">
        <CardBody >
            <div className="flex gap-2" >
              <Image 
                alt="product name" 
                className="object-cover rounded-md  w-unit-3xl h-unit-3xl" 
                src={product.image} 
                
              />
              <div className=" flex flex-col gap-3">
                <p className="text-md font-semibold">{product.name}</p>
                <p className="text-small text-default-500"><span className="font-semibold">Prix: </span> {formatPrice(product.unitPrice)} KMF</p>
                {
                  prod.stock > prod.quantity ?
                  <Chip color="success" variant="dot">Stock</Chip> : 
                  <Chip color="danger" variant="dot">Inssufisant</Chip>
                }
              </div>
            </div>
            <RxCross1 className="absolute z-10 right-2 cursor-pointer" onClick={handleClick}/>
        </CardBody>
        <Divider/>
        <CardFooter>
          <div className="flex justify-between align-middle w-full">
            <p className="font-semibold">Quantité</p>
            <Input
              type="number"
              size="sm"
              className="w-fit"
              variant="bordered"
              value={product.quantity}
              onValueChange={(value)=>setQuantity(value)}
            />
          </div>
        </CardFooter>
    </Card>
  );
}
