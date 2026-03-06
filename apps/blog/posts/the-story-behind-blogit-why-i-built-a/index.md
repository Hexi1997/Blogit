---
title: 'The Story Behind Blogit: Why I Built a Git-Powered, Local-First Blogging System'
date: '2026-03-06'
tags:
  - 'Blogit'
---

**I used to believe publishing meant ownership.**

For years, I wrote on Web2 platforms like [Medium](https://medium.com). They were polished, easy to use, and had built-in distribution. You could focus on writing and let the platform handle everything else.\
But over time, I started to feel the tradeoff: I was creating content, but I didn’t really control its fate. My writing lived inside someone else’s product, someone else’s rules, someone else’s business model.

**Then I entered the Web3 world.**

I was deeply convinced by the idea of decentralization, so I moved my blog to [xLog](https://xlog.app). It felt like the right answer: creator ownership, censorship resistance, open protocols. I didn’t just switch tools, I switched beliefs. I thought I had finally solved the ownership problem.

Until 2025.

**[xLog](https://xlog.app), along with the** **[Crossbell](https://crossbell.io)** **chain behind it, stopped operating**. In my personal experience, posts I had published there were no longer reliably accessible.\
That was the moment everything became brutally clear:

Publishing on a “decentralized” platform is still not the same as owning your content.

If your writing cannot be restored independently, migrated freely, and served without a single product dependency, then you don’t truly own it. You’re still renting infrastructure, just with a different narrative.

## What I Learned

I no longer define content ownership by where it is published.\
I define it by whether I can survive platform failure.

Real ownership means:

* My content exists as local files.
* Every change is versioned in Git.
* Images and assets are stored with the post, not in a third-party silo.
* I can deploy anywhere, migrate anytime.
* Platforms are distribution channels, not my source of truth.

That is exactly why I built **Blogit**.

## Introducing Blogit

**Blogit** is a Git-powered, local-first blogging system built around one principle:

**Own your content. For real.**

Its core model is simple:

* **Content as code**: Posts are Markdown in your own repo.
* **Writing as commit**: Every edit is a commit with full history.
* **Publishing as push**: CI/CD turns pushes into published pages.
* **Cloneable and forkable**: Your blog is portable and reproducible.
* **No platform lock-in**: You can move without rewriting your life’s work.

On top of that, Blogit gives you modern publishing capabilities:

* SSG-based SEO (metadata, sitemap, robots)
* Local media storage (`posts/<slug>/assets`)
* Visual admin panel with Markdown block-level editing (Milkdown)
* Optional Giscus comments
* Cloudflare deployment workflow

## Final Thought

I don’t think platforms are bad.\
I still use them. But now I use them differently.

I publish to platforms for reach.\
I publish to Blogit for permanence.

Because after losing content once, you stop optimizing only for convenience.\
You start optimizing for survival.

