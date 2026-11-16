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
    name: "Idoko Hubert",
    role: "Founder",
    headline: "AI & ML Engineer · Full-Stack Developer · Data Solutions Architect",
    photo: {
      src: "/leadership/idoko-hubert.jpg",
      alt: "Idoko Hubert at Lagos Tech Week",
      width: 765,
      height: 1024,
    },
    bio: [
      "Idoko Hubert leads Faberon Group Technologies Limited. Hubert is an AI and machine learning engineer, full-stack developer and data solutions architect who builds intelligent, scalable systems that connect machine learning, analytics and software.",
      "Hubert's work spans solution architecture, data pipeline engineering, cloud-native infrastructure and AI model deployment, turning complex data into production-ready applications that deliver real business value.",
      "That mix of technical rigour and product thinking sets the standard for every project Faberon Group takes on.",
    ],
    highlights: [
      { value: "3+", label: "Years building production systems" },
      { value: "20+", label: "Projects delivered" },
    ],
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
