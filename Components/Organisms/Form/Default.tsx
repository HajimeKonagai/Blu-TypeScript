import React from 'react';

import Input      from '@/Blu/Components/Atoms/Form/Input';
import Textarea   from '@/Blu/Components/Atoms/Form/Textarea';
import Radios     from '@/Blu/Components/Atoms/Form/Radios';
import Select     from '@/Blu/Components/Atoms/Form/Select';
import Checkbox   from '@/Blu/Components/Atoms/Form/Checkbox';
import Checkboxes from '@/Blu/Components/Atoms/Form/Checkboxes';

const FormField = ({
	name,
	type,
	options=[],
	required=false,
	placeholder='',
	readonly=false,
	value,
	defaultValue=undefined,
	handleChange,
}) =>
{

	switch (type)
	{
	case 'textarea':
		return <Textarea
			name={name}
			value={value}
			defaultValue={defaultValue}
			className=""
			required={required}
			readonly={readonly}
			isFocused={false}
			handleChange={handleChange}
		/>

	case 'radio':
		return <Radios
			name={name}
			value={value}
			values={options}
			defaultValue={defaultValue}
			className=""
			required={required}
			handleChange={handleChange}
		/>

	case 'select':
		return <Select
			name={name}
			value={value}
			values={options}
			defaultValue={defaultValue}
			className=""
			required={required}
			handleChange={handleChange}
		/>

	case 'checkbox':
		return <Checkbox
			name={name}
			checked={value === undefined ? defaultValue == '1' : value == '1'}
			value={'1'}
			className=""
			handleChange={handleChange}
		/>

	case 'checkboxes':
		return <Checkboxes
			name={name}
			checked={value}
			values={options}
			className=""
			required={required}
			handleChange={handleChange}
		/>

	default:
		return <Input
			type={type}
			name={name}
			defaultValue={defaultValue}
			value={value}
			className=""
			required={required}
			placeholder={placeholder}
			readonly={readonly}
			isFocused={false}
			handleChange={handleChange}
		/>
	}
}

export default FormField;