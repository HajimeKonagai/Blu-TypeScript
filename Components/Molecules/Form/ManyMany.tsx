import React from 'react';
import Checkboxes from '@/Blu/Components/Atoms/Form/Checkboxes';

const ManyMany = ({
	fieldConfig,
	relationName,
	defaultValue,
	editValue,
	setEditValue,
}) =>
{
    const handleChange = ({ name,  value }) =>
    {
        setEditValue({
            name: relationName,
            value: value,
        });
    }

    const checked = editValue ? editValue : Array.isArray(defaultValue) && defaultValue.map((d) => d.id) ? defaultValue.map((d) => d.id): [] ; // TODO: editValue false 判定の値の処理

    return (<div className='many-many'>
		<Checkboxes
			name={relationName}
			checked={checked}
			values={fieldConfig['options']}
			className=""
			handleChange={handleChange}
		/>
	</div>);
}

export default ManyMany;