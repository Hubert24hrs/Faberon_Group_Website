import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { leaders } from "@/content/leadership";

export function LeadershipSection() {
  return (
    <section id="leadership" className="border-t border-line py-section">
      <div className="site-container">
        <p className="eyebrow">Leadership</p>
        <h2 className="mt-4 text-h2">The people behind the work</h2>

        {leaders.map((leader) => (
          <Reveal key={leader.name} className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="overflow-hidden rounded-lg border border-line bg-surface">
                <Image
                  src={leader.photo.src}
                  alt={leader.photo.alt}
                  width={leader.photo.width}
                  height={leader.photo.height}
                  sizes="(min-width: 1024px) 380px, 100vw"
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </div>
            </div>

            <div className="lg:col-span-8">
              <h3 className="text-h2">{leader.name}</h3>
              <p className="mt-2 font-display text-lg font-semibold text-accent-text">
                {leader.role}
              </p>
              <p className="mt-1 text-sm text-muted">{leader.headline}</p>

              <div className="mt-6 space-y-4 text-lead text-muted">
                {leader.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
                {leader.highlights.map((item) => (
                  <div key={item.label} className="flex flex-col rounded-lg border border-line p-4">
                    <dt className="text-sm text-muted">{item.label}</dt>
                    <dd className="order-first font-display text-h2 font-semibold">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <h4 className="eyebrow mt-8">Expertise</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {leader.expertise.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-line px-3 py-1 text-sm text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {leader.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-accent-text hover:underline"
                    >
                      {link.label}
                      <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
