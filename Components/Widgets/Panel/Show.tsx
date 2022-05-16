import React, { useState } from 'react';

import Loading from '@/Blu/General/Loading';
import View from '@/Blu/Components/Templates/View';
import * as icon from '@/Blu/General/Icon';

const Show = ({
	config,
    id,
	useShow,
	close, // あれば panel
}) =>
{
	const { data, isLoading } = useShow(id);

	if (isLoading || !data) return <Loading message='データを読み込み中...' />;

	return (<div className="show no-footer">
		<header className='panel-drag'>
			<h3>詳細 ID: {id}</h3>
			{close && <button className='close' onClick={close}><icon.x /></button>}
		</header>
		<main>
			<View
				config={config}
				defaultData={data.data}
			/>
		</main>
	</div>);
}

export default Show;