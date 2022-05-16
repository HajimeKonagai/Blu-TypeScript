import React from 'react';
import { useViewContext } from '@/Blu/Contexts/View';

import HasOne from '@/Blu/Components/Molecules/View/HasOne';
import HasMany from '@/Blu/Components/Molecules/View/HasMany';
// import BelongsTo from './RelationView/BelongsTo';
// mport ManyMany from './RelationView/ManyMany';
import ManyManyPivot from '@/Blu/Components/Molecules/View/ManyManyPivot';

type Props = {
	name: string;
	fieldConfig: any;
	defaultData: any,
}

const LaravelViewField:React.VFC<Props> = ({
	name,
	fieldConfig,
	defaultData,
}) =>
{
	const { viewComponents } = useViewContext();

	if (fieldConfig.type in viewComponents)
	{
		return viewComponents[fieldConfig.type]({
			name: name,
			fieldConfig  : fieldConfig,
			defaultData: defaultData,
		});
	}

	switch (fieldConfig.type)
	{
		/*
	case 'hasOne':
		return <HasOne
			relationName={name}
			fieldConfig={fieldConfig}
			defaultData={defaultData}
		/>
		break;
		*/
	case 'hasMany':
		return <HasMany
			relationName={name}
			fieldConfig={fieldConfig}
			defaultData={defaultData}
		/>
		break;


	/*
	case 'belongsTo':
		return <BelongsTo
			relationName={name}
			fieldConfig={fieldConfig}
			defaultData={defaultData}
		/>
		break;
	case 'manyMany':
		return <ManyMany
			relationName={name}
			fieldConfig={fieldConfig}
			defaultData={defaultData}
		/>
		break;
	*/

	case 'manyManyPivot':
		return <ManyManyPivot
			relationName={name}
			fieldConfig={fieldConfig}
			defaultData={defaultData}
		/>
		break;

	case 'manyMany': // TODO:
	case 'belongsTo': // TODO:
	case 'raw':
	default:
		return (<>
		{fieldConfig.attribute && (
			<>{fieldConfig.attribute in defaultData ? defaultData[fieldConfig.attribute]: ''}</>
		) || (
			<>{name in defaultData ? defaultData[name]: ''}</>
		)}
		</>)
		break;
	}
}

export default LaravelViewField;

