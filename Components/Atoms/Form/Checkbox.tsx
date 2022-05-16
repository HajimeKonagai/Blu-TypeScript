import React from 'react';
import { FormHandleChange } from '@/Blu/Types/Form';

type Props = {
	name: string;
	checked: boolean;
	value: string;
	className: string;
	handleChange: FormHandleChange;
}

const Checkbox: React.VFC<Props> = ({ name, checked, value, className, handleChange }) =>
{

	const handleCheckboxesChange = (e) =>
	{
		handleChange({name: name, value: e.target.checked ? value: '0'});
	}

	return (<input
		type="checkbox"
		name={name}
		checked={checked ? true : false}
		value={value}
		className={className}
		onChange={(e) => handleCheckboxesChange(e)}
	/>)
}


export default Checkbox;