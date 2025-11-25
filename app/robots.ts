import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteConfig.url,
    sitemap: [`${siteConfig.url}/sitemap.xml`],
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/", "/admin", "/dashboard"],
      },
    ],
  };
}
