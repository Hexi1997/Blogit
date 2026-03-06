export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string; // Auto-extracted from content when not specified in frontmatter
  cover: string;
  content: string;
  source?: string;
  tags?: string[];
  pinned?: boolean; // Whether the post is pinned (top 4 after sorting)
}

export interface BlogMetadata {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string; // Auto-extracted from content when not specified in frontmatter
  cover: string;
  source?: string;
  tags?: string[];
  pinned?: boolean; // Whether the post is pinned (top 4 after sorting)
}
