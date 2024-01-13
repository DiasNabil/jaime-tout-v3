
import { client, urlFor } from "./client.mjs"

//const { default: axios } = require("axios")
const domainUrl = process.env.NEXT_PUBLIC_DOMAIN

export function setImageUrl(prods){
  prods.map(prod=>{
    prod.image = urlFor(prod.image).url()
  })

  return prods
}

export async function getCategories(){
  
    const cat = await client.fetch('*[_type == "category"]')
  
    return cat
}
  
export async function getPromo(limit, sort, cat=null){

    let products = await client.fetch(`*[_type == "product" && promo > 0 ${cat ? `&& references(*[_type=='category' && slug.current=='${cat}']._id)`: ''}] | order(price ${sort}) [0...${limit}]`)
    products = setImageUrl(products)

  
    const total = await client.fetch(`count(*[_type == "product" && promo > 0 ${cat ? `&& references(*[_type=='category' && slug.current=='${cat}']._id)`: ''}])`)
    return {products, total}
}
  
export async function getBestSellers(){
    let products = await client.fetch(`*[_type == "product"] | order(sale desc) [0...4]`)
    products = setImageUrl(products)

    return products
}

export async function getProducts(limit, sort, cat = null){
  let query = `*[_type == "product" ${cat ? `&& references(*[_type=='category' && slug.current=='${cat}']._id)`: ''}] | order(price ${sort}) [0...${limit}]`
  let products = await client.fetch(query)
  products = setImageUrl(products)

  const total = await client.fetch(`count(*[_type == "product" ${cat ? `&& references(*[_type=='category' && slug.current=='${cat}']._id)`: ''}])`)
    
  return {products, total}
}
