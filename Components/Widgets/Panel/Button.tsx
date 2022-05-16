import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as icon from '@/Blu/General/Icon';

const Destroy = ({
    id,
	useMutation,
	className='',
	buttonContent,
	confirmMessage='',
	handleOnSuccess,
}) =>
{
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


	return (
		<button
			className={className}
			onClick={executeMutation}>
			{buttonContent}
		</button>
	);
}

export default Destroy;