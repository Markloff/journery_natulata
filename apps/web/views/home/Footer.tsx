import React from 'react';
import styled from '@emotion/styled';
import { HEADER_HEIGHT } from '../../styles/shared/const';


const FooterContainer = styled.footer`
	position: fixed;
	bottom: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	box-shadow: 0 -1px 10px rgb(55 55 55 / 10%);
	padding: 5px 0;
	height: ${HEADER_HEIGHT};
	justify-content: center;
	z-index: 30;
	background: white;
	p {
		margin: 8px 0 0 0;
		text-align: center;
		font-size: 0.16rem;

	}
`


const Footer: React.FC = () => {

	return (
		<FooterContainer>
			<p>Made With ❤ in Melbourne</p>
			<p>© 2016 Broccoli & Co. All rights reserved.</p>
		</FooterContainer>
	)
}


export {
	Footer
}

