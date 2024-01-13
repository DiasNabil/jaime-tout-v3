import 'dotenv/config'
import { createClient } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
    projectId: "ntulzivs",
    dataset: "production",
    apiVersion: "2023-01-13",
    useCdn: false,
    token: process.env.NEXT_PUBLIC_SANITY_SECRET_TOKEN,
    perspective: 'published',
  });

  const builder = imageUrlBuilder(client)
  
  export function urlFor(source) {
    return builder.image(source)
  }


