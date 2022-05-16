import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { objectToFormData } from '@/Blu/Classes/Util';
import Form from '@/Blu/Components/Templates/Form';
import * as icon from '@/Blu/General/Icon';

const Create = ({
	config,
	panelId,
	useStore,
	handleStored,
	close,
}) =>
{
	const [ editData, setEditData ] = useState({});
	const [ errors, setErrors ] = useState({});

	const store = useStore({
		onSuccess: ({data}) =>
		{
			toast.success('データを保存しました');
			setErrors({});
			handleStored({
				data: data,
			})
		},
		onError: ({error, route}) =>
		{
			if (error.response && error.response.data && error.response.data.errors)
			{
				toast.error('入力エラーがあります。各入力欄を確認してください。');
				setErrors(error.response.data.errors);
			}
			else
			{
                // TODO: toast
			}
		}
	});


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
		});

		store.mutate({
			params: objectToFormData( formDataObj , '', new FormData )
		});
	}

	const closePanel = () =>
	{
		if (Object.keys(editData).length > 0)
		{
			if (confirm('編集中のデータがります。保存されていませんが閉じてもよろしいですか？'))
			{
				close();
			}
		}
		else
		{
			close();
		}
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
			<button className='close' onClick={closePanel}><icon.x /></button>
		</header>
		<main>
			<Form
				config={config}
				formName={panelId}
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

export default Create;