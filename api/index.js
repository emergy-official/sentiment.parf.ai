import fs from "fs";

let posts = JSON.parse(fs.readFileSync("./posts.json", "utf-8"));
posts = posts.sort((a, b) => {
  const dateA = new Date(a.data.pubDate);
  const dateB = new Date(b.data.pubDate);
  return dateA - dateB;
});

function paginatePosts(posts, page = 1, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return posts.slice(startIndex, endIndex);
}

function searchPosts(searchTerm, page = 1, limit = 10) {
  const s = searchTerm.toLowerCase();
  const matchingPosts = posts.filter((post) => {
    const { title, description, tags } = post.data;

    // Check if the search term is present in the title, description, body, or tags
    const isMatch =
      title.toLowerCase().includes(s) ||
      description.toLowerCase().includes(s) ||
      post.body.toLowerCase().includes(s) ||
      tags.map((e) => e.toLowerCase()).includes(s);

    return isMatch;
  });

  const paginatedPosts = paginatePosts(matchingPosts, page, limit);

  return {
    totalCount: matchingPosts.length,
    page,
    limit,
    posts: paginatedPosts.map((p) => ({
      s: p.slug,
      n: p.data.title,
      d: p.data.description,
      t: p.data.tags,
    })),
  };
}

export const handler = async (event, context) => {
  try {
    const { s, p } = JSON.parse(event.body);
    const result = searchPosts(s, p, 10);

    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };

    console.log(result);
    return response;
  } catch (error) {
    context.fail(error);
  }
};

// handler(
//   {
//     body: `{"s": "post", "p": 3}`,
//   },
//   {
//     fail: (error) => {
//       console.log("ERROR", error);
//     },
//   }
// );

/*
LAMBDA TEST
{
  "body": "{\"s\": \"post\"}"
}

POSTMAN TEST
{
    "s": "post"
}
*/
