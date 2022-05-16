import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/Blu/General/Loading';
import View from '@/Blu/Components/Templates/View';
import * as icon from '@/Blu/General/Icon';

const Delete = ({
	config,
    id,
	useShow,
	useMutation,
	title='',
	className='',
	handleOnSuccess,
	confirmMessage='',
	buttonContent='実行',
	close,
}) =>
{
	const { data, isLoading } = useShow(id);


	const mutation = useMutation({
		id: id,
		onSuccess: ({data}) =>
		{
			handleOnSuccess({data:data})
		},
		onError: ({error, route}) =>
		{
                // TODO: toast
		}
	});

	const executeMutation = () =>
	{
		if (confirmMessage && !confirm(confirmMessage)) return;

		mutation.mutate({});
	}

	if (isLoading || !data) return <Loading message='データを読み込み中...' />;

	return (<div className={`panel-${className}`}>
		<header className='panel-drag'>
			<h3>{title}</h3>
			<button className='close' onClick={close}><icon.x /></button>
		</header>
		<main>
			<View
				config={config}
				defaultData={data.data}
			/>
		</main>
		<footer>
			<button
				className={className}
				onClick={executeMutation}
			>
				{buttonContent}
			</button>
		</footer>
	</div>);
}

export default Delete;