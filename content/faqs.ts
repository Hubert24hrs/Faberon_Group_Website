import type { ServiceSlug } from "./services";
import { company } from "@/config/company";

export type Faq = {
  question: string;
  answer: string;
  link?: { label: string; href: string };
};

// Answers state only what the company has confirmed. No response times,
// certifications or prices beyond what's published elsewhere on the site.

export const contactFaqs: Faq[] = [
  {
    question: "What happens after I send the form?",
    answer:
      "A person on our team reads it and replies by email to arrange a consultation. If the work is a fit, we follow with a proposal covering scope and price.",
  },
  {
    question: "Do I need a detailed brief?",
    answer:
      "No. A few sentences on the problem, who it's for and any deadline are enough to start. We'll ask the rest in the consultation.",
  },
  {
    question: "How is pricing decided?",
    answer:
      "Pricing is based on scope. After the consultation we send a proposal as a fixed-price project, a monthly retainer, or a project followed by a support retainer.",
  },
  {
    question: "Do you take equity partnerships or white-label work?",
    answer:
      "Yes, in the right circumstances. Tell us about it through the form and we'll say honestly whether it fits.",
    link: {
      label: "Start a partnership enquiry",
      href: "/contact?service=White-label%20or%20partnership#form",
    },
  },
  {
    question: "Can we meet in person?",
    answer: `Our office is in ${company.registeredAddress.locality}, ${company.registeredAddress.region}. Most consultations happen online, and we can arrange to meet in person.`,
  },
];

export const aboutFaqs: Faq[] = [
  {
    question: `Where is ${company.shortName} based?`,
    answer: `Our office is in ${company.registeredAddress.locality}, ${company.registeredAddress.region}, ${company.registeredAddress.country}. We work with clients globally, online and across time zones.`,
  },
  {
    question: "Who leads the company?",
    answer: `${company.shortName} is led by its ${company.leadership[0]?.title.toLowerCase() ?? "founder"}, ${company.leadership[0]?.name ?? ""}, an AI and machine learning engineer, full-stack developer and data solutions architect.`,
    link: { label: "Meet our leadership", href: "/about#leadership" },
  },
  {
    question: "Who owns the work you deliver?",
    answer:
      "You do. We hand over the source code and documentation, so your team or another vendor can carry on without us.",
  },
  {
    question: "What kinds of clients do you work with?",
    answer:
      "Corporations, organisations such as SMEs, NGOs, schools and associations, growing brands, and individual founders.",
    link: { label: "See solutions by audience", href: "/solutions" },
  },
];

export const solutionsFaqs: Faq[] = [
  {
    question: "We have a strict procurement process. Can you work with it?",
    answer:
      "Yes. We work on fixed-price or retainer terms with an agreed scope and named deliverables, which fits most procurement processes.",
  },
  {
    question: "Do you work with small organisations?",
    answer:
      "Yes. SMEs, NGOs, schools and associations are among the organisations we build for, often starting with automation of manual work.",
  },
  {
    question: "I'm a founder with an idea. Where should I start?",
    answer:
      "Book a consultation. We'll help you agree what the first release should do, and what it should leave out, before anything is built.",
    link: { label: "Book a consultation", href: "/contact" },
  },
  {
    question: "Can you work alongside our own developers?",
    answer:
      "Yes. We can build with your team, review their work, or hand the project over to them at the end.",
  },
];

