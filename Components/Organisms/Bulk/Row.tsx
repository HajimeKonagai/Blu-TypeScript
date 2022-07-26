import React, { useState, useEffect } from 'react';
import {SortableElement, SortableHandle} from 'react-sortable-hoc';
import Field from '@/Blu/Components/Organisms/Form/Field';

import * as icon from '@/Blu/General/Icon';
import { parseQueryArgs } from 'react-query/types/core/utils';

const BulkSortHandle = SortableHandle(({}) =>
{
	return (
		<span className="_drag-handle icon drag button">
			<icon.moveVertical />
		</span>
	);
});

const BulkRow = SortableElement(({
	config,
	defaultValue,
	editValue,
	bulkName, // prefix
	bulkIndex,
	deleteRow,
	handleBulkRowChange,
	isCreate,
	errors={}
}) =>
{

	const setEditValue = ( args ) =>
	{
		if (!Array.isArray(args)) args = [args];

		const changeValues = [];
		args.map((arg) =>
		{
			const { name, value, forceDelete } = arg;
			const nameOrigin = originName(name);
			changeValues.push({
				index: bulkIndex,
				name: nameOrigin,
				value: value,
				forceDelete: forceDelete,
			});
		});


		handleBulkRowChange(changeValues);
	}

	const uniqueName = (name) =>
	{
		return bulkName + '[' + bulkIndex +  ']' + '[' + name + ']';
	}
	const originName = (nameUniqued) =>
	{
		return nameUniqued.replace(bulkName + '[' + bulkIndex +  ']' + '[', '').replace(']', '');
	}


	return (<div className='form-field-group bulk-row'>
			<div className='form-field control'>
				<BulkSortHandle />
				{deleteRow && (
					<button onClick={ () => deleteRow(bulkIndex) } className="delete"><icon.trash2 /></button>
				)}
			</div>
			{Object.keys(config).map((name) =>
			{
				console.log('default in config[name]', config);
				console.log('default in config[name]', name);
				let valueDefault = '';
				if (name in defaultValue)
				{
					valueDefault = defaultValue[name];
				}
				else if ('default' in config[name])
				{
					console.log('default in config[name]', name);
					valueDefault = config[name]['default'];
				}

				return (
					<Field
						name={name}
						uniqueName={uniqueName(name)}
						type={config[name].type}
						fieldConfig={config[name]}
						defaultData={defaultValue}
						editData={editValue}
						setEditValue={setEditValue}
						errors={errors}
					/>
				);
			})}

	</div>)
});

export default BulkRow;