import React, { useEffect, useRef } from 'react';
import { FormHandleChange } from '@/Blu/Types/Form';

type Props = {
	type?: string;
	name: string;
	value: string|undefined;
	defaultValue?: string;
	className?: string;
	autoComplete?: string;
	required?: boolean;
	placeholder?: string;
	readonly?: boolean;
	isFocused?: boolean;
	handleChange: FormHandleChange;
}

const Input: React.VFC<Props> = ({
	type = 'text',
	name,
	value,
	defaultValue = '',
	className    = '',
	autoComplete = '',
	required     = false,
	placeholder  = '',
	readonly     = false,
	isFocused    = false,
	handleChange,
}) => 
{
	const input = useRef() as React.MutableRefObject<HTMLInputElement>;

	useEffect(() => {
		if (isFocused && input.current)
		{
			input.current.focus();
		}
	}, []);

	const handleInputChange = (e) =>
	{
		handleChange({name: e.target.name, value: e.target.value});
	}

	return (<input
		type={type}
		name={name}
		value={value === undefined ? defaultValue: value}
		defaultValue={defaultValue}
		className={className}
		ref={input}
		autoComplete={autoComplete}
		required={required}
		placeholder={placeholder}
		readOnly={readonly}
		onChange={(e) => handleInputChange(e)}
	/>);
};

export default Input;