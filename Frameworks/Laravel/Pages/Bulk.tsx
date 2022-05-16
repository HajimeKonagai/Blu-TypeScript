import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import Loading from  '@/Blu/General/Loading'
import { objectToFormData } from '@/Blu/Classes/Util';
import { useGet , usePost } from '@/Blu/General/Api';
import Root from '@/Blu/Contexts/Root';
import Bulk from '@/Blu/Components/Widgets/Bulk';

declare var route;

type Props = {
	config: any,
	dataApi,
	saveApi,
	allowAdd?,
	allowDelete?,
	// useBulkSave,
}


const BulkApp = ({
	config,
	allowAdd = true,
	allowDelete = true,
	dataApi='',
	saveApi='',
}) =>
{
	const queryClient = useQueryClient();

    const sortName = Object.keys(config).find((key) => config[key].type == 'order');

	const [ editData, setEditData ] = useState<any[]>([]);
	const [ errors, setErrors ] = useState<any>({});

	const { data, isLoading, isFetching} = useGet({route: route(dataApi), params: false})

	const bulkSave = usePost({
		route: route(saveApi),
		onSuccess: ({data}) =>
		{
			queryClient.resetQueries(route(dataApi));
			setEditData([]);
			setErrors([]);
			toast.success('保存しました。');
		},
		onError: ({error}) =>
		{
			if (error.response && error.response.data.errors)
			{
				toast.error('入力エラーがあります。確認してください');
				setErrors(error.response.data.errors);
			}
			else
			{
				toast.error('予期せぬエラーです。保存に失敗しました。');
                // TODO: toast
			}
		},
		onSettled: undefined,
	});
	
	const setBulkEditValue = (value) =>
	{
		setEditData(value);
	}


	const handleBulkSave = () =>
	{
		bulkSave.mutate({
			params: objectToFormData( editData )
		});
	}


	if (isLoading || !data) return <Loading message='一覧を読み込み中...' />;

	return (<div className='bulk-app'>
		<Bulk
			bulkName='bulk'
			config={config}
			sortName={sortName}
			defaultDataArr={data ? data: []}
			editDataArr={editData ? editData: []}
			setBulkEditValue={setBulkEditValue}
			allowAdd={allowAdd}
			allowDelete={allowDelete}
			errors={errors}
		/>

		<footer>
			<button className='edit update' onClick={handleBulkSave}>保存</button>
		</footer>

	</div>);
};


const BulkAppRoot = (props) => 
{
	return (<Root>
		<BulkApp {...props} />
	</Root>)
}

export default BulkAppRoot;