import React, { useState } from 'react';
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify';

import { useGet , usePost, usePut, usePatch, useDelete } from '@/Blu/General/Api';
import { FormContextProvider, useFormContext } from '@/Blu/Contexts/Form';
import { ViewContextProvider, useViewContext } from '@/Blu/Contexts/View';
import { useAppContext } from '@/Blu/Contexts/App';
import { usePanelsContext } from '@/Blu/Contexts/Panels';
import * as icon from '@/Blu/General/Icon';
import Root from '@/Blu/Contexts/Root';
import Index from '@/Blu/Components/Widgets/Index';
import PanelShow from '@/Blu/Components/Widgets/Panel/Show';
import PanelCreate from '@/Blu/Components/Widgets/Panel/Create';
import PanelEdit from '@/Blu/Components/Widgets/Panel/Edit';
import PanelButton from '@/Blu/Components/Widgets/Panel/Button';
import PanelConfirm from '@/Blu/Components/Widgets/Panel/Confirm';

declare var route;

type Props = {
	config: any,
	indexApi?: string;
	showApi?: string;
	storeApi?: string;
	updateApi?: string;
	deleteApi?: string;

	disposeApi?: string;
	restoreApi?: string;
	destroyApi?: string;

	disposeButtonApi?: string;
	restoreButtonApi?: string;
	destroyButtonApi?: string;

	settingApi?: any;

	spotEditor?: boolean;

}

