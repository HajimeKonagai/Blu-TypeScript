import React, { useEffect, useRef } from 'react';
import { FormHandleChange } from '@/Blu/Types/Form';

type Props = {
	name: string;
	value: string | undefined;
	handleChange: FormHandleChange;

	defaultValue?: string;
	className?: string;
	autoComplete?: string;
	required?: boolean;
	readonly?: boolean;
	isFocused?: boolean;
}

const Textarea: React.VFC<Props> = ({
	name,
	value,
	defaultValue='',
	className='',
	autoComplete='',
	required=false,
	readonly=false,
	isFocused=false,
	handleChange,
}) => 
{
	const input = useRef() as React.MutableRefObject<HTMLTextAreaElement>;

	useEffect(() => {
		if (isFocused && input.current)
		{
			input.current.focus();
		}
	}, []);


	const handleTextareaChange = (e) =>
	{
		handleChange({name: e.target.name, value: e.target.value});
	}

	return (<textarea
		name={name}
		value={value === undefined ? defaultValue: value}
		defaultValue={defaultValue}
		className={className}
		ref={input}
		autoComplete={autoComplete}
		required={required}
		readOnly={readonly}
		onChange={handleTextareaChange}
	/>);
};

export default Textarea;