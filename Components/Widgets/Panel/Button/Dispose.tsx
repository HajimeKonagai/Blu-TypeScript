import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as icon from '@/Blu/General/Icon';

const Dispose = ({
    id,
	useDispose,
	handleDisposed,
}) =>
{
	const restore = useDispose({
		id: id,
		onSuccess: ({data, route}) =>
		{
			toast.success('データをゴミ箱に入れました。');
			handleDisposed({data:data})
		},
		onError: ({error, route}) =>
		{
                // TODO: toast
		}
	});

	const executeRestore = () =>
	{
		if (!confirm('データをゴミ箱に入れますか？')) return;

		restore.mutate({});
	}


	return (<button className='dispose' onClick={executeRestore}><icon.trash2 /></button>);
}

export default Dispose;