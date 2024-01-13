import category from "./category";

export default {
    name: 'product',
    type: 'document',
    title: 'Products',
    fields: [
      {
        name: 'name',
        type: 'string',
        title: 'name'
      },
      {
        name: 'image',
        type: 'image',
        title: 'image'
      },
      {
        name: 'stock',
        type: 'number',
        title:  'stock',
      },
      {
        name: 'price',
        type: 'number',
        title: 'price'
      },
      {
        name: 'sale',
        type: 'number',
        title: 'sale'
      },
      {
        name: 'promo',
        type: 'number',
        title: 'promo'
      },
      {
        name: 'category', 
        title: 'category',
        type: 'reference',
        to: [{type:'category'}]
      }

    ]
  }