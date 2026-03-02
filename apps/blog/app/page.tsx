import { BlogList } from "@/components/blog/blog-list";
import { TypewriterSlogan } from "@/components/home/typewriter-slogan";
import { getAllBlogPosts } from "@/lib/blog";

export const dynamic = "force-static";

export default function Home() {
  const posts = getAllBlogPosts();

  return (
    <div className="mx-auto max-w-[732px]">
      <section className="mb-8">
        <TypewriterSlogan text="Own your content. For real." />
        <p className="mt-2 text-sm text-neutral-500">
          Content as code, writing as commit, publishing as push, cloneable and forkable, with no platform lock-in.
        </p>
      </section>
      <BlogList posts={posts} />
    </div>
  );
}
