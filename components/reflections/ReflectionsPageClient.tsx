"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SUBSTACK_PUBLICATION_SUBSCRIBE_URL } from "@/lib/data/site";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { useAnimateIn } from "@/components/landing/useAnimateIn";
import { HeroSection } from "@/components/reflections/HeroSection";

type SubstackPost = {
  title: string;
  excerpt: string;
  link: string;
};

async function fetchSubstackPosts(): Promise<SubstackPost[]> {
  const res = await fetch("/api/reflections", { cache: "no-store" });
  if (!res.ok) throw new Error("Feed fetch failed");

  const json = await res.json();
  const items = Array.isArray(json.posts) ? json.posts : [];

  return items.map((item: { title: string; description: string; link: string }) => {
    const plain = (item.description ?? "")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const excerpt = plain.length > 120 ? plain.slice(0, 120).trimEnd() + "…" : plain;
    return { title: item.title, excerpt, link: item.link };
  });
}

function useSubstackFeed() {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const items = await fetchSubstackPosts();

        if (!cancelled) {
          setPosts(items);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { posts, loading, error };
}

export function ReflectionsPageClient() {
  const { posts, loading, error } = useSubstackFeed();
  useAnimateIn(posts);

  return (
    <>
      <SiteNav />
      <main>
        <HeroSection />

        <section className="section reflections-section">
          <div className="section--narrow">
            <div className="reflections-grid">
              {loading && (
                <p className="reflections-loading">Loading reflections…</p>
              )}
              {error && (
                <p className="reflections-error">
                  Could not load posts.{" "}
                  <a
                    href="https://mrstobiyusuf.substack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Substack →
                  </a>
                </p>
              )}
              {!loading && !error && posts.map((post) => (
                <article key={post.link} className="animate-in reflection-card">
                  <p className="reflection-date">Sunday Reflection</p>
                  <h2 className="reflection-title">{post.title}</h2>
                  <p className="reflection-excerpt">{post.excerpt}</p>
                  <a
                    className="reflection-link"
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read on Substack →
                  </a>
                </article>
              ))}
            </div>

            <aside className="reflections-about-strip animate-in" aria-label="About the author">
              <p className="reflections-about-strip-label">About Tobi Yusuf</p>
              <div className="reflections-about-strip-body body-text">
                <p>
                  Tobi Yusuf is a Relational and Cultural Intelligence Advisor who helps
                  individuals, couples, and organisations understand the patterns that shape how
                  we communicate, connect, and navigate conflict.
                </p>
                <p>
                  Her work is grounded in a simple belief: the patterns that shape our most
                  personal relationships often appear in the spaces where we work, lead, and
                  collaborate.
                </p>
              </div>
            </aside>
          </div>

          <div className="reflections-cta-block animate-in">
            <p className="reflections-cta-quote">
              If these words landed, there is a room waiting for you.
            </p>
            <div className="reflections-cta-btns">
              <Link href="/#experiences" className="btn btn-terracotta">
                Join an Upcoming Experience
              </Link>
              <SubstackNativeSubscribe />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

const SUBSTACK_ICON_SRC =
  "https://substackcdn.com/image/fetch/w_96,c_limit,f_auto,q_auto:good/https%3A%2F%2Fsubstack.com%2Fimg%2Fsubstack-app-icon.png";

function SubstackNativeSubscribe() {
  return (
    <a
      href={SUBSTACK_PUBLICATION_SUBSCRIBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="substack-native-subscribe"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Substack-hosted icon URL */}
      <img
        src={SUBSTACK_ICON_SRC}
        width={18}
        height={18}
        alt=""
        className="substack-native-subscribe-icon"
      />
      Subscribe
    </a>
  );
}

