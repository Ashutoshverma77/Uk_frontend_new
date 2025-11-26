// lib/types.ts

export type Service = {
  id: string;            // maps from _id
  name: string;
  slug: string;
  description: string;
  ctaText: string;       // maps from cta_text
  image: string | null;  // full URL built from backend base + relative path
  status: string;
  active: boolean;
  viewType: string;      // maps from view_type
};
