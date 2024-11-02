export default async function handler(req, res) {
  const targetUrl = `https://qwk.pythonanywhere.com/post`;

  // Set up options for the fetch request
  const fetchOptions = {
    method: req.method,
    headers: {
      "Content-Type": "application/json", // Set Content-Type for JSON
      "User-Agent": "Mozilla/5.0" // Avoid sending sensitive or unnecessary headers
    },
    body: req.method === "GET" ? null : JSON.stringify(req.body),
  };

  try {
    const response = await fetch(targetUrl, fetchOptions);

    if (!response.ok) {
      // If the response is not OK, log the status and message
      const errorText = await response.text();
      console.error("Response error:", response.status, errorText);
      return res.status(response.status).send(`Error from target server: ${errorText}`);
    }

    const data = await response.json();
    res.status(response.status).json(data); // Send JSON back to the client
  } catch (error) {
    console.error("Error forwarding request:", error);
    res.status(500).send(`Error connecting to target server: ${error}`);
  }
}
