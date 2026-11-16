export type ServiceSlug =
  | "custom-saas"
  | "ai-agents"
  | "ai-automation"
  | "mobile-apps"
  | "websites"
  | "machine-learning"
  | "data-solutions"
  | "full-stack-development"
  | "cloud-devops";

export type Service = {
  slug: ServiceSlug;
  name: string;
  navBlurb: string;
  headline: string;
  summary: string;
  builds: { title: string; detail: string }[];
  approach: { title: string; detail: string }[];
  receive: string[];
};

// The main offer: what the home page grid shows.
export const coreServices: Service[] = [
  {
    slug: "custom-saas",
    name: "Custom SaaS",
    navBlurb: "Web software for your organisation or your customers.",
    headline: "Software built around how you work",
    summary:
      "We design and build web software for your organisation or your customers, then hand over the code.",
    builds: [
      {
        title: "Customer-facing products",
        detail: "SaaS with accounts, roles, billing and the admin tools to run it.",
      },
      {
        title: "Internal platforms",
        detail: "Systems that replace spreadsheets and disconnected tools for operations teams.",
      },
      {
        title: "Client and partner portals",
        detail: "Secure places for the people you work with to see status, files and reports.",
      },
      {
        title: "Reporting and admin tools",
        detail: "Dashboards built on your data, showing the numbers your team makes decisions on.",
      },
    ],
    approach: [
      {
        title: "Scope before code",
        detail: "We agree what the first release does, and what it leaves out, before building.",
      },
      {
        title: "Working software early",
        detail: "You see real screens on real infrastructure as the work progresses.",
      },
      {
        title: "Built to be taken over",
        detail: "Your team, or another vendor, can read the code and carry on without us.",
      },
    ],
    receive: [
      "Source code in a repository you control",
      "A production deployment on your accounts",
      "Technical documentation",
      "A handover session with your team",
    ],
  },
  {
    slug: "ai-agents",
    name: "AI agents",
    navBlurb: "Software that takes on a defined job, with people approving what matters.",
    headline: "Agents that do a defined job",
    summary:
      "We build software that handles a specific job using your data and tools, with a person approving what matters.",
    builds: [
      {
        title: "Support triage",
        detail: "Sorts incoming requests, drafts the first response and hands off to a person.",
      },
      {
        title: "Sales enquiry routing",
        detail: "Qualifies new enquiries and sends each one to the right owner with context.",
      },
      {
        title: "Internal knowledge assistants",
        detail: "Answers staff questions from company documents, with sources shown.",
      },
      {
        title: "Document and invoice checks",
        detail: "Extracts the data, compares it against your records and flags what doesn't match.",
      },
    ],
    approach: [
      {
        title: "One job at a time",
        detail: "Each agent has a defined task, a limited set of tools and a clear finish line.",
      },
      {
        title: "People stay in control",
        detail: "You decide which actions need approval. The agent stops and waits for those.",
      },
      {
        title: "Every step is logged",
        detail: "You can see what the agent read, what it decided and what it did.",
      },
    ],
    receive: [
      "A working agent connected to your tools",
      "Approval rules agreed with your team",
      "Logs of every run",
      "Documentation of how the agent behaves and how to change it",
    ],
  },
  {
    slug: "ai-automation",
    name: "AI automation",
    navBlurb: "Connect your systems and remove repeated manual steps.",
    headline: "Remove the steps nobody should repeat",
    summary:
      "We connect your systems and remove repeated manual steps, using AI only where a fixed rule can't do the job.",
    builds: [
      {
        title: "System integrations",
        detail: "Data moves between your existing tools without anyone copying it across.",
      },
      {
        title: "Approval workflows",
        detail: "Requests reach the right person with the context needed to decide.",
      },
      {
        title: "Document processing",
        detail: "Forms, emails and PDFs become structured records in your systems.",
      },
      {
        title: "Scheduled reporting",
        detail: "Reports are collected, written and sent without someone assembling them by hand.",
      },
    ],
    approach: [
      {
        title: "Map the process first",
        detail: "We document how the work happens today, including the exceptions.",
      },
      {
        title: "Rules first, AI where needed",
        detail: "Fixed logic is cheaper and easier to trust, so we use it wherever it works.",
      },
      {
        title: "Failures are visible",
        detail: "When a step fails, the right person is told. Nothing fails silently.",
      },
    ],
    receive: [
      "Working automations on your accounts",
      "A process map of what was automated",
      "Alerts for failed runs",
      "Documentation your team can maintain",
    ],
  },
  {
    slug: "mobile-apps",
    name: "Mobile apps",
    navBlurb: "iOS and Android apps for your customers or your team.",
    headline: "Mobile apps built for daily use",
    summary:
      "We design and build iOS and Android apps for your customers or your team, then hand over the code.",
    builds: [
      {
        title: "Customer apps",
        detail: "Accounts, orders, payments and the everyday tasks your customers need.",
      },
      {
        title: "Staff and field apps",
        detail: "Tools for teams away from a desk, built to cope with poor connections.",
      },
      {
        title: "Companion apps",
        detail: "A mobile version of your existing SaaS or internal system, on the same data.",
      },
      {
        title: "AI features in the app",
        detail: "Agents and assistants inside the app, with people approving what matters.",
      },
    ],
    approach: [
      {
        title: "Both platforms from the start",
        detail: "We plan for iOS and Android together, so features stay consistent.",
      },
      {
        title: "Tested on real devices",
        detail: "We check the app on the kinds of phones your users actually have.",
      },
      {
        title: "Release is part of the job",
        detail: "We prepare the store listings and take the app through review.",
      },
    ],
    receive: [
      "Source code in a repository you control",
      "Apps published under your own store accounts",
      "Technical documentation",
      "A handover session with your team",
    ],
  },
  {
    slug: "websites",
    name: "Websites",
    navBlurb: "Fast marketing and company sites.",
    headline: "Company sites built like products",
    summary:
      "We design and build marketing and company sites that load quickly and are simple to update.",
    builds: [
      {
        title: "Company sites",
        detail: "Clear pages on what you do, who it's for and how to reach you.",
      },
      {
        title: "Marketing sites",
        detail: "Pages built to turn visitors into enquiries, with forms wired to your inbox.",
      },
      {
        title: "Product sites",
        detail: "Launch pages and documentation for software products.",
      },
    ],
    approach: [
      {
        title: "Message before design",
        detail: "We work out what the site needs to say before deciding how it looks.",
      },
      {
        title: "Fast by default",
        detail: "Performance and accessibility are checked before launch, not after.",
      },
    ],
    receive: [
      "A live site on your domain",
      "Source code you own",
      "Search metadata and structured data",
      "Guidance on updating content",
    ],
  },
];

