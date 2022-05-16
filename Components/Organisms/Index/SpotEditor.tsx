import React, { useState } from "react";
import { toast } from "react-toastify";

import { useFormContext } from '@/Blu/Contexts/Form';
import { objectToFormData } from '@/Blu/Classes/Util';
import Loading from "@/Blu/General/Loading";
import LaravelFormField from "@/Blu/Components/Organisms/Form/Field";
import { isChanged } from '@/Blu/Classes/Form';

const SpotEditor = ({
	id,
	useShow,
	useUpdate,
	name,
	fieldConfig,
	handleUpdated,
	closeLock,
	setCloseLock,
	close,
}) =>
{
	const { formHooks } = useFormContext();

	const { data, isLoading, isFetching } = useShow(id);

	const [ editData, setEditData ] = useState({});

	const [ error, setError ] = useState([]);

	const update = useUpdate({
		id: id,
		onSuccess: ({data, route}) =>
		{
			toast('データを更新しました');
			handleUpdated();
			setEditData({}); // TODO: 多分いらない
		},
		onError: ({error, route}) =>
		{
			if (error.response && error.response.errors)
			{
				if (name in error.response.errors)
				{
					setError(error.response.errors[name]);
				}
			}
			else
			{
                // TODO: toast
			}
		}
	});

	const handleUpdate = () =>
	{
		if (Object.keys(editData).length < 1)
		{
			alert('編集されたデータがありません');
			return;
		}

		const formDataObj = {}; // TODO: debug

		Object.keys(editData).map((name) =>
		{
			if (name in editData)
			{
				formDataObj[name] = editData[name]
			}
		});

		update.mutate({
			params: objectToFormData( formDataObj , '', new FormData )
		});
	}

	if (isLoading || !data) return <Loading message='データを読み込み中...' />;

	const handleEditValue = ( { name, value } ) =>
	{
		const nameOrigin = name;

		let changed = isChanged({
			type: fieldConfig.type,
			nameOrigin: nameOrigin,
			value: value,
			defaultData: data.data,
		});

		let newEditData = {...editData};

		if (changed)
		{
			newEditData[nameOrigin] = value;
		}
		else
		{
			delete newEditData[nameOrigin];
		}

		if (fieldConfig['hook'] && fieldConfig['hook'] in formHooks)
		{
			newEditData = formHooks[fieldConfig['hook']](
			{
				name: nameOrigin,
				defaultData: data.data,
				editData: newEditData,
			});
		}

		setCloseLock(Object.keys(newEditData).length > 0);

		setEditData(newEditData);
	}

	return (<>
		{(closeLock) && (<span className="edit">edit</span>)}
		<LaravelFormField
			type={fieldConfig.type}
			name={name}
			fieldConfig={fieldConfig}
			defaultValue={data.data[name]}
			defaultData={data.data}
			editValue={name in editData ? editData[name]: undefined}
			editData={editData}
			setEditValue={handleEditValue}
			errors={error}
		/>
		<div className="control">
			<button onClick={handleUpdate}>Save</button>
			<button onClick={close}>Cancel</button>
		</div>

	</>);

}

export default SpotEditor;