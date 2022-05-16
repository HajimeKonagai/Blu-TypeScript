import React, { useEffect, useRef } from 'react';
import { FormHandleChange } from '@/Blu/Types/Form';

type Props = {
	name: string;
	value: string;
	defaultValue?: string;
	values: any;
	className?: string;
	labelClassName?: string;
	autoComplete?: string;
	required?: boolean;
	handleChange: FormHandleChange;
}

const Radio: React.VFC<Props> = ({
	name,
	value,
	defaultValue='',
	values,
	className = '',
	labelClassName = '',
	required = false,
	handleChange,
}) =>
{
	const handleRadioChange = (e) =>
	{
		handleChange({name: e.target.name, value: e.target.value});
	}

	return (<>
		{Object.keys(values).map((key) => (
			<label
				className={labelClassName}
				key={key}
			>
				<input
					type="radio"
					name={name}
					value={key}
					defaultValue={defaultValue}
					checked={value !== undefined ? key == value: key == defaultValue}
					className={className}
					required={required}
					onChange={(e) => handleRadioChange(e)}
				/>
				{values[key]}
			</label>
		))}
	</>);
};

export default Radio;