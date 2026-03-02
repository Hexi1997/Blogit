import { BlogList } from "@/components/blog/blog-list";
import { getAllBlogPosts } from "@/lib/blog";

export const dynamic = "force-static";

export default function Home() {
  const posts = getAllBlogPosts();

  return (
    <div className="mx-auto max-w-[732px]">
      <BlogList posts={posts} />
    </div>
  );
}
