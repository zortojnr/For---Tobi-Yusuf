export type Reflection = {
  title: string;
  date: string;
  excerpt: string;
  /** UPDATE: Set per-article Substack URLs when published */
  substackUrl: string;
};

export const reflections: Reflection[] = [
  {
    title: "From Love to Resentment in Marriage",
    date: "Sunday Reflection",
    excerpt: "A reflection on how emotional disconnection quietly builds over time.",
    substackUrl: "https://substack.com/home/post/p-193203443",
  },
  {
    title: "15 Years Together. And This Was the First Time We Truly Heard Each Other",
    date: "Sunday Reflection",
    excerpt: "A moment of honest listening that shifted the direction of a marriage.",
    substackUrl: "https://substack.com/home/post/p-192504872",
  },
  {
    title: "March, Marriage & Motherhood Madness",
    date: "Sunday Reflection",
    excerpt: "Holding marriage, motherhood, and identity together in a demanding season.",
    substackUrl: "https://substack.com/home/post/p-191738712",
  },
];
