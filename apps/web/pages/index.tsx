import { Button } from 'ui';
import { create } from 'ipfs-core';
import React, { useEffect, useMemo, useState } from 'react';
import { useIpfsFactory } from '../hooks/useIpfsFactory';


export default function Web() {

	const { ipfs, ipfsInitError } = useIpfsFactory()
	const [version, setVersion] = useState(null);
	const [content, setInputContent] = useState('');
	const [remoteContent, setRemoteContent] = useState('');
	const [fileCid, setFileCid] = useState('');


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


	const setContent = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputContent(ev.target.value);
	}

	const catFile = async (cid) => {
		const content = [];
		for await (const chunk of ipfs.cat(cid)) {
			content.push(chunk);
		}
		return content;
	}

	const handleSubmit = async () => {
		console.log('submit', content);
		const fileToAdd = {
			path: 'helloWorld.txt',
			content: content
		}
		const file = await ipfs.add(fileToAdd);


		const text = await catFile(file.cid);

		setRemoteContent(text.toString());
		setFileCid(file.cid.toString());

	}


	return (
		<div className='sans-serif'>
			<header className='flex items-center pa3 bg-navy bb bw3 b--aqua'>
				<h1 className='flex-auto ma0 tr f3 fw2 montserrat aqua'>IPFS React</h1>
			</header>
			<main>
				<label>content</label>
				<textarea onChange={setContent} />

				<button onClick={handleSubmit}>handle submit</button>

				<p>
					<span>remote content {remoteContent}</span>
					<br/>
					<span>cid {fileCid}</span>
				</p>
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
					Learn React aa
				</a>
			</footer>
		</div>
	);
}
