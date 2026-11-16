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
// The Testimonials page and its menu item switch on automatically once this list
// has at least one entry, and switch off again if it's emptied.
export const testimonials: Testimonial[] = [];
