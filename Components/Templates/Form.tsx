import React from 'react';
import FormField from '@/Blu/Components/Organisms/Form/Field';
import { useFormContext } from '@/Blu/Contexts/Form';

import { isChanged } from '@/Blu/Classes/Form'
import { ADDRCONFIG } from 'dns';

const Form = ({
	config,
	formName,
	defaultData,
	editData,
	setEditData,
	errors={},
}) =>
{
	const { formHooks } = useFormContext();

	const setEditValue = ( args ) =>
	{
		if (!Array.isArray(args))
		{
			args = [args];
		}

		setEditData((prevData) =>
		{
			let newEditData = {...prevData};

			args.map((arg) =>
			{
				const { name, value } = arg;

				const nameOrigin = originName(name);

				let changed = isChanged({
					type: config[nameOrigin].type,
					nameOrigin: nameOrigin,
					value: value,
					defaultData: defaultData,
				});
		
		
				if (changed)
				{
					newEditData[nameOrigin] = value;
				}
				else
				{
					delete newEditData[nameOrigin];
				}
		
				if ( 'forceDelete' in arg && arg.forceDelete)
				{
					delete newEditData[nameOrigin];
				}

				if (config[nameOrigin]['hook'] && config[nameOrigin]['hook'] in formHooks)
				{
					newEditData = formHooks[config[nameOrigin]['hook']](
					{
						name: nameOrigin,
						defaultData: defaultData,
						editData: newEditData,
					});
				}
			});

			return newEditData;
		});
	}

	const uniqueName = (name) =>
	{
		return formName + name;
	}
	const originName = (nameUniqued) =>
	{
		return nameUniqued.replace(formName, '');
	}

	return (<div className='form'>
		{Object.keys(config).map((name) => {
			return (
				<FormField
					type={config[name].type}
					name={name}
					uniqueName={uniqueName(name)}
					fieldConfig={config[name]}
					defaultData={defaultData}
					editData={editData}
					setEditValue={setEditValue}
					errors={errors}
				/>
			)
		})}
	</div>);
}

export default Form;