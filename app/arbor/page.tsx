import type { Metadata } from "next";
import ArborContent from "@/components/ArborContent";

export const metadata: Metadata = {
  title: "Arbor",
  description:
    "Learn about the Arbor team - curious about markets, pedagogy, and game design",
};

export default function ArborPage() {
  return (
    <>
      {/* Hide the global hero animation for the arbor page */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          html::before {
            display: none !important;
          }
          body {
            background: #010020 !important;
          }
        `,
        }}
      />
      <ArborContent />
    </>
  );
}
