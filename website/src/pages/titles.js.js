import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("posts");
  return new Response(
    `window.blogPosts = ${JSON.stringify(
      posts.map((e) => ({ n: e.data.title, t: e.data.tags.join(" "), u: e.slug }))
    )}`
  );
}
