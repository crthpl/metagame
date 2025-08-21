import FAQ from "@/components/FAQ";

export const metadata = {
  title: "FAQ - Metagame",
  description: "Frequently Asked Questions about Metagame",
};

export default async function FAQPage() {
  return (
    <>
      {/* Override the global animated background for a clean FAQ page */}
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
      <main className="flex w-full justify-center p-6">
        <FAQ />
      </main>
    </>
  );
}
