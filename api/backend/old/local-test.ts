import { handler } from "./index.js";

const main = async () => {
  const response = await handler(
    {
      body: `{"t": "my awesome text", "s": 0.88, "f": false}`,
    },
    {
      fail: (error) => {
        console.log("ERROR", error);
      },
    }
  );

  // console.log("Response", response)
};

main();
