export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if (req.method === 'OPTIONS') { return res.status(200).end(); }

	const targetPath = req.headers['path'] || 'init';

	console.log(targetPath);
	// if (targetPath === 'delete-cookie') {
	// 	const cookieName = req.headers['name'];
	// 	if (!cookieName) { return res.status(400).send("Cookie name is required."); }

	// 	console.log(req.headers['name'], req.headers['domain']);

	// 	switch(cookieName) {
	// 		case 'achieve':
	// 			res.setHeader('Set-Cookie', `sessionid=; HttpOnly; Path=/; SameSite=None; Secure`);
	// 	} 
		
	// 	return res.status(200).send(`Cookie "${cookieName}" deleted.`);
	// }

	if (targetPath === 'proxy-cookie') {
		const { name } = req.query;
		if (!name) { return res.status(400).send("Cookie name is required."); }
		
		switch (name) {
			case 'achieve':
				const response = await fetch('https://achieve.hashtag-learning.co.uk/accounts/login/', {
					method: 'POST',
					headers: {
						"Host": "achieve.hashtag-learning.co.uk",
						"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
						"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
						"Accept-Language": "en-US,en;q=0.5",
						"Accept-Encoding": "gzip, deflate, br, zstd",
						"Referer": "https://achieve.hashtag-learning.co.uk/accounts/login/",
						"Content-Type": "application/x-www-form-urlencoded",
						"Origin": "https://achieve.hashtag-learning.co.uk",
						"DNT": "1",
						"Sec-GPC": "1",
						"Connection": "keep-alive",
						"Cookie": `csrftoken=${req.headers['csrftoken']}`,
						"Upgrade-Insecure-Requests": "1",
						"Sec-Fetch-Dest": "document",
						"Sec-Fetch-Mode": "navigate",
						"Sec-Fetch-Site": "same-origin",
						"Sec-Fetch-User": "?1",
						"Priority": "u=0, i",
					},
					body: new URLSearchParams({
						csrfmiddlewaretoken: req.headers['csrfmiddlewaretoken'],
						login: req.headers['login'],
						password: req.headers['password']
					})
				});
				
				if (!response.ok) {
					const errorText = await response.text();
					console.error("Response error:", response.status, errorText);
					return res.status(response.status).send(`Error from target server: ${errorText}`);
				}

				const cookies = response.headers.get('set-cookie');
				console.log('Original Cookies:', response.headers.raw());
			
				let newCookie = '';
				if (cookies) {
				    newCookie = cookies.split(',').map(cookie => {
					if (cookie.includes('sessionid=')) {
					    return cookie.replace(
						    '; HttpOnly; Path=/; SameSite=None; Secure',
						    '; HttpOnly=false; Path=/; SameSite=None; Secure'
					    );
					}
					return cookie;
				    }).join(',');
				}
				
				const html = await response.text();
				res.setHeader('Set-Cookie', newCookie);
				res.status(response.status).send(html);
		}
	}
	
	const targetUrl = `https://xrce.pythonanywhere.com/${targetPath}`;
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
