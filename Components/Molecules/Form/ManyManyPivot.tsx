import React from 'react';
import Checkbox from '@/Blu/Components/Atoms/Form/Checkbox';
import Field from '@/Blu/Components/Organisms/Form/Field';

import { isChanged } from '@/Blu/Classes/Form';

const PivotForm = ({
	id,
	fieldName,
	pivotConfig,
	defaultData,
	editData,
	setPivotEditValue,
	errors,
}) =>
{
	const setEditValue = ( { name, value } ) =>
	{
		const nameOrigin = originName(name);

		const newEditData = editData ? {...editData} : {};

		let changed = isChanged({
			type: pivotConfig[nameOrigin].type,
			nameOrigin: nameOrigin,
			value: value,
			defaultData: defaultData ? defaultData: {},
		});


		if (changed)
		{
			newEditData[nameOrigin] = value;
		}
		else
		{
			delete newEditData[nameOrigin];
		}

		// TODO: force delete and args
		

		/*
		if (pivotConfig[nameOrigin]['hook'] && pivotConfig[nameOrigin]['hook'] in formHooks)
		{
			newEditData = formHooks[config[nameOrigin]['hook']](
			{
				name: nameOrigin,
				defaultData: defaultData,
				editData: newEditData,
			});
		}
		*/

		setPivotEditValue({
			id: id,
			values: newEditData,
		})
	}


	const uniqueName = (name) =>
	{
		return `${fieldName}[pivot][${name}]`;
	}
	const originName = (nameUniqued) =>
	{
		return nameUniqued.replace(`${fieldName}[pivot][`, '').replace(']', '');
	}

	return (<>
		<div className='form-field'>
		{Object.keys(pivotConfig).map((name) => (
			<Field
				name={name}
				uniqueName={uniqueName(name)}
				type={pivotConfig[name].type}
				fieldConfig={pivotConfig[name]}
				defaultData={defaultData}
				editData={editData}
				setEditValue={setEditValue}
				errors={errors}
			/>
		))}
		</div>
	</>)
};

const ManyManyPivot = ({
	fieldConfig,
	relationName,
	defaultValue,
	editValue,
	setEditValue,
	errors,
}) =>
{

	console.log('ManyManyPivot fieldConfig', fieldConfig);

    const setPivotEditValue = ({id, values}) =>
    {
		const newEditValue = editValue ? {...editValue} : {};

		if (! (id in newEditValue)) newEditValue[id] = { id: id };

		if (Object.keys(values).length > 0)
		{
			newEditValue[id]['pivot'] = values;
		}
		else if (id in newEditValue)
		{
			delete newEditValue[id]['pivot'];
		}

        setEditValue({
            name: relationName,
            value: newEditValue,
        });
    }

	const checkBoxChenged = (name, value, id) =>
	{
		const newEditValue = editValue ? {...editValue} : {};

		if (! (id in newEditValue) ) newEditValue[id] = { id: id };

		newEditValue[id]['attach'] = value == '1' ? 1 :0; // checkbox の value が '1' なので

		if (
			! value && 
			! ('pivot' in newEditValue[id]) &&
			! (defaultValue && defaultValue.find(item => item.id == id))
		)
		{
			delete newEditValue[id];
		}

        setEditValue({
            name: relationName,
            value: newEditValue,
        });
	}



    return (<div className='many-many-pivot'>
		{Object.keys(fieldConfig.options).map((id) => {
			const label = fieldConfig.options[id];
			const fieldName = `${relationName}[${id}]`;
			const pivotDefaultData = defaultValue && defaultValue.find(item => item.id == id) && 'pivot' in defaultValue.find(item => item.id == id) ? defaultValue.find(item => item.id == id)['pivot'] : undefined;
			const pivotEditData = editValue && (id in editValue && 'pivot' in editValue[id]) ? editValue[id]['pivot'] : undefined;
			const checked = editValue && (id in editValue && 'attach' in editValue[id]) ? editValue[id]['attach'] == '1' : pivotDefaultData != undefined;

			return (<div className='form-field-group'>
				<div className='form-field'>
					<label>
						<Checkbox
							name={`${fieldName}[attach]`}
							value={'1'}
							checked={checked}
							className={''}
							handleChange={({name: name, value: value}) => checkBoxChenged(name, value, id)}
						/>
						{label}
					</label>
				</div>

				{checked && (
				<PivotForm
					id={id}
					fieldName={fieldName}
					pivotConfig={fieldConfig['relation']}
					defaultData={pivotDefaultData}
					editData={pivotEditData}
					setPivotEditValue={setPivotEditValue}
					errors={errors}
				/>
				) || (<></>)}
			</div>);
		})}
	</div>);
}



export default ManyManyPivot;