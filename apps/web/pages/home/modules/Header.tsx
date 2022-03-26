import React from 'react';
import styled from '@emotion/styled';

import { HEADER_HEIGHT } from '../../../styles/shared/const';

const HeaderContainer = styled.header`
	background: rgba(255,255,255,1);
	position: fixed;
	top: 0;
	z-index: 30;
	box-shadow: 0 -1px 10px rgb(55 55 55 / 10%);
	width: 100%;
`

const HeaderInner = styled.div`
	display: flex;
	align-items: stretch;
	height: ${HEADER_HEIGHT};
	padding: 0 40px;
	width: 100%;
	justify-content: space-between;
`

const HeaderLeftPart = styled.div`
	display: flex;
	align-items: center;
`
const HeaderTitle = styled.span`

`

const Header: React.FC = () => {

	return (
		<HeaderContainer>
			<HeaderInner>
				{/* logo title slogan */}
				<HeaderLeftPart>
					<HeaderTitle>
						BROCCOLT&nbsp;&&nbsp;CO.
					</HeaderTitle>
				</HeaderLeftPart>
				{/* avatar menu and some links */}
				<div />
			</HeaderInner>
		</HeaderContainer>
	)
}

export {
	Header,
}
