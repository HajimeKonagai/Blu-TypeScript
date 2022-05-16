import React, { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { objectToFormData } from '@/Blu/Classes/Util';
import Loading from '@/Blu/General/Loading';
import Form from '@/Blu/Components/Templates/Form';
import * as icon from '@/Blu/General/Icon';

const Edit = ({
	config,
	id,
	title=null,
	useShow,
	useUpdate,
	handleUpdated,
	formName='',
	close=null,
}) =>
{
	const { data, isLoading } = useShow(id);

	const [ editData, setEditData ] = useState({});

	const [ errors, setErrors ] = useState({});

	const update = useUpdate({
		id: id,
		onSuccess: ({data}) =>
		{
			toast.success('データを更新しました');
			setEditData({});
			setErrors({});
			handleUpdated({data:data});
		},
		onError: ({error}) =>
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

	const handleUpdate = () =>
	{
		if (Object.keys(editData).length <= 0)
		{
			toast.warning('変更箇所がありません。');
			return;
		}

		const formData = new FormData();

		const formDataObj = {};

		Object.keys(config).map((name) =>
		{
			if (name in editData)
			{
				formDataObj[name] = editData[name]
				formData.append(name, editData[name]);
			}
		});

		update.mutate({
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

	if (isLoading || !data) return <Loading message='データを読み込み中...' />;

	return <div className='edit-panel'>
		<header className='panel-drag'>
			<h3>{title ? title: `編集 ID: ${id}`}</h3>
			{close && <button className='close' onClick={closePanel}><icon.x /></button>}
		</header>
		<main>
			<Form
				config={config}
				formName={formName}
				defaultData={data.data}
				editData={editData}
				errors={errors}
				setEditData={setEditData}
			/>

		</main>
		<footer>
			<button className='edit update' onClick={handleUpdate}>保存</button>
		</footer>
	</div>
}

export default Edit;