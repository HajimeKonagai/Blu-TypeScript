import React, { useState, useRef } from 'react';

import { QueryClient, QueryClientProvider, useQueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';

import { useGet , usePut } from '@/Blu/General/Api';

import EditWidget from '@/Blu/Components/Widgets/Panel/Edit';

import Root from '@/Blu/Contexts/Root';

declare var route;

type Props = {
	id: number,
	config: any,
	title: string | null,
	showApi?: string;
	updateApi?: string;
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			cacheTime: 1000,
		},
		mutations: {
			retry: false,
		},
	}
});


const Edit:React.VFC<Props> = ({
	id,
	config,
	title=null,
	showApi = '',
	updateApi = '',
}) =>
{
	const queryClient = useQueryClient();

	const useShow = showApi ? (id) => {
		return useGet({ route: route(showApi, id), params: false })
	} : false;

	const useUpdate = updateApi ? ({id, onSuccess, onError}) => {
		return usePut({
			route: route(updateApi, id),
			onSuccess: onSuccess,
			onError: onError,
			onSettled: false,
		})
	} : false;

	const handleUpdated = () =>
	{
		queryClient.resetQueries(route(showApi, id));
	}

	return (<div className='app edit'>
		<EditWidget
			config={config}
			id={id}
			title={title}
			useShow={useShow}
			useUpdate={useUpdate}
			handleUpdated={handleUpdated}
		/>
	</div>);
}


const EditRoot = (props) => 
{
	return (<Root debug={true}>
		<Edit {...props} />
	</Root>)
}

export default EditRoot;