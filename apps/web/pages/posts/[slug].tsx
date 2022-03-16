import fs from 'fs'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import path from 'path';
import CustomLink from '../../components/CustomLink'

import { postFilePaths, POSTS_PATH } from '../../utils/mdx';
import { CodeRunner } from 'code-runner';
import PostPageBody from '../../view/PostPage';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';


// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
	a: CustomLink,
	// It also works with dynamically-imported components, which is especially
	// useful for conditionally loading components for certain routes.
	// See the notes in README.md for more details.
	TestComponent: dynamic(() => import('../../components/TestComponent')),
	Head,
	CodeRunner,
}

export default function PostPage({ source, frontMatter }) {
	return (
		<>
			<header>
				<nav>
					<Link href="/">
						<a>👈 Go back home</a>
					</Link>
				</nav>
			</header>
			<div className="post-header">
				<h1>{frontMatter.title}</h1>
				{frontMatter.description && (
					<p className="description">{frontMatter.description}</p>
				)}
			</div>
			<main>
				<PostPageBody source={source} components={components} />
			</main>
		</>
	)
}


export const getStaticProps = async ({ params }) => {
	const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`)

	const source = fs.readFileSync(postFilePath)

	const { content, data } = matter(source)

	const mdxSource = await serialize(content, {
		// Optionally pass remark/rehype plugins
		mdxOptions: {
			remarkPlugins: [],
			rehypePlugins: [],
		},
		scope: data,
	})

	const result = {
		source: mdxSource,
		frontMatter: data,
	}

	return {
		props: result
	};
}

export const getStaticPaths = async () => {
	const paths = postFilePaths
		// Remove file extensions for page paths
		.map((path) => path.replace(/\.mdx?$/, ''))
		// Map the path into the static paths object required by Next.js
		.map((slug) => ({ params: { slug } }))

	return {
		paths,
		fallback: false,
	}
}
