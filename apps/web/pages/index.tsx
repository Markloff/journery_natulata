import React, { useEffect } from 'react';
import { Button } from 'ui';
import { GetStaticProps, NextPage } from 'next';
import { MdxFile } from '../server/content-reader';



type StaticProps = {
	mdxList: MdxFile[]
}
const IndexPage: NextPage<StaticProps> = (props) => {
	const { mdxList } = props;
	console.log(mdxList);

	useEffect(() => {

	}, [])

	return (
		<div>
			deploy with vercel
			<Button />

		</div>
	)
}

export default IndexPage;
