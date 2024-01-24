import { useEffect, useState } from "preact/hooks";

export default function Search() {
  const [results, setResults]: any = useState([]);

  useEffect(() => {
    console.log("KKK");
    // Get the "q" query parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("q");

    setTimeout(() => {
      console.log("EEA");
      setResults([{ title: "Title" }]);
    }, 1000);
    // Make a request to the API
    // fetch(`https://api.com?q=${searchQuery}`)
    //   .then((response) => response.json())
    //   .then((data) => setResults(data))
    //   .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>Search Results!</h2>
      {/* {results.map((result, key:any) => (
        <div key={key}>{result.title}</div>
      ))} */}
    </div>
  );
}
