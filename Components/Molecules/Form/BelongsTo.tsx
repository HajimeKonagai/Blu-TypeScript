import React, { useState, useEffect } from 'react';
import Select from '@/Blu/Components/Atoms/Form/Select';

const BelongsTo = ({
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

    return (<div className='belongs-to'>
		<Select
			name={relationName}
			value={editValue ? editValue : defaultValue ? defaultValue.id: 0} // TODO: false 判定になる値も入るので
			values={fieldConfig['options']}
			className=""
			handleChange={handleChange}
		/>
	</div>);
}

export default BelongsTo;