export default async function handler(req, res) {
	const targetUrl = `https://xrce.pythonanywhere.com/init`;
	const fetchOptions = {
		method: req.method,
		headers: {
			"Content-Type": "application/json",
			"User-Agent": "Mozilla/5.0"
		},
		body: req.method === "GET" ? null : JSON.stringify(req.body),
	};
	try {
		const response = await fetch(targetUrl, fetchOptions);
		
		if (!response.ok) {
			const errorText = await response.text();
			console.error("Response error:", response.status, errorText);
			return res.status(response.status).send(`Error from target server: ${errorText}`);
		}

		const data = await response.json();
		res.status(response.status).json(data);
	} catch (error) {
		console.error("Error forwarding request:", error);
		res.status(500).send(`Error connecting to target server: ${error}`);
	}
}
