export default function formatPrice(price){
    const formattedPrice = new Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 3 }).format(
        price,
      )

      return formattedPrice
}