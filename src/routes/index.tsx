import { createFileRoute } from "@tanstack/react-router";
import BirthdayApp from "@/components/BirthdayApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Little World Made for You 💖" },
      { name: "description", content: "A birthday surprise for Harshu." },
      { property: "og:title", content: "A Little World Made for You 💖" },
      { property: "og:description", content: "A birthday surprise for Harshu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BirthdayApp,
});
