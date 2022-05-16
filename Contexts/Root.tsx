import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ModalContextProvider } from '@/Blu/Contexts/Modal';
import { PanelsContextProvider } from '@/Blu/Contexts/Panels';

type Props = {
	children: JSX.Element;
	debug?: boolean;
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

const Root:React.VFC<Props> = ({ children, debug = false } ) =>
{
	return (<>
		<div className='blu'>
			<QueryClientProvider client={queryClient}>
			<ModalContextProvider>
			<PanelsContextProvider>
				{children}

				{debug && <ReactQueryDevtools initialIsOpen={false} />}
			</PanelsContextProvider>
			</ModalContextProvider>
			</QueryClientProvider>
		</div>
		<ToastContainer hideProgressBar={true} />
	</>);
}

export default Root;