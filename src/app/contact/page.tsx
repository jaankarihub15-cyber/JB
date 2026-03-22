import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contact Us" };
export default function ContactPage() {
  return (
    <div className="max-w-[860px] mx-auto px-6 py-10">
      <h1 className="heading text-3xl mb-6">Contact Us</h1>
      <div className="text-text-secondary leading-relaxed space-y-4">
        <p className="text-base">We appreciate your feedback and are here to help with any questions about the information on our site.</p>
        <div className="card p-6 mt-6 space-y-4">
          <div><span className="font-semibold text-text">Email:</span> <span className="text-accent">hello@jaankarihub.in</span></div>
          <div><span className="font-semibold text-text">Response Time:</span> We typically respond within 24-48 hours</div>
        </div>
        <h2 className="heading text-2xl mt-8 mb-4 text-text">Report an Error</h2>
        <p className="text-base">Found incorrect information on any page? Please email us with the page URL and the specific error. We take accuracy seriously and will update the content promptly.</p>
        <h2 className="heading text-2xl mt-8 mb-4 text-text">Suggest a Topic</h2>
        <p className="text-base">Want us to cover a specific government scheme, exam, or finance topic? Drop us an email and we will add it to our content pipeline.</p>
      </div>
    </div>
  );
}
