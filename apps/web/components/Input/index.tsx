import styled from '@emotion/styled';
import { css } from '@emotion/react'
import React from 'react';

const InputWrapper = styled.div`
	display: flex;
`;

type InputProps = React.InputHTMLAttributes<any>;

const Input: React.FC<InputProps> = (props) => {

	const styles = css`
		border: 1.5px solid rgba(0, 0, 0, 0.6);
		height: 2rem;
		flex: 1;
		padding: 0 0.5rem;
		&:focus {
			outline: none;
		}
	`

	return (
		<InputWrapper>
			<input {...props} css={styles} />
		</InputWrapper>
	)
}

export { Input };
export type { InputProps };
