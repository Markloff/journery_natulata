import { MDXRemote } from 'next-mdx-remote';
import Container from '../components/Container';
import { Button } from 'theme-ui';

export default function PostPageBody({ source, components }) {
	return (
		<Container>
			<MDXRemote {...source} components={{...components, Button }} />
		</Container>
	)
}
