
import './globals.css'
import { Providers } from './providers'
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";


export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  title: "J'aime tout marketplace ",
  description: 'Votre supermarché à portée de clic, parcourez nos rayons virtuels et remplissez votre panier en toute simplicité.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
    <body>
      <Providers>
        <Nav/>
          {children}
        <Footer/>
      </Providers>  
    </body>
    </html>
  )
}
