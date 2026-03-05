export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string; // 自动从内容提取，如果 frontmatter 中未指定
  cover: string;
  content: string;
  source?: string;
  tags?: string[];
  pinned?: boolean; // 是否为置顶文章（排序前四名）
}

export interface BlogMetadata {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string; // 自动从内容提取，如果 frontmatter 中未指定
  cover: string;
  source?: string;
  tags?: string[];
  pinned?: boolean; // 是否为置顶文章（排序前四名）
}
