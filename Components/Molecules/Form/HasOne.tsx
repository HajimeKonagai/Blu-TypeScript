import React, { useState, useEffect } from 'react';
import Field from '@/Blu/Components/Organisms/Form/Field';

const HasOne = ({
	fieldConfig,
	relationName,
	defaultValue,
	editValue,
	setEditValue,
	errors={},
}) =>
{
	const handleChange = ({ name, value }) =>
	{
		const newEditValue = {...editValue};

		const nameOrigin = originName(name);

		if (!defaultValue || value != defaultValue[name]) // TODO: defaultValue が一致してしまうと POST されない?
		{
			newEditValue[nameOrigin] = value;
		}
		else
		{
			delete newEditValue[nameOrigin];
		}

		setEditValue({
			name: relationName,
			value: newEditValue,
		});
	}

	const uniqueName = (name) =>
	{
		return relationName + '[' + name + ']';
	}
	const originName = (nameUniqued) =>
	{
		return nameUniqued.replace(relationName + '[', '').replace(']', '');
	}


	return (<div className='has-one'>
		{Object.keys(fieldConfig['relation']).map((name) => {

			let value = '';

			if (defaultValue && name in defaultValue)
			{
				value = defaultValue[name];
			}
			else if ('default' in fieldConfig['relation'][name])
			{
				value = fieldConfig['relation'][name]['default'];
			}

			return (<div>
				<Field
					name={name}
					uniqueName={uniqueName(name)}
					type={fieldConfig['relation'][name].type}
					fieldConfig={fieldConfig['relation'][name]}
					defaultData={defaultValue}
					editData={editValue}
					setEditValue={handleChange}
					errors={errors}
				/>
			</div>)
		})}
	</div>)
}

export default HasOne;