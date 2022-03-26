import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import dynamic from 'next/dynamic';

import { globalStyles } from '../../styles/shared';
import { Header } from './modules/Header';
import { Body } from './modules/Body';
import { Footer } from './modules/Footer';
import { Input } from '../../components/Input';
import { IInviteForm, InviteForm } from './modules/InviteForm';
const Modal = dynamic(() => import('../../components/Modal').then(module => module.Modal), { ssr: false })
const Wrapper = styled.div`
	height: 100%;
`;

export enum Status {
	Initialed = 1,
	Submitting,
	Error,
	Success
}
const Button = styled.button`
			background-color: transparent;
			color: black;
			align-items: center;
			cursor: pointer;
			width: 6rem;
			white-space: nowrap;
			border-radius: .5rem;
			justify-content: center;
			border: 1px solid black;
			padding: .5rem .75rem;
			margin: .5rem 0;
			font-weight: 500;
			font-size: 1rem;
			&:hover {
				background-color: black;
				color: white;
			}
		`;

const Index: React.FC = () => {

	const [status, setStatus] = useState<Status>(Status.Initialed);
	const [popupVisible, setPopVisible] = useState(false);
	const [popupTitle, setPopupTitle] = useState('Request an invite');

	const inviteFormRef = React.useRef<IInviteForm>();

	const popupButton = useMemo(() => {

		const handleSendButtonClick = () => {
			if (inviteFormRef && inviteFormRef.current) {
				inviteFormRef.current.validate();
			}
		}
		const sendButton = (
			<Button onClick={handleSendButtonClick}>
				send
			</Button>
		)

		const errorButton = (
			<Button onClick={handleSendButtonClick}>
				send
			</Button>
		)


		const buttons = {
			[Status.Initialed]: sendButton,
			[Status.Error]: errorButton,
		}
		return buttons[status];
	}, [status]);

	const handleInviteBtnClick = () => {
		setPopVisible(true);
	}

	const handleModalVisibilityChange = (val) => {
		setPopVisible(val);
	}


	const modalContent = useMemo(() => {
		switch (status) {
			case Status.Error:
				return <div></div>;
			case Status.Initialed:
			case Status.Submitting:
			case Status.Success:

				return (
					<>
						<InviteForm ref={inviteFormRef} />
					</>
				);
		}
	}, [status]);

	return (
		<>
			{globalStyles}
			<Wrapper>
				<Header />
				<Body onInviteButtonClick={handleInviteBtnClick} />
				<Footer />
				<Modal title={popupTitle} visible={popupVisible} button={popupButton} onVisibilityChange={handleModalVisibilityChange}>
					{modalContent}
				</Modal>
			</Wrapper>
		</>
	)
}

export default Index;
