export default {
    name: 'invoice',
    type: 'document',
    title: 'Invoices',
    fields: [
        {
            name: 'firstName',
            title: 'FirstName',
            type: 'string'
        },
        {
            name: 'lastName',
            title: 'LastName',
            type: 'string',
        },
        {
            name: 'mail',
            title: 'Mail',
            type: 'string',
        },
        {
            name: 'phone',
            title: 'Phone',
            type: 'string',
        },
        {
            name: 'address',
            title: 'Address',
            type: 'string',
        },
        {
            name: 'city',
            title: 'City',
            type: 'string',
        },
        {
            name: 'shippingMethod',
            title: 'Shipping Method',
            type: 'reference',
            to: [{type:'shippingMethod'}]
        },
        {
            name: 'paymentMethod',
            title: 'Payment Method',
            type: 'reference',
            to: [{type:'paymentMethod'}]
        },
        {
            name: 'state',
            title: 'Order State',
            type: 'reference',
            to: [{type:'state'}]
        },
        {
            name: 'cart',
            title: 'Cart',
            type: 'text',
        },
    ]
}