export type Testimonial = {
  /** The client's words, as approved by them. Keep it to two or three sentences. */
  quote: string;
  /** Full name, as the client agreed to be credited. */
  name: string;
  /** Job title, e.g. "Head of Operations". */
  role: string;
  company: string;
  /** Which service the work was, e.g. "AI agents and automation". Optional. */
  service?: string;
};

// Real client testimonials only, each with the client's written permission to publish
// their name, role and company. Never add sample or invented quotes.
//
// The Testimonials section (homepage and /testimonials) shows these as soon as the list
// has an entry, with the 3D corridor on /testimonials. While it's empty, the section
// invites past clients to share their experience instead.
export const testimonials: Testimonial[] = [];

/** True once at least one real testimonial exists. Drives the links, sitemap and indexing. */
export const hasTestimonials = testimonials.length > 0;
