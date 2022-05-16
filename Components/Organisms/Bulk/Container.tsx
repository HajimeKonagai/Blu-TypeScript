import React from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import Row from './Row';

const Container = SortableContainer(({
	components,
}) =>
{
	return (<div className='bulk-rows'>
		{components.map((component) => (
			component
		))}
	</div>)
});

export default Container;
