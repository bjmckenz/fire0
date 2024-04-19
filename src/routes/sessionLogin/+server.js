async function POST(req, res) {
    console.log('sessionLogin server [POS]');
	const json = await req.json();
	console.log(json);
	res.json({ message: 'ok with me!' });
}
