import React from 'react';
import Bulk from '@/Blu/Components/Widgets/Bulk';

const HasMany = ({
	fieldConfig,
	relationName,
	defaultValue,
	editValue,
	setEditValue,
	errors=[],
}) =>
{
    const sortName = Object.keys(fieldConfig['relation']).find((key) => fieldConfig['relation'][key].type == 'order');

	const setBulkEditValue = (value) =>
	{
		setEditValue({ name: relationName, value: value });
	}

	const tmp = defaultValue ? defaultValue: [];

    return (<div className='has-many'>
		<Bulk
			bulkName={relationName}
			config={fieldConfig['relation']}
            sortName={sortName}
			defaultDataArr={defaultValue ? defaultValue: []}
            editDataArr={editValue !== undefined ? editValue: []}
            setBulkEditValue={setBulkEditValue}
			allowAdd={'allowAdd' in fieldConfig? fieldConfig['allowAdd'] : true}
			allowDelete={'allowDelete' in fieldConfig? fieldConfig['allowDelete'] : true}
			errors={errors}
		/>
	</div>);
}

export default HasMany;