// Specialist work, offered on its own or as part of a core project.
export const engineeringServices: Service[] = [
  {
    slug: "machine-learning",
    name: "AI and machine learning",
    navBlurb: "Models trained on your data, deployed and monitored.",
    headline: "Models that work outside the notebook",
    summary:
      "We train, evaluate and deploy machine learning models on your data, then monitor them in production.",
    builds: [
      {
        title: "Predictive models",
        detail: "Forecasting, scoring and classification built on your historical data.",
      },
      {
        title: "Natural language processing",
        detail: "Classification, extraction, search and summaries for documents and messages.",
      },
      {
        title: "Computer vision",
        detail: "Image and video models for detection, inspection and reading documents.",
      },
      {
        title: "Recommendation systems",
        detail: "Ranking and recommendations for products, content or next actions.",
      },
      {
        title: "Deep learning",
        detail: "Neural network models where simpler methods can't reach the accuracy you need.",
      },
    ],
    approach: [
      {
        title: "Baseline first",
        detail: "We measure a simple approach before building a complex one, so you see the gain.",
      },
      {
        title: "Evaluated on your data",
        detail: "We agree the metrics up front and test on data the model hasn't seen.",
      },
      {
        title: "MLOps from day one",
        detail: "Models ship with versioning, deployment pipelines and drift monitoring.",
      },
    ],
    receive: [
      "Trained models and the code that produces them",
      "An evaluation report against the agreed metrics",
      "Deployment and monitoring on your infrastructure",
      "Documentation for retraining and updates",
    ],
  },
  {
    slug: "data-solutions",
    name: "Data solutions",
    navBlurb: "Pipelines, warehouses and dashboards your team can trust.",
    headline: "Data your team can trust",
    summary:
      "We design data pipelines, warehouses and reporting, so your numbers come from one reliable source.",
    builds: [
      {
        title: "Data pipelines",
        detail: "ETL and ELT pipelines that move and clean data from your systems.",
      },
      {
        title: "Data warehousing",
        detail: "Cloud data platforms that bring your sources together in one place.",
      },
      {
        title: "Analytics and business intelligence",
        detail: "Dashboards and reports on the metrics your team makes decisions on.",
      },
      {
        title: "Big data processing",
        detail: "Processing for data volumes that outgrow a single database.",
      },
      {
        title: "Database design",
        detail: "SQL and NoSQL schemas designed for how your application reads and writes.",
      },
    ],
    approach: [
      {
        title: "Sources mapped first",
        detail: "We document where each number comes from before moving any data.",
      },
      {
        title: "Quality checks built in",
        detail: "Pipelines test the data as it moves and alert someone when it looks wrong.",
      },
      {
        title: "One definition per metric",
        detail: "We agree what each metric means, so reports stop disagreeing.",
      },
    ],
    receive: [
      "Working pipelines on your accounts",
      "A documented data model",
      "Dashboards and reports",
      "Runbooks for when a pipeline fails",
    ],
  },
  {
    slug: "full-stack-development",
    name: "Full-stack development",
    navBlurb: "Frontend, backend and APIs, built to grow with your users.",
    headline: "Frontend to database, one team",
    summary:
      "We build the frontend, backend and APIs of your web application, designed to grow with your users.",
    builds: [
      {
        title: "Web applications",
        detail: "Complete applications, from the interface to the database.",
      },
      {
        title: "Frontend development",
        detail: "Fast, accessible interfaces that work on every screen size.",
      },
      {
        title: "Backend and APIs",
        detail: "REST and GraphQL APIs with clear contracts and documentation.",
      },
      {
        title: "Authentication and access control",
        detail: "Sign-in, roles and permissions that limit each user to what they should see.",
      },
      {
        title: "Scalable system design",
        detail: "Architecture planned for your expected load, and for growth beyond it.",
      },
    ],
    approach: [
      {
        title: "Contracts before code",
        detail: "We agree how the frontend and backend talk before either is built.",
      },
      {
        title: "Secure from the first version",
        detail: "Access control, input checks and secrets handling are there from the start.",
      },
      {
        title: "Built to be maintained",
        detail: "Tests and documentation let your team change the code safely.",
      },
    ],
    receive: [
      "Source code in a repository you control",
      "API documentation",
      "Automated tests",
      "A handover session with your team",
    ],
  },
  {
    slug: "cloud-devops",
    name: "Cloud and DevOps",
    navBlurb: "Deployment, CI/CD and monitoring on AWS, Azure or GCP.",
    headline: "Infrastructure you can ship on",
    summary:
      "We set up cloud infrastructure, deployment pipelines and monitoring on AWS, Azure or Google Cloud.",
    builds: [
      {
        title: "Cloud deployment",
        detail: "Production environments on AWS, Azure or Google Cloud, on your accounts.",
      },
      {
        title: "Containers",
        detail: "Docker images and container hosting, so the app runs the same everywhere.",
      },
      {
        title: "CI/CD pipelines",
        detail: "Automated tests and deployments on every change, with a way to roll back.",
      },
      {
        title: "Monitoring and performance",
        detail: "Alerts, logs and tuning, so problems surface before users report them.",
      },
    ],
    approach: [
      {
        title: "Infrastructure as code",
        detail: "Your setup is written down in code, so it can be reviewed and rebuilt.",
      },
      {
        title: "Least privilege",
        detail: "Every service and person gets only the access they need.",
      },
      {
        title: "Costs you can see",
        detail: "We tag resources and set budgets, so cloud bills don't surprise you.",
      },
    ],
    receive: [
      "Infrastructure on your cloud accounts",
      "A deployment pipeline",
      "Monitoring and alerts",
      "Runbooks and an access handover",
    ],
  },
];

export const services: Service[] = [...coreServices, ...engineeringServices];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
