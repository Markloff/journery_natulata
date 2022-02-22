import React, { useEffect } from 'react';


export default function Web() {

	useEffect(() => {
		console.log('mount');

		const createIpfs = async () => {
			const { create } = await import("ipfs-core");
			create().then(res => {
				console.log(res);
			})
		}
		createIpfs();
	}, [])

	return (
		<div>
			deploy with vercel
		</div>
	)
}
