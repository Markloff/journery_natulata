import React, { useMemo, useState } from 'react';
import { Input } from '../../../components/Input';
import styled from '@emotion/styled';
import { normalizeRepeatedSlashes } from 'next/dist/shared/lib/utils';
import { isEmailValid, isFullNameValid } from '../../../utils/validate';


interface IInviteForm {
	validate(): boolean;
}

// TODO 没有太多时间去封装一个类似Ant Design 那样的 Form / FormItem 就先简单表示一下
const InviteForm = React.forwardRef<IInviteForm, {}>((props, ref) => {
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [confirmedEmail, setConfirmedEmail] = useState('');



	const [fullNameHighlight, setFullNameHighlight] = useState(false);
	const [emailHighlight, setEmailHighlight] = useState(false);
	const [confirmedEmailHighlight, setConfirmedEmailHighlight] = useState(false);



	const handleInputValueChange = (value: string, filed: string) => {
		switch (filed) {
			case 'fullName':
				setFullName(value);
				break;
			case 'email':
				setEmail(value);
				break;
			case 'confirmedEmail':
				setConfirmedEmail(value);
				break;
		}
	}

	const reset = () => {
		setFullNameHighlight(false);
		setEmailHighlight(false);
		setConfirmedEmailHighlight(false);
	}

	const validate = (): boolean => {
		reset();
		if (!fullName || !isFullNameValid(fullName)) {
			setFullNameHighlight(true);
			return false;
		}

		if (!email || !isEmailValid(email)) {
			setEmailHighlight(true);
			return false;
		}
		if (!confirmedEmail || !isEmailValid(confirmedEmail) || confirmedEmail !== email) {
			setConfirmedEmailHighlight(true);
			return false;
		}
		console.log('true')
		return true;
	}

	React.useImperativeHandle(ref, () => ({
		validate
	}))

	const FullNamInput = useMemo(() => {
		return (
			<Input
				defaultValue={fullName}
				highlight={fullNameHighlight}
				type={'text'}
				placeholder={'Full Name'}
				onChange={(ev: React.ChangeEvent<HTMLInputElement>) => handleInputValueChange(ev.target.value, 'fullName')}
			/>
		)
	}, [fullName, fullNameHighlight]);

	const EmailInput = useMemo(() => {
		return (
			<Input
				defaultValue={email}
				highlight={emailHighlight}
				type={'email'}
				placeholder={'Email'}
				onChange={(ev: React.ChangeEvent<HTMLInputElement>) => handleInputValueChange(ev.target.value, 'email')}
			/>
		)
	}, [email, emailHighlight]);

	const ConfirmedEmailInput = useMemo(() => {
		return (
			<Input
				highlight={confirmedEmailHighlight}
				type={'email'}
				placeholder={'Confirm Email'}
				onChange={(ev: React.ChangeEvent<HTMLInputElement>) => handleInputValueChange(ev.target.value, 'confirmedEmail')}
			/>
		)
	}, [confirmedEmailHighlight]);

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
