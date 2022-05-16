import React from 'react';
import Default            from '@/Blu/Components/Organisms/Form/Default';
import HasOne             from '@/Blu/Components/Molecules/Form/HasOne';
import HasMany            from '@/Blu/Components/Molecules/Form/HasMany';
import BelongsTo          from '@/Blu/Components/Molecules/Form/BelongsTo';
import ManyMany           from '@/Blu/Components/Molecules/Form/ManyMany';
import ManyManyPivot      from '@/Blu/Components/Molecules/Form/ManyManyPivot';
import Reference from '@/Blu/Components/Molecules/Form/Reference';

import { useFormContext } from '@/Blu/Contexts/Form';

type Props = {
	type: string;
	name: string;
	uniqueName: string;
	fieldConfig: any;
	defaultData: any;
	editData: any|undefined;
	setEditValue: any; // TODO: function
	errors: any,
}

const FormField:React.VFC<Props> = (props) =>
{
	const { name, fieldConfig, editData, errors } = props;

	const fieldErrors = errors && name in errors ? errors[name]: [];

	if (fieldConfig.type == 'hidden')
	{
		return (<InputField
			{...props}
		/>);
	}

	return (<div className={`input-field ${name}`}>

		{fieldConfig.label && (
			<label>
				{fieldConfig.label}
				{(editData && name in editData) && (<span className="edit">edit</span>)}
			</label>
		)}

		
		<InputField
			{...props}
		/>
	
		{Array.isArray(fieldErrors) && fieldErrors.length > 0 && (
			<span className="error">
			{fieldErrors.map((error) => (
				(typeof error === "string" || error instanceof String) && (error) || ('')
			))}
			</span>
		)}

		{fieldConfig.description && (
			<span className="description">
				{fieldConfig.description}
			</span>
		)}

	</div>);
}



export const InputField:React.VFC<Props> = ({
	type,
	name,
	uniqueName,
	fieldConfig,
	defaultData,
	editData,
	setEditValue,
	errors,
}) =>
{
	const defaultValue = defaultData && name in defaultData ? defaultData[name] : undefined;
	const editValue = editData && name in editData ? editData[name]: undefined;
	const fieldErrors = errors && name in errors ? errors[name]: [];

	const { formComponents } = useFormContext();

	if (type in formComponents)
	{
		return formComponents[type]({
			fieldConfig  : fieldConfig,
			defaultValue : defaultValue,
			defaultData: defaultData,
			editValue    : editValue,
			editData    : editData,
			relationName : uniqueName,
			setEditValue : setEditValue,
			fieldErrors: fieldErrors,
		});
	}

	switch (type)
	{
	case 'raw':
		if (fieldConfig.attribute)
		{
			return fieldConfig.attribute in defaultData ? <>{defaultData[fieldConfig.attribute]}</>: <></>;
		}
		return <>{defaultValue}</>;
		break;

	case 'Reference':
		return <Reference
			fieldConfig={fieldConfig}
			defaultValue={defaultValue}
			defaultData={defaultData}
			editValue={editValue}
			editData={editData}
			relationName={uniqueName}
			setEditValue={setEditValue}
		/>
		break;

	// こっから下は defaultData, editData なしでいける

	case 'hasOne':
		return <HasOne
			fieldConfig={fieldConfig}
			defaultValue={defaultValue}
			editValue={editValue}
			relationName={uniqueName}
			setEditValue={setEditValue}
			errors={fieldErrors}
		/>
		break;
	case 'hasMany':
		return <HasMany
			fieldConfig={fieldConfig}
			defaultValue={defaultValue}
			editValue={editValue}
			relationName={uniqueName}
			setEditValue={setEditValue}
			errors={fieldErrors}
		/>
		break;
	case 'belongsTo':
		return <BelongsTo
			fieldConfig={fieldConfig}
			defaultValue={defaultValue}
			editValue={editValue}
			relationName={uniqueName}
			setEditValue={setEditValue}
		/>
		break;

	case 'manyMany':
		return <ManyMany
			fieldConfig={fieldConfig}
			defaultValue={defaultValue}
			editValue={editValue}
			relationName={uniqueName}
			setEditValue={setEditValue}
		/>
		break;

	case 'manyManyPivot':
		return <ManyManyPivot
			fieldConfig={fieldConfig}
			defaultValue={defaultValue}
			editValue={editValue}
			relationName={uniqueName}
			setEditValue={setEditValue}
			errors={fieldErrors}
		/>
		break;


	case 'order':
		return <Default
			name={uniqueName}
			type='text'
			options={fieldConfig.options ? fieldConfig.options: []}
			required={fieldConfig.required ? true :false}
			readonly={true}
			defaultValue={defaultValue}
			// editValue={editValue}
			value={editValue} // TODO: fales 判定
			handleChange={setEditValue}
		/>
		break;

	default:
		return <>
			<Default
				name={uniqueName}
				type={type}
				options={fieldConfig.options ? fieldConfig.options: []}
				required={fieldConfig.required ? true :false}
				placeholder={fieldConfig.placeholder ? fieldConfig.placeholder: ''}
				readonly={fieldConfig.readonly ? true :false}
				defaultValue={defaultValue}
				// editValue={editValue}
				value={editValue} // TODO: fales 判定
				handleChange={setEditValue}
			/>
		</>
		break;
	}
}

export default FormField;