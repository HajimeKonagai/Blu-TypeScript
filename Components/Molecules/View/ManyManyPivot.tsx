import React from 'react';
import Field from '@/Blu/Components/Organisms/View/Field';

const ManyManyPivot = ({
	relationName,
	fieldConfig,
	defaultData,
}) =>
{
	const manyManyData = relationName in defaultData && Array.isArray(defaultData[relationName]) ? defaultData[relationName] : [];

	return (<div className='many-many-pivot'>
		{Object.keys(fieldConfig.options).map((id) => {
			const label = fieldConfig.options[id];
			const pivotDefaultValue = manyManyData && manyManyData.find(item => item.id == id) && 'pivot' in manyManyData.find(item => item.id == id) ? manyManyData.find(item => item.id == id)['pivot'] : undefined;

			if (!pivotDefaultValue) return <></>;

			return (<div className='form-field-group'>
				<div className={`form-field option`}>
					{fieldConfig.options[id]}
				</div>
				
				{Object.keys(fieldConfig['relation']).map((fieldName) => (
				<div className={`form-field ${fieldName}`}>
					<Field
						name={fieldName}
						fieldConfig={fieldConfig.relation[fieldName]}
						defaultData={pivotDefaultValue}
					/>
				</div>
				))}
			</div>);
		})}
	</div>);
	
}

export default ManyManyPivot;