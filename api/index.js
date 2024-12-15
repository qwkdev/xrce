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

	// if (targetPath === 'proxy-cookie') {
	// 	const { name } = req.query;
	// 	if (!name) { return res.status(400).send("Cookie name is required."); }
		
	// 	switch (name) {
	// 		case 'achieve':
	// 			const response = await fetch('https://achieve.hashtag-learning.co.uk/accounts/login/', {
	// 				method: 'POST',
	// 				redirect: 'manual',
	// 				headers: {
	// 					"Origin": "https://achieve.hashtag-learning.co.uk",
	// 					"Cookie": `csrftoken=${req.headers['csrftoken']}`
	// 				},
	// 				body: new URLSearchParams({
	// 					csrfmiddlewaretoken: req.headers['csrfmiddlewaretoken'],
	// 					login: req.headers['login'],
	// 					password: req.headers['password']
	// 				})
	// 			});
	// 			if (response.status === 302 || response.status === 301) {
				
	// 			if (!response.ok) {
	// 				const errorText = await response.text();
	// 				console.error("Response error:", response.status, errorText);
	// 				return res.status(response.status).send(`Error from target server: ${errorText}`);
	// 			}

	// 			// const response2 = await fetch('https://achieve.hashtag-learning.co.uk/', {
	// 			// 	method: 'GET',
	// 			// 	headers: { 
	// 			// });
					
	// 			const cookies = response.headers.get('set-cookie');

	// 			const setCookies = [];
	// 			response.headers.forEach((value, name) => {
	// 				if (name.toLowerCase() === 'set-cookie') {
	// 					setCookies.push(value);
	// 				}
	// 			});
	// 			console.log(setCookies);
	// 			console.log(response.headers)
			
	// 			// let newCookie = '';
	// 			// if (cookies) {
	// 			//     newCookie = cookies.split(',').map(cookie => {
	// 			// 	if (cookie.includes('sessionid=')) {
	// 			// 	    return cookie.replace(
	// 			// 		    '; HttpOnly; Path=/; SameSite=None; Secure',
	// 			// 		    '; HttpOnly=false; Path=/; SameSite=None; Secure'
	// 			// 	    );
	// 			// 	}
	// 			// 	return cookie;
	// 			//     }).join(',');
	// 			// }
				
	// 			const html = await response.text();
	// 			// res.setHeader('Set-Cookie', newCookie);
	// 			res.status(response.status).send(html);
	// 	}
	// }
	
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
