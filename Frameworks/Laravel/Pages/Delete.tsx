import React, { useState, useRef } from 'react';

import { QueryClient, QueryClientProvider, useQueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';

import { useGet , usePost, usePut, useDelete } from '../../Core/Api';


import { AppContextProvider, useAppContext } from '../Contexts/AppContext';

import Root from '../../Core/Root';
import AppPanels from './App/AppPasnels';
import Index from '../Templates/Index';

import * as icon from '../../Core/Svg';

declare var route;

type Props = {
	config: any,
	trashApi?: string;
	showApi?: string;
	destroyApi?: string;
	settingApi?: any;
	rowControls?,
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


const App:React.VFC<Props> = ({
	config,
	trashApi = '',
	showApi = '',
	destroyApi = '',
	settingApi = {},
	rowControls={},
}) =>
{
	const queryClient = useQueryClient();

	const [ panels, setPanels ] = useState<any[]>([])

	const panelOpen = ({ type, id=null }) => 
	{
		const newPanels = panels.slice();
		const offsetTop = indexTableRef.current && 'offsetTop' in indexTableRef.current ? indexTableRef.current['offsetTop'] : 0;
		const offsetWidth = indexTableRef.current && 'offsetWidth' in indexTableRef.current ? indexTableRef.current['offsetWidth'] : 0;


		const top = Math.max((window.pageYOffset - offsetTop), 0);
		const width = Math.min(offsetWidth - 40, 800);
		const x = offsetWidth - width -20;
		newPanels.push({
			id: id,
			type: type,
			panelDefault: {
				x: x,
				y: top+50,
				width: width,
			}
		});
		setPanels(newPanels);
	}

	const panelClose = (index) =>
	{
		const newPanels = panels.slice();
		delete newPanels[index];
		// newPanels.unshift('delete');
		setPanels(newPanels);
	}

	const findPanel = ({ type, id }) =>
	{
		return panels.findIndex((elm) =>
		{
			return elm && elm.type == type && elm.id== id
		}) > -1;
	}

	const renderedRowControls = {};
	Object.keys(rowControls).map((key) => {
		renderedRowControls[key] = (item) => {
			return rowControls[key]({
				item             : item,
				rowControl       : rowControls[key],
				findPanel        : findPanel,
				panelOpen        : panelOpen,
			})
		}
	});

	// datatable で indexTable も使う

	const indexTableRef = useRef<HTMLDivElement>(null);

	const handleApi = ({index, type, data}) =>
	{
		switch (type)
		{
		case 'delete':
		{
			const newPanels = panels.slice();
			delete newPanels[index];
			setPanels(newPanels);
		}
		default:
			break;
		}

		queryClient.invalidateQueries([route(trashApi), {params: searchParams}]);
	}


	const useIndex = (searchParams) => {
		return useGet({route: route(trashApi), params: searchParams})
	};

	const useShow = (id) => {
		return useGet({ route: route(showApi, id), params: false })
	};

	const useDestroy = ({id, onSuccess, onError}) => {
		return useDelete({
			route: route(destroyApi, id),
			onSuccess: onSuccess,
			onError: onError,
			onSettled: false,
		})
	};

	let settingData;
	if (settingApi)
	{
		const useSetting = () => {
			return useGet({route: route(settingApi.route, settingApi.key), params: false})
		};
		settingData = useSetting();
	}

	const [ searchParams, setSearchParams ] = useState({});


	return (<div className='app'>

		<div ref={indexTableRef}>
			<Index
				config={config}
				setting={settingData && !settingData.isLoading ? settingData.data : false}
				handleApi={handleApi}
				useIndex={useIndex}
				useShow={useShow}
				renderedRowControls={renderedRowControls}
				searchParams={searchParams}
				setSearchParams={setSearchParams}
			/>
		</div>

		<AppPanels
			config={config}
			panels={panels}
			closePanel={panelClose}
			useShow={useShow}
			handleApi={handleApi}
		/>

	</div>);
}


const AppRoot = (props) => 
{
	return (<Root debug={true}>
		<AppContextProvider>
			<App {...props} />
		</AppContextProvider>
	</Root>)
}

export default AppRoot;