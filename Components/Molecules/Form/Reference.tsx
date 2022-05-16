import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import axios from 'axios';
import Input from '@/Blu/Components/Atoms/Form//Input';
import FormField from '@/Blu/Components/Organisms/Form/Field';
import ViewField from '@/Blu/Components/Organisms/View/Field';
import { useModalContext } from '@/Blu/Contexts/Modal';
import { usePanelsContext } from '@/Blu/Contexts/Panels';
import Index from '@/Blu/Components/Widgets/Index';
import { useGet } from '@/Blu/General/Api';
import * as icon from '@/Blu/General/Icon';

declare var route;

const Reference = ({
	fieldConfig,
	relationName,
	defaultValue,
	defaultData,
	editValue,
	editData,
	setEditValue,
}) =>
{
	// TODO: 参照の取り消し

	const { openModal, closeModal } = useModalContext();
	const { openPanel, closePanel } = usePanelsContext();
	

	const open = () =>
	{
		openModal({
			id: relationName,
			component: <ReferenceTable
				fieldConfig={fieldConfig}
				rowControls={rowControls}
			/>
		});
	}

	const rowControls = {
		'選択': (item) => (<button onClick={() => {
			selectRow(item.id);
		}}><icon.check /></button>),
	};	

	const selectRow = async (id) =>
	{
		const { data } = await axios.get(route(fieldConfig.showApi, id), { params: false });

		// すでに入力があれば警告
		if (data.data)
		{
			let isChanged = false;
			Object.keys(fieldConfig.reference).map((key) =>
			{
				if (
					(key in defaultData && defaultData[key]) ||
					(key in editData && editData[key])
				)
				{
					isChanged = true;
				}
			});

			if (isChanged)
			{
				if (!confirm('すでに入力されているデータを上書きしますが続行しますか?')) return;
			}

			const setValues = [];
			Object.keys(fieldConfig.reference).map((key) =>
			{
				if (key in data.data)
				{
					setValues.push({
						name: fieldConfig.reference[key],
						value: data.data[key],
					});
				}
			})
			
			console.log('setValues', setValues);
			setEditValue(setValues);
			closeModal();
		}
	}

	
    return (<div className='belongs-to-reference'>
		<button className='open' onClick={open}>{fieldConfig.label ? fieldConfig.label : '参照'}</button>
	</div>);
}


const ReferenceTable = ({
	fieldConfig,
	rowControls,
}) =>
{

	const useIndex = (searchParams) => {
		return useGet({route: route(fieldConfig.indexApi), params: searchParams})
	};

	const [ searchParams, setSearchParams ] = useState({});	
	const settingData = fieldConfig.settingApi ? useGet({route: route(fieldConfig.settingApi), params: false}) : false;

	return 	<>
	<header>
		<h3>参照</h3>
	</header>
	<main>
		<Index
			config={fieldConfig['relation']}
			setting={settingData && !settingData.isLoading ? settingData.data : false}
			useIndex={useIndex}
			useShow={false}
			useUpdate={false}
			handleSpotEditor={false}
			rowControls={rowControls}
			searchParams={searchParams}
			setSearchParams={setSearchParams}
		/>
	</main>
</>
}

export default Reference;