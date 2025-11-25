const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://lemura.app";

const sanitizedSiteUrl = (() => {
  const withProtocol = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
    ? rawSiteUrl
    : `https://${rawSiteUrl}`;
  return withProtocol.replace(/\/$/, "");
})();

const absoluteUrl = (path: string) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${sanitizedSiteUrl}${normalized}`;
};

export const siteConfig = {
  name: "Lemura | Civil Service Answer Writing Coach",
  shortName: "Lemura",
  description:
    "AI-powered UPSC preparation workspace covering answer writing, essay practice, MCQs, flashcards, mindmaps, and progress analytics.",
  keywords: [
    "UPSC answer writing platform",
    "civil services essay practice",
    "MCQ generator",
    "mindmap builder",
    "flashcards for UPSC",
    "daily UPSC questions",
  ],
  locale: "en_IN",
  url: sanitizedSiteUrl,
  logo: absoluteUrl("/logo/lemura_logo.png"),
  openGraphImage: absoluteUrl("/logo/lemura_logo.png"),
  socialProfiles: [] as string[],
};

export const marketingPages = [
  "/",
  "/about",
  "/blogs",
  "/contact",
  "/daily-questions",
  "/essay",
  "/essay-practice",
  "/mcq",
  "/mindmap",
  "/pricing",
  "/privacy",
  "/profile",
  "/progress",
  "/terms",
];
