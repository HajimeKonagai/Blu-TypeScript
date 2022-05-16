import React, { useState } from 'react';

import Loading from '@/Blu/General/Loading';
import View from '@/Blu/Components/Templates/View';

const Show = ({
	config,
    id,
	useShow,
	useDelete,
	handleDeleted,
}) =>
{
	const { data, isLoading, isFetching } = useShow(id);


	const delete_ = useDelete({
		id: id,
		onSuccess: ({data, route}) =>
		{

			handleDeleted({data:data})
		},
		onError: ({error, route}) =>
		{
                // TODO: toast
		}
	});

	const executeDelete = () =>
	{
		if (!confirm('削除してもよろしいですか？')) return;

		delete_.mutate({});

	}

	if (isLoading || !data) return <Loading message='データを読み込み中...' />;

	return (<div className='delete-panel'>
		<header className='panel-drag'>
			<h3>削除 ID: {id}</h3>
		</header>
		<main>
			<View
				config={config}
				defaultData={data.data}
			/>
		</main>
		<footer>
			<button className='delete' onClick={executeDelete}>削除</button>
		</footer>
	</div>);
}

export default Show;