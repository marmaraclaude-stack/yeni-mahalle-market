import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/business";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: BUSINESS.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      images: [
        `${BUSINESS.url}/Hero.png`,
        `${BUSINESS.url}/logo.png`,
        `${BUSINESS.url}/carousel/carousel-1.png`,
        `${BUSINESS.url}/carousel/carousel-2.png`,
        `${BUSINESS.url}/carousel/carousel-3.png`,
        `${BUSINESS.url}/carousel/carousel-4.png`,
        `${BUSINESS.url}/carousel/carousel-5.png`,
        `${BUSINESS.url}/carousel/carousel-6.png`,
        `${BUSINESS.url}/carousel/carousel-7.png`,
      ],
    },
  ];
}
