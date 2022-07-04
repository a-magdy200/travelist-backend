const hasToken = async (
	req: { headers: { [x: string]: any }; token?: any },
	res: { sendStatus: (arg0: number) => void },
	next: () => void
) => {
	const bearerHeader = req.headers['authorization']

	if (typeof bearerHeader !== 'undefined') {
		// console.log('hasToken: yes');
		const bearerToken = bearerHeader.split(' ')[1]
		req.token = bearerToken
		next()
	} else {
		// console.log('hasToken: no');
		res.sendStatus(403)
	}
}

export { hasToken }
