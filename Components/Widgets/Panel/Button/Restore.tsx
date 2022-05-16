import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as icon from '@/Blu/General/Icon';

const Restore = ({
    id,
	useRestore,
	handleRestored,
}) =>
{
	const restore = useRestore({
		id: id,
		onSuccess: ({data, route}) =>
		{
			toast.success('データを復活しました。');
			handleRestored({data:data})
		},
		onError: ({error, route}) =>
		{
                // TODO: toast
		}
	});

	const executeRestore = () =>
	{
		if (!confirm('データを復活させますか？')) return;

		restore.mutate({});

	}


	return (<button className='restore' onClick={executeRestore}><icon.cornerUpLeft /></button>);
}

export default Restore;