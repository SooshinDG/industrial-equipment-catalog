import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <section className="container-page py-20">
      <h1 className="text-3xl font-bold text-brand-800">{SITE.tagline}</h1>
      <p className="mt-4 text-brand-500">{SITE.description}</p>
    </section>
  );
}
