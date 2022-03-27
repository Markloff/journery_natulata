import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import dynamic from 'next/dynamic';

import { globalStyles } from '../../styles/shared';
import { Header } from './modules/Header';
import { Body } from './modules/Body';
import { Footer } from './modules/Footer';
import { IInviteForm, InviteForm } from './modules/InviteForm';
import { CGI_PATH, fetchCGI } from '../../utils/ajax';
import { css } from '@emotion/react';
const Modal = dynamic(() => import('../../components/Modal').then(module => module.Modal), { ssr: false })

const Wrapper = styled.div`
	height: 100%;
`;

const ColumnFlexWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-content: center;
`

export enum Status {
	Initialed = 1,
	Submitting,
	Error,
	Success
}

const Index: React.FC = () => {

	const [status, setStatus] = useState<Status>(Status.Initialed);
	const [errMessage, setErrMessage] = useState('');
	const [popupVisible, setPopVisible] = useState(false);
	const [popupTitle, setPopupTitle] = useState('Request an invite');
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		confirmedEmail: ''
	});

	const inviteFormRef = React.useRef<IInviteForm>();

	const popupButton = useMemo(() => {

		const handleSendButtonClick = () => {
			if (inviteFormRef && inviteFormRef.current) {
				if(inviteFormRef.current.validate() && status !== Status.Submitting) {
					const data = inviteFormRef.current.getData();
					setFormData(data as any);
					setStatus(Status.Submitting);
					fetchCGI(CGI_PATH.AUTH, { name: data.fullName, email: data.email }).then(result => {
						if (result.isCGISuccess) {
							setStatus(Status.Success);
							setErrMessage('');
							setPopupTitle('All done!')
						} else {
							setStatus(Status.Error);
							setErrMessage(result.errMessage)
						}
					})
				}
			}
		};

		const handleSuccessBtnClick = () => {
			setPopVisible(false);
			setTimeout(() => {
				setStatus(Status.Initialed);
			}, 200)
		}

		let content = '';
		let clickHandler = () => {};

		switch (status) {
			case Status.Initialed:
			case Status.Error:
				content = 'send';
				clickHandler = handleSendButtonClick;
				break;
			case Status.Submitting:
				content = 'Sending, please wait...';
				break;
			case Status.Success:
				content = 'Ok';
				clickHandler = handleSuccessBtnClick;
				break;
		}

		const buttonStyle = css`
			background-color: transparent;
			color: black;
			align-items: center;
			min-width: 6rem;
			white-space: nowrap;
			border-radius: .5rem;
			justify-content: center;
			border: 1px solid black;
			padding: .5rem .75rem;
			margin: .5rem 0;
			font-weight: 500;
			font-size: 1rem;
			opacity: ${status === Status.Submitting ? 0.25 : 1};
			${status !== Status.Submitting ? '&:hover { background-color: black; color: white }' : ''};
			cursor: ${status === Status.Submitting ? 'not-allowed' : 'pointer'};
		`;

		const errorMessageStyle = css`
			color: #ff7875;
			font-size: 0.85rem;
		`

		return (
			<ColumnFlexWrapper>
				<button css={buttonStyle} disabled={status === Status.Submitting} onClick={clickHandler}>
					{content}
				</button>
				{errMessage && (
					<p css={errorMessageStyle}>
						{errMessage}
					</p>
				)}
			</ColumnFlexWrapper>
		)
	}, [errMessage, status]);

	const handleInviteBtnClick = () => {
		setPopVisible(true);
	}

	const handleModalVisibilityChange = (val) => {
		setPopVisible(val);
	}


	const modalContent = useMemo(() => {
		switch (status) {
			case Status.Error:
			case Status.Initialed:
			case Status.Submitting:
				return (
					<>
						<InviteForm ref={inviteFormRef} data={formData} />
					</>
				);
			case Status.Success:
				return (
					<p>You will be one of the first to experience Broccoli & Co. when we launch</p>
				);
		}
	}, [errMessage, formData, status]);

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
