import { serve } from "https://deno.land/std/http/server.ts";

const PORT = 8080;
const HOST = "http://0.0.0.0";
const server = serve(`:${PORT}`);

/**
 * Will work as an in-memory DB to save our postIts
 */
let postIts: Record<string, PostIt> = {
  "random-uuid-1": {
    title: "Read more",
    body: "PacktPub books",
    id: "random-uuid-1",
    createdAt: new Date(),
  },
  "random-uuid-2": {
    title: "Finish book",
    body: "Deno Web Development",
    id: "random-uuid-2",
    createdAt: new Date(),
  },
};
/**
 * Describes the PostIt entity stored in the in-memory database
 */
interface PostIt {
  title: string;
  id: string;
  body: string;
  createdAt: Date;
}

console.log(`Server running at ${HOST}:${PORT}`);
for await (let req of server) {
  const url = new URL(`${HOST}${req.url}`);
  const headers = new Headers();
  headers.set("content-type", "application/json");

  const pathWithMethod = `${req.method} ${url.pathname}`;
  switch (pathWithMethod) {
    case "GET /api/post-its": {
      const allPostIts = Object.keys(postIts).reduce(
        (allPostIts: PostIt[], postItId) => {
          return allPostIts.concat(postIts[postItId]);
        },
        [],
      );

      req.respond({ body: JSON.stringify({ postIts: allPostIts, headers }) });
      continue;
    }
    case "POST /api/post-its": {
      const body = await Deno.readAll(req.body);
      const decoded = JSON.parse(new TextDecoder().decode(body));
      console.log(decoded);
      req.respond({ status: 201 });
      continue;
    }
    default:
      req.respond({ status: 404 });
  }
}
