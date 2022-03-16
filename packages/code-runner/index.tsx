import React from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';
type CodeRunnerProps = EditorProps & {}

export const CodeRunner: React.FC<CodeRunnerProps> = (props) => {

	return (
		<div>
			<Editor
				defaultLanguage='typescript'
				options={{
					fontSize: 14,
					fontFamily: '"Cascadia Mono-SemiLight",Menlo,Monaco,Consolas,monospace',
				}}
				theme={'vs-dark'}
				{...props}
			/>
		</div>
	)
}



