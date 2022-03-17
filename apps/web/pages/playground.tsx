import React, { useEffect, useState } from 'react';
import { CodeRunner } from 'code-runner';



const Playground: React.FC = () => {

	const [value, setValue] = useState('');
	const handleEditValueChange = (val) => {
		setValue(val);
	}

	useEffect(() => {
	}, [])

	const runCode = () => {
		console.log(value)
		// eval(value);
		const script = document.createElement('script');
		script.innerHTML = value;
		document.body.appendChild(script);
	}


	return (
		<>
			<button onClick={runCode}>run</button>
			<CodeRunner onChange={handleEditValueChange} height={'70vh'} />
		</>
	)
}

export default Playground;
