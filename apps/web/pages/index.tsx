import { Button } from 'ui';
import { create } from 'ipfs-core';
import { useEffect, useMemo, useState } from 'react';
import { useIpfsFactory } from '../hooks/useIpfsFactory';


export default function Web() {

	const { ipfs, ipfsInitError } = useIpfsFactory()
	const [version, setVersion] = useState(null);
	useEffect(() => {
		if (!ipfs) return;

		const getVersion = async () => {
			const nodeId = await ipfs.version();
			setVersion(nodeId);
		}

		getVersion();
	}, [ipfs]);

	useEffect(() => {
		if (ipfs) {
			ipfs.id().then(res => {
				console.log(res);
			})
		}
	}, [ipfs]);


	return (
		<div className='sans-serif'>
			<header className='flex items-center pa3 bg-navy bb bw3 b--aqua'>
				<h1 className='flex-auto ma0 tr f3 fw2 montserrat aqua'>IPFS React</h1>
			</header>
			<main>
				{ipfsInitError && (
					<div className='bg-red pa3 mw7 center mv3 white'>
						Error: {ipfsInitError.message || ipfsInitError}
					</div>
				)}
			</main>
			<footer className="react-header">
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="react-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</footer>
		</div>
	);
}
