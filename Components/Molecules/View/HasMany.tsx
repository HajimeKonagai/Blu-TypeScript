import React from 'react';
import Field from '@/Blu/Components/Organisms/View/Field';

const HasMany = ({
	relationName,
	fieldConfig,
	defaultData,
}) =>
{
	const hasManyData = relationName in defaultData && Array.isArray(defaultData[relationName]) ? defaultData[relationName] : [];

	return <div className='bulk'>
	{hasManyData.map((items) => (
		<div className='bulk-rows'>
				<div className='input-group bulk-row'>
					{Object.keys(fieldConfig.relation).map((fieldName) => (
						<div className={`input-field ${fieldName}`}>
						<label>
							{fieldConfig.relation[fieldName].label}
						</label>
						<Field
							name={fieldName}
							fieldConfig={fieldConfig.relation[fieldName]}
							defaultData={items}
						/>
						</div>
					))}
				</div>
		</div>
	))}
	</div>;
}

export default HasMany;