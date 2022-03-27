import React, { useMemo, useState } from 'react';
import { Input } from '../../../components/Input';
import { isEmailValid, isFullNameValid } from '../../../utils/validate';
import { css } from '@emotion/react';


interface IInviteForm {
	validate(): boolean;
	getData(): Record<string, any>;
}

type FormProps = {
	data: Record<string, any>;
}


type FormItemProps = {
	validate: boolean;
	message: string;
}

const FormItem: React.FC<FormItemProps> = (props) => {
	const { children, validate, message } = props;

	const wrapperStyle = css`
		position: relative;
		margin-bottom: .2rem;
	`;

	const innerItemStyle = css`
		border: 1px solid ${validate ? 'transparent' : '#ff7875'};
		padding: 0.5px;
		//position: absolute;
	`;

	const validateMessageWrapperStyle = css`
		font-size: 0.85rem;
		color: #ff7875;
		height: 1rem;
	`

	return (
		<div css={wrapperStyle}>
			<div css={innerItemStyle}>
				{children}
			</div>
			<div css={validateMessageWrapperStyle}>
				{message}
			</div>
		</div>
	)
}

// TODO 没有太多时间去封装一个类似Ant Design 那样的 Form / FormItem 就先简单表示一下
const InviteForm = React.forwardRef<IInviteForm, FormProps>((props, ref) => {
	const { data } = props;

	const [formData, setFormData] = useState(data);
	const [validateInfo, setValidateInfo] = useState({
		fullName: {
			validate: true,
			message: '',
		},
		email: {
			validate: true,
			message: '',
		},
		confirmedEmail: {
			validate: true,
			message: '',
		}
	});

	const { fullName, email, confirmedEmail } = formData;
	const { fullName: fullNameValidateInfo, email: emailValidateInfo, confirmedEmail: confirmedValidateEmailInfo } = validateInfo;


	const handleInputValueChange = (value: string, filed: string) => {
		setFormData(prevState => ({
			...prevState,
			[filed]: value
		}))
	}

	const reset = () => {
		setValidateInfo({
			fullName: {
				validate: true,
				message: '',
			},
			email: {
				validate: true,
				message: '',
			},
			confirmedEmail: {
				validate: true,
				message: '',
			}
		})
	}

	const validate = (): boolean => {
		reset();

		const validateResult = [];
		if (!fullName || !isFullNameValid(fullName)) {
			validateResult.push({
				fullName: {
					validate: false,
					message: fullName ? 'Please enter a valid full name' : 'Please input your full name'
				}
			})
		}
		//
		if (!email || !isEmailValid(email)) {
			validateResult.push({
				email: {
					validate: false,
					message: email ? 'Please enter a valid email address' : 'Please input email'
				}
			});
		}
		if (!confirmedEmail) {
			validateResult.push({
				confirmedEmail: {
					validate: false,
					message: 'Please enter an email address for confirm'
				}
			});
		} else if (!isEmailValid(confirmedEmail) || confirmedEmail !== email) {
			validateResult.push({
				confirmedEmail: {
					validate: false,
					message: 'Please enter the same email as your email'
				}
			});
		}

		if (validateResult.length > 0) {
			const newValidateState = validateResult.reduce((prev, curr) => {
				return {
					...prev,
					...curr
				}
			}, {});
			setValidateInfo(prevState => ({
				...prevState,
				...newValidateState
			}))
		}

		return validateResult.length === 0;
	}

	React.useImperativeHandle(ref, () => ({
		validate,
		getData(): Record<string, any> {
			return formData;
		}
	}))

	const FullNamInput = useMemo(() => {
		return (
			<FormItem validate={fullNameValidateInfo.validate} message={fullNameValidateInfo.message}>
				<Input
					defaultValue={fullName}
					type={'text'}
					placeholder={'Full Name'}
					onChange={(ev: React.ChangeEvent<HTMLInputElement>) => handleInputValueChange(ev.target.value, 'fullName')}
				/>
			</FormItem>
		)
	}, [fullName, fullNameValidateInfo]);

	const EmailInput = useMemo(() => {
		return (
			<FormItem validate={emailValidateInfo.validate} message={emailValidateInfo.message}>
				<Input
					defaultValue={email}
					type={'email'}
					placeholder={'Email'}
					onChange={(ev: React.ChangeEvent<HTMLInputElement>) => handleInputValueChange(ev.target.value, 'email')}
				/>
			</FormItem>
		)
	}, [email, emailValidateInfo]);

	const ConfirmedEmailInput = useMemo(() => {
		return (
			<FormItem validate={confirmedValidateEmailInfo.validate} message={confirmedValidateEmailInfo.message}>
				<Input
					defaultValue={confirmedEmail}
					type={'email'}
					placeholder={'Email'}
					onChange={(ev: React.ChangeEvent<HTMLInputElement>) => handleInputValueChange(ev.target.value, 'confirmedEmail')}
				/>
			</FormItem>
		)
	}, [confirmedEmail, confirmedValidateEmailInfo]);

	return (
		<div>
			{FullNamInput}
			{EmailInput}
			{ConfirmedEmailInput}
		</div>
	)

})

InviteForm.displayName = 'InviteForm';

export {
	InviteForm,
}
export type { IInviteForm }
