import { company } from "@/config/company";
export type Leader = {
  name: string;
  role: string;
  headline: string;
  photo: { src: string; alt: string; width: number; height: number };
  bio: string[];
  highlights: { value: string; label: string }[];
  expertise: string[];
  links: { label: string; href: string }[];
};

// Sourced from idokohubert.com.
export const leaders: Leader[] = [
  {
    // Name and title come from the company config (the Account Holder).
    name: company.leadership[0]?.name ?? "",
    role: company.leadership[0]?.title ?? "",
    headline: "AI & ML Engineer · Full-Stack Developer · Data Solutions Architect",
    photo: {
      src: "/leadership/idoko-hubert.jpg",
      alt: `${company.leadership[0]?.name ?? "Our founder"} at Lagos Tech Week`,
      width: 765,
      height: 1024,
    },
    bio: [
      `${company.leadership[0]?.name ?? ""} leads ${company.legalName}. Hubert is an AI and machine learning engineer, full-stack developer and data solutions architect who builds intelligent, scalable systems that connect machine learning, analytics and software.`,
      "Hubert's work spans solution architecture, data pipeline engineering, cloud-native infrastructure and AI model deployment, turning complex data into production-ready applications that deliver real business value.",
      `That mix of technical rigour and product thinking sets the standard for every project ${company.shortName} takes on.`,
    ],
    // The founder's own track record, from the company config.
    highlights: company.stats
      .filter((stat) => stat.attribution === "founder")
      .map(({ value, label }) => ({ value, label })),
    expertise: [
      "Machine learning and deep learning",
      "Natural language processing",
      "Computer vision",
      "MLOps and model deployment",
      "Data engineering and pipelines",
      "Full-stack web and mobile",
      "Cloud and DevOps",
    ],
    links: [
      { label: "Portfolio", href: "https://www.idokohubert.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/hubert-idoko-47b817342" },
      { label: "GitHub", href: "https://github.com/Hubert24hrs" },
    ],
  },
];
