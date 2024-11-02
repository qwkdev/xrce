export default async function handler(req, res) {
  const targetUrl = `https://qwk.pythonanywhere.com/post`;

  // Set up options for the fetch request
  const fetchOptions = {
    method: req.method,
    headers: {
      ...req.headers,
      host: "qwk.pythonanywhere.com", // override to avoid host mismatch issues
    },
    body: req.method === "GET" ? null : JSON.stringify(req.body),
  };

  try {
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    // Forward the status and data
    res.status(response.status).send(data);
  } catch (error) {
    console.error("Error forwarding request:", error);
    res.status(500).send(`Error connecting to target server ${error}`);
  }
}