export const serviceFaqs: Record<ServiceSlug, Faq[]> = {
  "custom-saas": [
    {
      question: "How long does a SaaS build take?",
      answer:
        "It depends on scope. Our largest typical project is a SaaS build of about three months, and bigger products are delivered in phases.",
    },
    {
      question: "Who hosts the software?",
      answer:
        "It's deployed on accounts you own, so you control the hosting and the bills. We can help you choose a provider.",
    },
    {
      question: "Can you work on an existing product?",
      answer:
        "We can review an existing codebase first and tell you plainly what to keep, fix or rebuild before we propose any work.",
    },
  ],
  "ai-agents": [
    {
      question: "Will an agent act without anyone checking?",
      answer:
        "Only for actions you approve in advance. Anything you mark as sensitive waits for a person, and every run is logged.",
    },
    {
      question: "Which AI models do you use?",
      answer:
        "We choose a model to suit the job and your data rules, and design the agent so the model can be changed later.",
    },
    {
      question: "Can an agent use our existing systems?",
      answer:
        "Yes, through their APIs or integrations, with access limited to what the agent's job needs.",
    },
  ],
  "ai-automation": [
    {
      question: "When do you use AI instead of fixed rules?",
      answer:
        "Only when a fixed rule can't do the job reliably, such as reading free-text emails. Rules are cheaper and easier to trust.",
    },
    {
      question: "What happens when an automation fails?",
      answer: "The failure is logged and the right person is alerted. Nothing fails silently.",
    },
    {
      question: "Which tools can you connect?",
      answer:
        "Most tools with an API or webhooks. We confirm during discovery whether your systems support what you need.",
    },
  ],
  "mobile-apps": [
    {
      question: "Do you build for iOS and Android?",
      answer: "Yes, both. We plan features for both platforms together so they stay consistent.",
    },
    {
      question: "Who publishes the app?",
      answer:
        "It's published under your own Apple and Google developer accounts. We prepare the store listings and take it through review.",
    },
    {
      question: "Can the app share data with our website or systems?",
      answer:
        "Yes. We build or connect the backend so your app, website and internal tools work from the same data.",
    },
  ],
  websites: [
    {
      question: "Can we update the content ourselves?",
      answer: "Yes. We set the site up so your team can change content without a developer.",
    },
    {
      question: "Do you handle hosting and the domain?",
      answer:
        "We deploy to hosting on your accounts and connect your domain, so you stay in control.",
    },
    {
      question: "Is the site built for search engines?",
      answer:
        "Yes. Pages ship with metadata, structured data and a sitemap, and we check speed and accessibility before launch.",
    },
  ],
  "machine-learning": [
    {
      question: "How much data do we need?",
      answer:
        "It depends on the problem. We assess your data during discovery and tell you plainly whether it's enough before any model is built.",
    },
    {
      question: "How do you know the model works?",
      answer:
        "We agree the metrics up front, test on data the model hasn't seen, and report the results against those metrics.",
    },
    {
      question: "Which frameworks do you use?",
      answer:
        "Mainly Python with TensorFlow and PyTorch, chosen to suit the problem and how the model will be deployed.",
    },
  ],
  "data-solutions": [
    {
      question: "Can you work with our existing databases?",
      answer:
        "Yes. We map your current sources first and connect to them rather than replacing what already works.",
    },
    {
      question: "Which warehouse or BI tool will you use?",
      answer:
        "We recommend one based on your data volume, budget and team, and we can work with tools you already pay for.",
    },
    {
      question: "How do you keep the numbers accurate?",
      answer:
        "Pipelines check the data as it moves and alert someone when something looks wrong, and each metric has one agreed definition.",
    },
  ],
  "full-stack-development": [
    {
      question: "Which technologies do you use?",
      answer:
        "Typically React on the frontend and Node.js or Python on the backend, adjusted to your needs and your team's skills.",
    },
    {
      question: "Do you write tests and documentation?",
      answer:
        "Yes. Automated tests and documentation are part of the handover, so your team can change the code safely.",
    },
    {
      question: "Can you work alongside our developers?",
      answer:
        "Yes. We can build with your team, review their code, or hand over to them at the end.",
    },
  ],
  "cloud-devops": [
    {
      question: "Which cloud providers do you work with?",
      answer: "AWS, Azure and Google Cloud. The infrastructure is set up on your own accounts.",
    },
    {
      question: "Can you help control cloud costs?",
      answer:
        "We tag resources and set budgets so spending is visible, and we'll point out where costs can come down.",
    },
    {
      question: "Do you provide ongoing monitoring?",
      answer:
        "Yes, through a monthly retainer. Or we hand over alerts and runbooks so your team can run it.",
    },
  ],
};
