export default {
    name: 'category',
    type: 'document',
    title: 'Categories',
    fields: [
        {
            name: 'name',
            title: 'name',
            type: 'string'
        },
        {
            name: 'slug',
            title: 'slug',
            type: 'slug',
            options: {
                source: 'name'
            }
        },

    ]
}