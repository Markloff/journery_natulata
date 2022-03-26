import styled from '@emotion/styled';
import { css } from '@emotion/react'
import React from 'react';

const InputWrapper = styled.div`
	margin-bottom: .8rem;
	display: flex;
`;

type InputProps = React.InputHTMLAttributes<any> & {
	highlight: boolean;
}

const Input: React.FC<InputProps> = (props) => {
	const { highlight, ...rest } = props;

	const styles = css`
		border: 1.5px solid ${highlight ? 'red' : 'rgba(0, 0, 0, 0.6)'};
		height: 2rem;
		flex: 1;
		padding: 0 0.5rem;
		&:focus {
			outline: none;
		}
	`

	return (
		<InputWrapper>
			<input {...rest} css={styles} />
		</InputWrapper>
	)
}

export { Input };
export type { InputProps };
