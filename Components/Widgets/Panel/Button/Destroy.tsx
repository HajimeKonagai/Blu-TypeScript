import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as icon from '@/Blu/General/Icon';

const Destroy = ({
    id,
	useDestroy,
	handleDestroyed,
}) =>
{
	const restore = useDestroy({
		id: id,
		onSuccess: ({data, route}) =>
		{
			toast.success('データを完全に削除しました。');
			handleDestroyed({data:data})
		},
		onError: ({error, route}) =>
		{
                // TODO: toast
		}
	});

	const executeDestroy = () =>
	{
		if (!confirm('データを完全に削除しますか？')) return;

		restore.mutate({});

	}


	return (<button className='destroy' onClick={executeDestroy}><icon.trash /></button>);
}

export default Destroy;