const App:React.VFC<Props> = ({
	config,
	indexApi = '',
	showApi = '',
	storeApi = '',
	updateApi = '',

	disposeApi = '',
	restoreApi = '',
	destroyApi = '',

	disposeButtonApi = '',
	restoreButtonApi = '',
	destroyButtonApi = '',

	settingApi = {},

	spotEditor=true,
}) =>
{
	const queryClient = useQueryClient();

	const [ searchParams, setSearchParams ] = useState({});

	const settingData = settingApi ? useGet({route: route(settingApi), params: false}) : false;

	/**
	 * APIs
	 */
	const useIndex = indexApi ? (searchParams) => {
		return useGet({route: route(indexApi), params: searchParams})
	} : false;

	const useShow = showApi ? (id) => {
		return useGet({ route: route(showApi, id), params: false })
	} : false;

	const useStore = storeApi ? ({onSuccess, onError}) => {
		return usePost({
			route: route(storeApi),
			onSuccess: onSuccess,
			onError: onError,
			onSettled: false,
		})
	} : false;

	const useUpdate = updateApi ? ({id, onSuccess, onError}) => {
		return usePut({
			route: route(updateApi, id),
			onSuccess: onSuccess,
			onError: onError,
			onSettled: false,
		})
	} : false;

	const useDispose = disposeApi ? ({id, onSuccess, onError}) => {
		return useDelete({
			route: route(disposeApi, id),
			onSuccess: onSuccess,
			onError: onError,
			onSettled: false,
		})
	} : false;

	const useRestore = restoreApi ? ({id, onSuccess, onError}) => {
		return usePatch({
			route: route(restoreApi, id),
			onSuccess: onSuccess,
			onError: onError,
			onSettled: false,
		})
	} : false;


	const useDestroy = destroyApi ? ({id, onSuccess, onError}) => {
		return useDelete({
			route: route(destroyApi, id),
			onSuccess: onSuccess,
			onError: onError,
			onSettled: false,
		})
	} : false;


	const useDisposeButton = disposeButtonApi ? ({id, onSuccess, onError}) => {
		return useDelete({
			route: route(disposeApi, id),
			onSuccess: onSuccess,
			onError: onError,
			onSettled: false,
		})
	} : false;

	const useRestoreButton = restoreButtonApi ? ({id, onSuccess, onError}) => {
		return usePatch({
			route: route(restoreApi, id),
			onSuccess: onSuccess,
			onError: onError,
			onSettled: false,
		})
	} : false;


	const useDestroyButton = destroyButtonApi ? ({id, onSuccess, onError}) => {
		return useDelete({
			route: route(destroyApi, id),
			onSuccess: onSuccess,
			onError: onError,
			onSettled: false,
		})
	} : false;

	/**
	 * API Callback
	 */
	const handleSpotEditor = ({index, type, data}) =>
	{
		switch (type)
		{
		case 'create':
	//		const newPanels = panels.slice();
	//		newPanels[index].id = data.id;
	//		newPanels[index].type = 'edit';
			// setPanels(newPanels);
			break;

		case 'edit':
			queryClient.resetQueries(route(showApi, data.id));

			// queryClient.resetQueries([route(indexApi), searchParams]);
			
			break;
		case 'delete':
		{
//			const newPanels = panels.slice();
//			delete newPanels[index];
			// setPanels(newPanels);
		}
		default:
			break;
		}

		queryClient.invalidateQueries([route(indexApi), {params: searchParams}]);
	}

	/*
	 * panels
	 */
	const { panels, openPanel, closePanel } = usePanelsContext();

	const openCreatePanel = () =>
	{
		const panelId: string = 'create-'; // TODO random id
		openPanel({
			id: panelId,
			component:<PanelCreate
				config={config}
				panelId={panelId}
				useStore={useStore}
				handleStored={({ data }) =>
				{
					// TODO: state
					openEditPanel(data);
					closePanel(panelId);
					queryClient.invalidateQueries([route(indexApi), {params: searchParams}]);
				}}
				close={() => {
					closePanel(panelId)
				}}
			/>
		});
	}

	const openEditPanel = (id) =>
	{
		const panelId: string = 'edit-' + id.toString();
		openPanel({
			id: panelId,
			component: (<PanelEdit
				config={config}
				id={id}
				formName={panelId}
				useShow={useShow}
				useUpdate={useUpdate}
				handleUpdated={() => {
					queryClient.resetQueries(route(showApi, id));
					queryClient.invalidateQueries([route(indexApi), {params: searchParams}]);
				}}
				close={() => {
					closePanel(panelId)
				}}
			/>),
			// state: state, TODO:state
		});
	}

	const openShowPanel = (id) =>
	{
		const panelId: string = 'show-' + id.toString();
		openPanel({
			id: panelId,
			component: (<PanelShow
				config={config}
				id={id}
				useShow={useShow}
				close={() => {
					closePanel(panelId)
				}}
			/>),
		});
	}

	const openConfirmPanel = (id, mutation) =>
	{
		const panelId: string = 'delete-' + id.toString();
		openPanel({
			id: panelId,
			component: (<PanelConfirm
				config={config}
				id={id}
				useShow={useShow}
				useMutation={mutation}
				close={() => {
					closePanel(panelId)
				}}
				handleOnSuccess={({ data }) =>
				{
					closePanel(panelId);
					queryClient.invalidateQueries([route(indexApi), {params: searchParams}]);
				}}
			/>),
		});
	}

	/*
	const queryClient = useQueryClient();


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
	*/




	const rowControls = {
		'操作': (item) => {
			return (<>
				{useShow && ( 
				<a
					className={'button show ' + ('show-' + item.id.toString() in panels ? 'active': '')}
					onClick={(e) => {
						e.preventDefault();
						if ('show-' + item.id.toString() in panels) return;
						openShowPanel(item.id)
					}}
					href={'#'}
				>
					<icon.eye />
				</a>
				)}
				{useUpdate && (
				<a
					className={'button edit ' + ('edit-' + item.id.toString() in panels ? 'active': '')}
					onClick={(e) => {
						e.preventDefault();
						if ('edit-' + item.id.toString() in panels) return;
						openEditPanel(item.id)
					}}
					href={'#'}
				>
					<icon.edit2 />
				</a>
				)}

				{useDispose && (
				<a
					className={'button dispose ' + ('dispose-' + item.id.toString() in panels ? 'active': '')}
					onClick={(e) => {
						e.preventDefault();
						if ('dispose-' + item.id.toString() in panels) return;
						if ('show-' + item.id.toString() in panels) { toast.warning('詳細ウィンドウを閉じてください'); return; }
						if ('edit-' + item.id.toString() in panels) { toast.warning('編集ウィンドウを閉じてください'); return; }


						const panelId: string = 'dispose-' + item.id.toString();
						openPanel({
							id: panelId,
							component: (<PanelConfirm
								config={config}
								id={item.id}
								useShow={useShow}
								useMutation={useDispose}
								title={`ゴミ箱へ入れる: ${item.id}`}
								className='dispose'
								confirmMessage='ゴミ箱へ入れてもよろしいですか？'
								buttonContent='ゴミ箱へ'
								close={() => {
									closePanel(panelId)
								}}
								handleOnSuccess={({ data }) =>
								{
									toast.success('ゴミ箱へ入れました');
									closePanel(panelId);
									queryClient.invalidateQueries([route(indexApi), {params: searchParams}]);
								}}
							/>),
						});
					}}
					href={'#'}
				>
					<icon.trash2 />
				</a>
				)}

				{useRestore && (
				<a
					className={'button restore ' + ('restore-' + item.id.toString() in panels ? 'active': '')}
					onClick={(e) => {
						e.preventDefault();
						if ('restore-' + item.id.toString() in panels) return;


						const panelId: string = 'restore-' + item.id.toString();
						openPanel({
							id: panelId,
							component: (<PanelConfirm
								config={config}
								id={item.id}
								useShow={useShow}
								useMutation={useRestore}
								title={`復活: ${item.id}`}
								className='restore'
								confirmMessage='復活させてもよろしいですか？'
								buttonContent='復活'
								close={() => {
									closePanel(panelId)
								}}
								handleOnSuccess={({ data }) =>
								{
									toast.success('復活しました');
									closePanel(panelId);
									queryClient.invalidateQueries([route(indexApi), {params: searchParams}]);
								}}
							/>),
						});
					}}
					href={'#'}
				>
					<icon.cornerUpLeft />
				</a>
				)}

				{useDestroy && (
				<a
					className={'button destroy ' + ('destroy-' + item.id.toString() in panels ? 'active': '')}
					onClick={(e) => {
						e.preventDefault();
						if ('destroy-' + item.id.toString() in panels) return;
						if ('show-' + item.id.toString() in panels) { toast.warning('詳細ウィンドウを閉じてください'); return; }
						if ('edit-' + item.id.toString() in panels) { toast.warning('編集ウィンドウを閉じてください'); return; }

						const panelId: string = 'destroy-' + item.id.toString();
						openPanel({
							id: panelId,
							component: (<PanelConfirm
								config={config}
								id={item.id}
								useShow={useShow}
								useMutation={useDestroy}
								title={`完全削除: ${item.id}`}
								className='destroy'
								confirmMessage='完全削除してもよろしいですか？この操作は取り消せません。'
								buttonContent='完全削除'
								close={() => {
									closePanel(panelId)
								}}
								handleOnSuccess={({ data }) =>
								{
									toast.success('完全削除しました');
									closePanel(panelId);
									queryClient.invalidateQueries([route(indexApi), {params: searchParams}]);
								}}
							/>),
						});
					}}
					href={'#'}
				>
					<icon.trash />
				</a>
				)}


				{useDisposeButton && (
				<PanelButton
					id={item.id}
					className='dispose'
					useMutation={useDisposeButton}
					confirmMessage='ゴミ箱へ入れてもよろしいですか？'
					buttonContent={<icon.trash2 />}
					handleOnSuccess={() => {
						toast.success('ゴミ箱へ入れました');
						queryClient.invalidateQueries([route(indexApi), {params: searchParams}]);
					}}
				/>)}

				{useRestoreButton && (
				<PanelButton
					id={item.id}
					className='restore'
					useMutation={useRestoreButton}
					confirmMessage='復活させてもよろしいですか？'
					buttonContent={<icon.cornerUpLeft />}
					handleOnSuccess={() => {
						toast.success('復活しました');
						queryClient.invalidateQueries([route(indexApi), {params: searchParams}]);
					}}
				/>)}

				{useDestroyButton && (
				<PanelButton
					id={item.id}
					className='destroy'
					useMutation={useDestroyButton}
					confirmMessage='完全削除してもよろしいですか？この操作は取り消せません。'
					buttonContent={<icon.trash />}
					handleOnSuccess={() => {
						toast.success('完全削除しました');
						queryClient.invalidateQueries([route(indexApi), {params: searchParams}]);
					}}
				/>)}
			</>);
		},
	};

	const { appComponents } = useAppContext();

	return (<div className='app'>

		{appComponents && Object.keys(appComponents).map((acKey) => {
			return appComponents[acKey]({
				config          : config,
				setting         : settingData && !settingData.isLoading ? settingData.data : false,
				searchParams    : searchParams,
				setSearchParams : setSearchParams,
			})
		})}


		{ useStore && (<button onClick={() => openCreatePanel()}>新規作成<icon.plus /></button>) }

		<Index
			config={config}
			setting={settingData && !settingData.isLoading ? settingData.data : false}
			handleSpotEditor={handleSpotEditor}
			useIndex={useIndex}
			useShow={useShow}
			useUpdate={useUpdate}
			rowControls={rowControls}
			searchParams={searchParams}
			setSearchParams={setSearchParams}
			spotEditor={spotEditor}
		/>

		{ useStore && (<button onClick={() => openCreatePanel()}>新規作成<icon.plus /></button>) }

	</div>);
}


const AppRoot = (props) => 
{
	return (<Root debug={true}>
			<App {...props} />
	</Root>)
}

export default AppRoot;