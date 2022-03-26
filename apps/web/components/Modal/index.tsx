import React, { CSSProperties, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';


type ModalProps = {
	title: string;
	visible: boolean;
	button: React.ReactNode;
	onVisibilityChange?: (val: boolean) => void;
}


const ModalInnerContainer = styled.div`
	width: 18rem;
	background-color: white;
	box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
	border: 0;
	border-radius: 2px;
	background-clip: padding-box;
	padding: 2rem 1.5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	transition: ease-in-out all 0.25s;
	position: relative;
	z-index: 2000;
`;



const Title = styled.span`
	font-weight: bold;
	text-align: center;
	margin-bottom: .5rem;
	font-size: 1.5rem;
`

const SplitLine = styled.div`
	width: 10%;
	height: 1px;
	background: rgba(0,0,0,0.65);
	margin-bottom: 1.85rem;
`
const Content = styled.div`
	width: 100%;
`;

const Mask = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	z-index: 1500;
`

const Button = styled.button`

`

const ButtonGroup = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`


/**
 * TODO 时间优先，简单封装一下，props 设计的不是很通用、合理，仅针对本次测试题的几个场景进行覆盖
 */
const _Modal: React.FC<ModalProps> = (props) => {
	const { title, children, visible, button, onVisibilityChange } = props;

	const [innerVisibleState, setInnerVisibleState] = useState(visible);

	useEffect(() => {
		setInnerVisibleState(visible);
	}, [visible])


	const handleWrapperClick = (ev: React.MouseEvent<HTMLDivElement>) => {
		setInnerVisibleState(false);
		onVisibilityChange?.(false);
	}

	const ModalWrapper = styled.div`
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		justify-content: center;
		display: ${innerVisibleState ? 'flex': 'none'};
		align-items: center;
		background-color: rgba(0, 0, 0, 0.22);
	`;

	return ReactDOM.createPortal((
		<ModalWrapper>
			<Mask  onClick={handleWrapperClick} />
			<ModalInnerContainer>
				<Title>
					{title}
				</Title>
				<SplitLine />
				<Content>
					{children}
				</Content>
				{button}
			</ModalInnerContainer>
		</ModalWrapper>
	), document.body);
}


const Modal: React.FC<ModalProps> = (props) => <_Modal {...props} />

export {
	Modal,
};
export type { ModalProps };

