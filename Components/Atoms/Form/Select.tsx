import React, { useEffect, useRef } from 'react';
import { FormHandleChange } from '@/Blu/Types/Form';

type Props = {
	name: string;
	value: string;
	defaultValue?: string;
	values: any;
	className?: string;
	required?: boolean;
	handleChange: FormHandleChange;
}

const Select: React.VFC<Props> = ({
	name,
	value,
	defaultValue='',
	values,
	className='',
	required=false,
	handleChange,
}) =>
{
	const handleSelectChange = (e) =>
	{
		handleChange({name: e.target.name, value: e.target.value});
	}

	return (<select
        name={name}
		className={className}
		onChange={(e) => handleSelectChange(e)}
		required={required}
		value={value === undefined ? defaultValue: value}
		defaultValue={defaultValue}
    >
		{Object.keys(values).map((key) => (
			<option
				key={key}
				value={key}
			>
				{values[key]}
			</option>
		))}
	</select>);
};

export default Select;