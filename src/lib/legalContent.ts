/** Company legal pages — reviewed against business registration where applicable. */
import {
  SITE_BRAND_NAME,
  SITE_COMPANY_ADDRESS,
  SITE_COMPANY_LEGAL_NAME,
  SITE_EMAIL,
  SITE_GOVERNING_LAW,
  SITE_PAYMENT_TERMS,
} from "./siteContact";

export const LEGAL_LAST_UPDATED = "June 18, 2026";

export const LEGAL_COMPANY_NAME = SITE_BRAND_NAME;
export const LEGAL_ENTITY_NOTE = `${SITE_COMPANY_LEGAL_NAME}, ${SITE_COMPANY_ADDRESS}.`;
export const LEGAL_CONTACT_EMAIL = SITE_EMAIL;
export const LEGAL_GOVERNING_LAW = SITE_GOVERNING_LAW;

export const privacyPolicySections = [
  {
    title: "Introduction",
    paragraphs: [
      `${LEGAL_COMPANY_NAME} ("we", "us", or "our") respects your privacy. This Privacy Policy explains how we collect, use, store, and protect personal information when you visit our website, submit an inquiry, or communicate with us about custom apparel manufacturing services.`,
      "This website is intended for business customers (B2B). By using our site or submitting a form, you agree to this policy.",
    ],
  },
  {
    title: "Information We Collect",
    paragraphs: [
      "We may collect the following types of information:",
    ],
    list: [
      "Contact details you provide: name, email address, phone or WhatsApp number, company name, and message content.",
      "Project information: product category, estimated order quantity, timelines, and other details you choose to share in an inquiry.",
      "Technical data: IP address, browser type, device information, and pages visited — collected automatically through standard server logs and hosting infrastructure.",
      "Communication records: emails or messages exchanged after you contact us.",
    ],
  },
  {
    title: "How We Use Your Information",
    paragraphs: ["We use your information to:"],
    list: [
      "Respond to quotes, samples, and manufacturing inquiries.",
      "Prepare proposals, tech pack reviews, and production discussions.",
      "Operate and improve our website and customer communication.",
      "Send service-related emails (for example, replies to your inquiry).",
      "Maintain security, prevent spam or abuse, and comply with legal obligations.",
    ],
  },
  {
    title: "Legal Basis (for EEA/UK visitors)",
    paragraphs: [
      "Where applicable under GDPR, we process personal data based on: (a) your consent when you submit a form; (b) our legitimate interest in operating a B2B manufacturing business and responding to commercial inquiries; and (c) legal obligations where required.",
    ],
  },
  {
    title: "How We Share Information",
    paragraphs: [
      "We do not sell your personal information. We may share data only with trusted service providers that help us run our business, such as:",
    ],
    list: [
      "Cloud hosting and database providers (for example, website hosting and secure data storage).",
      "Email delivery services (when configured to notify our team of new inquiries).",
      "Professional advisers (legal, accounting) when necessary and subject to confidentiality.",
    ],
    afterList:
      "These providers process data on our behalf and are required to protect it. We may also disclose information if required by law or to protect our rights, users, or safety.",
  },
  {
    title: "International Data Transfers",
    paragraphs: [
      "As an international B2B manufacturer, your information may be processed in countries other than your own, including where our service providers operate. We take reasonable steps to ensure appropriate safeguards are in place.",
    ],
  },
  {
    title: "Data Retention",
    paragraphs: [
      "We retain inquiry and business communication records for as long as needed to respond to your request, manage an ongoing manufacturing relationship, or comply with legal, tax, and accounting requirements. When data is no longer required, we delete or anonymize it where practicable.",
    ],
  },
  {
    title: "Cookies & Similar Technologies",
    paragraphs: [
      "Our website may use essential cookies required for security, admin access, and basic functionality. We do not use cookies to sell your data. You can control non-essential cookies through your browser settings. Blocking essential cookies may affect how certain features work.",
    ],
  },
  {
    title: "Your Rights",
    paragraphs: [
      "Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal data, or to object to certain processing. To exercise these rights, contact us using the details below. You may also lodge a complaint with your local data protection authority.",
    ],
  },
  {
    title: "Security",
    paragraphs: [
      "We implement reasonable technical and organizational measures to protect personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "Children's Privacy",
    paragraphs: [
      "Our services are not directed to individuals under 16. We do not knowingly collect personal information from children.",
    ],
  },
  {
    title: "Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. The \"Last updated\" date at the top will reflect the latest version. Continued use of the website after changes constitutes acceptance of the updated policy.",
    ],
  },
  {
    title: "Contact Us",
    paragraphs: [
      `If you have questions about this Privacy Policy or how we handle your data, contact us at ${LEGAL_CONTACT_EMAIL} or through the Contact Us form on this website.`,
      LEGAL_ENTITY_NOTE,
    ],
  },
];

