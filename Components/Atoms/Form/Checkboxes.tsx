import React from 'react';
import Checkbox from './Checkbox';
import { FormHandleChange } from '@/Blu/Types/Form';

type Props = {
	name: string;
	checked: string[];
	values: any;
	className: string;
	labelClassName?: string;
	required?: boolean;
	handleChange: FormHandleChange;
}

const Chckboxes: React.VFC<Props> = ({
	name,
	checked,
	values,
	className,
	labelClassName = '',
	required=false,
	handleChange,
}) =>
{
	const handleCheckboxesChange = (e) =>
	{
		const newChecked = checked.slice();
		const key = e.target.name.replace(`${name}[`, '').replace(']', '');

		if (e.target.checked)
		{
			if (checked.findIndex(element => element == key) == -1) newChecked.push(key);
		}
		else
		{
			if (checked.findIndex(element => element == key) > -1) newChecked.splice(checked.findIndex(element => element == key), 1);
		}

		handleChange({name: name, value: newChecked});
	}

	return (<>
		{Object.keys(values).map((key) => (
			<label
				className={labelClassName}
				key={key}
			>
				<Checkbox
					name={`${name}[${key}]`}
					value={key}
					checked={checked.findIndex(element => element == key) > -1}
					className={className}
					handleChange={handleCheckboxesChange}
				/>
				{values[key]}
			</label>
		))}
	</>);
};

export default Chckboxes;