import React, { useEffect } from 'react';
import { create } from 'ipfs-core';

export default function Web() {

	useEffect(() => {
		create().then(res => {
			console.log('res', res);
		})
	}, [])

	return (
		<div>
			deploy with vercel
		</div>
	)
}
