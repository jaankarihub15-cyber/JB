import type { Metadata } from "next";
import { FormKit } from "@/components/tools/form-kit";
import { JsonLd, faqSchema, breadcrumbSchema } from "@/components/json-ld";
import { Breadcrumb, SectionHeading, FAQ, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "SSC CGL Form 2026 - Documents, Photo Size & Checklist",
  description:
    "Free form kit for SSC CGL. Save your details once, see what the form needs (documents, photo and signature size), and fill it calmly. Stays on your device.",
  alternates: { canonical: "https://knowledgekendra.com/tools/form-kit" },
};

const faqs = [
  {
    question: "What documents are required to fill the SSC CGL form?",
    answer:
      "Before you start, keep ready your 10th certificate (for name and date of birth), your graduation details, a valid photo ID such as Aadhaar or PAN, and your category certificate if you belong to SC, ST, OBC or EWS. During the form you upload a scanned signature, while the photo is captured live. You also need an active email and mobile number for the One-Time Registration.",
  },
  {
    question: "What is the photo and signature size for SSC CGL?",
    answer:
      "In the current cycle SSC captures your photo live inside the form using your webcam or phone, so there is no passport photo to upload. You only upload a scanned signature in JPEG or JPG format, between 10 KB and 20 KB, signed in running hand with a black pen on white paper. Signatures in block capitals are rejected. Always confirm the exact sizes in the official notification.",
  },
  {
    question: "What is the SSC CGL application fee?",
    answer:
      "The fee is around 100 rupees for General and OBC candidates, paid online through UPI, net banking or card. SC, ST, PwD, ex-servicemen and all women candidates are exempt from the fee. The exact amount is stated in the notification for that cycle.",
  },
  {
    question: "Is there a passport photo to upload for SSC CGL?",
    answer:
      "No, not in the current cycle. SSC moved to a live photo that you capture during the application using a webcam or mobile camera. Use a plain light background, remove any cap or spectacles, keep both ears visible and your face filling the frame. Old or pre-existing photos are rejected.",
  },
  {
    question: "Does this tool store my details anywhere?",
    answer:
      "No. Everything you type is saved only inside your own browser on your device. Nothing is uploaded to any server and we cannot see it. For your safety the tool also never asks for your Aadhaar number, bank details or passwords.",
  },
  {
    question: "Can I use this for exams other than SSC CGL?",
    answer:
      "Yes. Your saved details work for any form. Tap the General details option to see a checklist of documents that most government forms ask for. We are adding exam-specific checklists for more exams over time.",
  },
  {
    question: "What happens to my details if I clear my browser?",
    answer:
      "Because the data lives only in your browser, clearing your browser or switching phones will remove it. To stay safe, tap Save a backup file once. That downloads a small file you can later restore using the Restore button to bring all your details back.",
  },
  {
    question: "Why must my name match my 10th certificate exactly?",
    answer:
      "A mismatch between the name or date of birth on your form and on your 10th certificate is the single most common reason applications and candidatures get rejected. Enter your name and date of birth exactly as printed on the 10th certificate, including spelling and order, everywhere on the form.",
  },
];

export default function FormKitPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 pt-6 pb-12">
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://knowledgekendra.com" },
          { name: "Tools", url: "https://knowledgekendra.com/tools" },
          { name: "Sarkari Form Kit", url: "https://knowledgekendra.com/tools/form-kit" },
        ])}
      />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Form Kit" }]} />

      <div className="mt-4 mb-6 bg-accent-light border border-accent/20 rounded-3xl p-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shrink-0 border border-accent/10">🗂️</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">Sarkari Form Kit</h1>
            <p className="text-xs text-text-muted mt-1">Updated: June 2026 · By Ash K.</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary mb-4 leading-relaxed">
          Save your exam details once, see exactly what the form needs, and fill it without the last-minute panic. Your details stay on your device and are never uploaded.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Saved on your device", "SSC CGL ready", "Copy in one tap", "No Aadhaar or bank"].map((c) => (
            <span key={c} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-accent-dark border border-accent/10">{c}</span>
          ))}
        </div>
      </div>

      <FormKit />

      {/* ---------- crawlable SEO content ---------- */}
      <div className="mt-10">
        <SectionHeading icon="📄">Documents required for the SSC CGL form</SectionHeading>
        <div className="card p-5 text-text-secondary text-sm leading-relaxed space-y-3">
          <p>
            Most of the panic around the SSC CGL form comes from scrambling for the same details every time. Keep these ready before you open the form and the whole thing takes minutes.
          </p>
          <p>
            You need your 10th certificate for your name and date of birth, your graduation degree and marksheet, and a valid photo ID such as Aadhaar, PAN, Voter ID, Passport or Driving Licence. If you belong to SC, ST, OBC or EWS, keep that category certificate ready in the central-government format.
          </p>
          <p>
            During the form you upload a scanned signature and capture a live photo. You also confirm an active mobile number and email during the One-Time Registration, so the admit card and alerts reach you.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <SectionHeading icon="📷">SSC CGL photo and signature size</SectionHeading>
        <div className="card p-5 text-text-secondary text-sm leading-relaxed space-y-3">
          <p>
            In the current cycle SSC does not ask for a passport photo upload. The photo is captured live inside the application using your webcam or phone, so there is nothing to resize for the photo.
          </p>
          <p>
            For the live photo, use a plain light background, remove any cap or spectacles, keep both ears visible, and let your face fill the frame. Old or pre-existing photos are rejected on the spot.
          </p>
          <p>
            You do upload a scanned signature. It must be JPEG or JPG, between 10 KB and 20 KB, signed in running hand with a black pen on white paper. A signature in block capitals or one that is blurred will be rejected. Confirm every size against the official notification before you submit.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <SectionHeading icon="🧭">How the SSC CGL form works</SectionHeading>
        <div className="card p-5 text-text-secondary text-sm leading-relaxed space-y-3">
          <p>
            First you complete a One-Time Registration on the official SSC portal with your basic details. This gives you a registration number and password you reuse for every SSC exam.
          </p>
          <p>
            Then you log in, fill the application with your education and post preferences, capture the live photo, upload the signature, and pay the fee online if you are not exempt. The fee is around 100 rupees for General and OBC, and free for SC, ST, PwD, ex-servicemen and all women.
          </p>
          <p>
            Preview everything before final submission, because uploads usually cannot be changed afterwards. There is a short correction window, but it is safer to get it right the first time.
          </p>
        </div>
      </div>

      <div className="mt-8" id="faqs">
        <SectionHeading icon="❓">Frequently Asked Questions</SectionHeading>
        <Card>
          {faqs.map((f) => (
            <FAQ key={f.question} question={f.question} answer={f.answer} />
          ))}
        </Card>
      </div>

      <p className="mt-6 text-xs text-text-muted leading-relaxed text-center">
        This kit helps you prepare your own details. Always follow the instructions on the official notification, which take precedence over anything shown here.
      </p>
    </div>
  );
}
