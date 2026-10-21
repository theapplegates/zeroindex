import { getImageUrl } from "./cloudinary";
import type { Post } from "./posts";

const attribute = (attributes: string, name: string) =>
  new RegExp(`${name}="([^"]*)"`).exec(attributes)?.[1];

/* MDX image components are meaningless in plain Markdown, so write them out as images. */
const renderImages = (body: string) =>
  body.replace(/<PostImage\s([\s\S]*?)\/>/g, (match, attributes: string) => {
    const publicId = attribute(attributes, "publicId");
    if (!publicId) return match;
    const alt = attribute(attributes, "alt") ?? "";
    const caption = attribute(attributes, "caption");
    const image = `![${alt}](${getImageUrl(publicId, { width: 1344 })})`;
    return caption ? `${image}\n\n${caption}` : image;
  });

/* The post as plain Markdown, for the Copy page button and the .md route. */
export const postMarkdown = (post: Post) =>
  `# ${post.data.title}\n\n${post.data.description}\n\n${renderImages(post.body ?? "")}`;
