import { MDXRemote } from 'next-mdx-remote';


export default function PostPageBody({ source, components }) {
	return (
		<MDXRemote {...source} components={{...components }} />
	)
}
