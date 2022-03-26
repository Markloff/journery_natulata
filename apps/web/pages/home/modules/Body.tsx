import React from 'react';
import styled from '@emotion/styled';

const BodyContainer = styled.main`
	display: flex;
	height: 100%;
`

const BodyWrapper = styled.div`
	margin: auto;
	text-align: center;
`

const BodySubTitle = styled.h2`
	font-weight: lighter;
	font-size: 18px;
`
const Button = styled.button`
	background-color: rgba(255, 102, 102, 1);
	align-items: center;
	cursor: pointer;
	white-space: nowrap;
	justify-content: center;
	border: 1px solid transparent;
	padding: .5rem .75rem;
	margin: .5rem 0;
	font-weight: 500;
	border-radius: 1rem;
	color: white;
	font-size: 1rem;
	opacity: 0.95;
	&:hover {
		opacity: 1;
	}
`;

type Props = {
	onInviteButtonClick?: () => void;
}

const Body: React.FC<Props> = (props) => {
	const { onInviteButtonClick } = props;

	const handleInviteBtnClick = () => {
		onInviteButtonClick?.();
	}

	return (
		<BodyContainer>
			<BodyWrapper>
				<h1>A better way to enjoy every day.</h1>
				<BodySubTitle>
					Be the first to know when we launch.
				</BodySubTitle>
				<Button onClick={handleInviteBtnClick}>Request an invite</Button>
			</BodyWrapper>
		</BodyContainer>
	)
}

export {
	Body
}
