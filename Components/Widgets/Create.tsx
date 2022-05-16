import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { objectToFormData } from '@/Blu/Classes/Util';
import Form from '@/Blu/Components/Templates/Form';

const CreatePanel = ({
	index,
	useStore,
	handleStored,
	config,
	closeLocks,
	setCloseLocks,
}) =>
{
	const [ editData, setEditData ] = useState({});
	const [ errors, setErrors ] = useState({});

	const store = useStore({
		onSuccess: ({data, route}) =>
		{
			toast('データを保存しました');
			handleStored({
				data: data,
			})
		},
		onError: ({error, route}) =>
		{
			if (error.response && error.response.data.errors)
			{
				setErrors(error.response.data.errors);
			}
			else
			{
                // TODO: toast
			}
		}
	});

	// set closeblocks
	useEffect(() =>
	{
		const newCloseLocks = closeLocks.slice();
		if (Object.keys(editData).length > 0)
		{
			newCloseLocks[index] = '編集中のデータがります。保存されていませんが閉じてもよろしいですか？';
		}
		else
		{
			delete newCloseLocks[index];
		}

		setCloseLocks(newCloseLocks);
	}, [editData]);


	const handleStore = () =>
	{
		const formData = new FormData();

		const formDataObj = {}; // TODO: debug

		Object.keys(config).map((name) =>
		{
			if (name in editData)
			{
				formDataObj[name] = editData[name]
				formData.append(name, editData[name]);
			}
			/*
			else if ('default' in config[name]) // create の場合はデフォルト値を足す?
			{
				// formData[name] = config[name]['default'];
				formData.append(name, config[name]['default']);
			}
			*/

		});

		store.mutate({
			params: objectToFormData( formDataObj , '', new FormData )
		});
	}

	const defaultData = {};
	Object.keys(config).map((name) => {
		if ('default' in config[name])
		{
			defaultData[name] = config[name]['default'];
		}
	});

	return (<div className='create-panel'>
		<header className='panel-drag'>
			<h3>新規作成</h3>
		</header>
		<main>
			<Form
				config={config}
				formName={'create' + '-' + index + '-'}
				defaultData={defaultData}
				editData={editData}
				errors={errors}
				setEditData={setEditData}
			/>
		</main>
		<footer>
			<button className="create store" onClick={handleStore}>新規作成</button>
		</footer>
	</div>);
}

export default CreatePanel;