export const termsSections = [
  {
    title: "Agreement to Terms",
    paragraphs: [
      `These Terms and Conditions ("Terms") govern your use of the ${LEGAL_COMPANY_NAME} website and your initial communications with us regarding custom apparel manufacturing, sampling, and bulk production.`,
      "By accessing this website or submitting an inquiry, you agree to these Terms. If you do not agree, please do not use the site.",
    ],
  },
  {
    title: "B2B Services Only",
    paragraphs: [
      "Our website and manufacturing services are intended for businesses, brands, wholesalers, and professional buyers. You represent that you have authority to bind your organization when submitting inquiries or placing orders.",
    ],
  },
  {
    title: "Quotes, Samples & Orders",
    paragraphs: [
      "Information on this website is for general reference. Prices, MOQ (minimum order quantity), lead times, materials, and specifications are confirmed only in a written quotation or proforma invoice issued by us.",
    ],
    list: [
      "Quotes are valid for the period stated on the quote or, if not stated, 14 days unless we agree otherwise in writing.",
      "Sample development may require separate fees, tooling, or material costs as specified in your quote.",
      "An order is confirmed only after mutual written acceptance of quotation, payment terms, and production specifications.",
      "You are responsible for the accuracy of tech packs, sizing, artwork, and approval samples before bulk production begins.",
    ],
  },
  {
    title: "Pricing & Payment",
    paragraphs: [
      `Unless otherwise stated in a written quotation or invoice, our standard payment terms are: ${SITE_PAYMENT_TERMS}.`,
      "Bank charges, taxes, duties, and customs fees are your responsibility unless explicitly included in our quote.",
    ],
  },
  {
    title: "Production, Lead Times & Shipping",
    paragraphs: [
      "Stated lead times are estimates based on product complexity, order volume, material availability, and factory schedule. We are not liable for delays caused by force majeure, customs, carrier issues, or factors outside our reasonable control.",
      "Shipping terms (Incoterms), freight method, and insurance are as agreed in writing for each order.",
    ],
  },
  {
    title: "Quality Standards & Claims",
    paragraphs: [
      "We manufacture to agreed specifications and industry-appropriate quality standards. You must inspect goods upon receipt and notify us in writing of any defect or discrepancy within 7 days of delivery (or as specified in your order agreement), with supporting evidence such as photos and quantity records.",
      "Remedies for validated quality issues may include repair, replacement, or credit as agreed — exclusive remedies unless otherwise stated in writing.",
    ],
  },
  {
    title: "Intellectual Property",
    paragraphs: [
      "You retain ownership of your trademarks, designs, and artwork. You grant us a limited license to use submitted materials solely to evaluate inquiries, produce samples, and fulfill confirmed orders.",
      "You warrant that materials you provide do not infringe third-party rights. You indemnify us against claims arising from your designs or instructions, except to the extent caused by our manufacturing error.",
    ],
  },
  {
    title: "Confidentiality",
    paragraphs: [
      "Both parties agree to treat non-public business, pricing, and technical information shared during discussions as confidential, except where disclosure is required by law or already public.",
    ],
  },
  {
    title: "Website Use",
    paragraphs: [
      "You agree not to misuse the website, attempt unauthorized access, submit unlawful or abusive content, or use automated tools to scrape or overload our systems. We may suspend access to protect the site and our users.",
    ],
  },
  {
    title: "Disclaimer",
    paragraphs: [
      "Website content is provided \"as is\" for informational purposes. We do not warrant uninterrupted or error-free operation of the site. To the fullest extent permitted by law, we disclaim implied warranties regarding website content not forming part of a signed order agreement.",
    ],
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, we are not liable for indirect, incidental, special, or consequential damages arising from use of the website or preliminary communications.",
      "Our total liability for any claim relating to a confirmed order is limited to the amount paid by you for that specific order, unless mandatory law requires otherwise.",
    ],
  },
  {
    title: "Governing Law & Disputes",
    paragraphs: [
      `These Terms are governed by ${LEGAL_GOVERNING_LAW}. Disputes should first be resolved through good-faith negotiation. If unresolved, disputes may be submitted to the courts or arbitration forum specified in your signed order agreement, or otherwise to a competent court in our registered jurisdiction.`,
    ],
  },
  {
    title: "Changes to Terms",
    paragraphs: [
      "We may update these Terms from time to time. The updated version will be posted on this page with a revised date. Continued use of the website after changes constitutes acceptance.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      `Questions about these Terms: ${LEGAL_CONTACT_EMAIL} or via our Contact Us page.`,
      LEGAL_ENTITY_NOTE,
    ],
  },
];
