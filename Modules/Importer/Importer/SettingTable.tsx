import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useQueryClient } from 'react-query';

import { useGet, usePost } from '@/Blu/General/Api';
import { is_json } from '@/Blu/Classes/Util';
import Loading from '@/Blu/General/Loading';
import DefaultField from '@/Blu/Components/Organisms/Form/Default';

type Props = {
	settingLoadApi: string;
	settingSaveApi: string;
	settingConfig: any;
	importSetting: any;
	setImportSetting: any;

	addSettingHook?: any;
	applySettingHook?: any;

	showSetting?: boolean;
}


const SettingTable: React.VFC<Props> = ({
	settingLoadApi,
	settingSaveApi,
	settingConfig,
	importSetting,
	setImportSetting,

	addSettingHook,
	applySettingHook,
	showSetting=true,
}) =>
{
	const queryClient = useQueryClient();
	
	const useLoadSetting = () => {
		return useGet({ route: settingLoadApi, params: false })
	};

	const useSaveSetting = ({onSuccess, onError}) => {
		return usePost({
			route: settingSaveApi,
			onSuccess: onSuccess,
			onError: onError,
			onSettled: false,
		})
	};



	const loadSetting = useLoadSetting();
	const saveSetting = useSaveSetting({
		onSuccess: () => {
			queryClient.invalidateQueries(settingLoadApi);
			toast.success('保存した設定を更新しました。');
		},
		onError: () => {
		}
	});


	let settings = [];
	if (
		!loadSetting.isLoading &&
		loadSetting.data
	)
	{
		settings = JSON.parse(loadSetting.data.value);
	}

	const [ settingName, setSettingName ] = useState('');


	const addSetting = () =>
	{
		if (!settingName)
		{
			toast.error('名前を入力してください');
			return;
		}

		for (let key in settings)
		{
			if (settings[key].name == settingName)
			{
				toast.error('名前が重複しています');
				return;
			}
		}

		const newSettings = settings.slice();


		let newSetting = {
			'name'          : settingName,
			// 'encoding'      : settingEncode,
			// 'searchFields'  : searchFields, // TODO:
			// 'toFields'      : toFields,
			'importSetting' : importSetting, // custom
		};

		if (addSettingHook)
		{
			newSetting = addSettingHook(newSetting);
		}
		
		newSettings.push(newSetting);


		// TODO: additional encoding and toFields

		saveSetting.mutate({
			params: {
				value: JSON.stringify(newSettings),
			},
		});
	}

	const removeSetting = (i) =>
	{
		const newSetting = settings.slice();
		newSetting.splice(i, 1);

		saveSetting.mutate({
			params: {
				value: JSON.stringify(newSetting),
			},
		});
	}

	const applySetting = (i) =>
	{
		if (!settings[i]) return;

		const setting = settings[i];

		if ('name' in setting) setSettingName(setting.name);
		if ('importSetting' in setting) setImportSetting(setting.importSetting);

		/*
		if ('encoding' in setting) setSettingEncode(setting.encoding);
		if ('searchFields' in setting) setSearchFields(setting.searchFields);
		if ('toFields' in setting) setToFields(setting.toFields);
		*/

		if (applySettingHook)
		{
			applySettingHook(setting);
		}
	}


	const handleImportSettingChange = ({name, value}) => 
	{
		setImportSetting((prev) => {
			const values = {...prev};
			values[name] = value;
			return values;
		});
	}


    return (<>
		<h2>設定</h2>
		<table className="">
			<tbody>
				<tr>
					<th>保存した設定</th>
					<td>
						{loadSetting.isLoading && (
							<Loading />
						) || (<ul>
							{settings.map((setting, i) => (
								<li>
									{setting.name}
									<button onClick={() => applySetting(i)}>LOAD</button>
									<button onClick={() => removeSetting(i)}>DELETE</button>
								</li>
							))}
						</ul>)}
					</td>
				</tr>
				{showSetting && <>
				{Object.keys(settingConfig).map((name) => (
				<tr>
					<th>
						{settingConfig[name].label ? settingConfig[name].label : name}
					</th>
					<td>
						<DefaultField
							name={name}
							type={settingConfig[name].type}
							options={settingConfig[name].options}
							required={settingConfig[name].required ? true: false}
							placeholder={settingConfig[name].placeholder ? settingConfig[name].placeholder: ''}
							value={name in importSetting ? importSetting[name]: undefined}
							defaultValue={settingConfig[name].default ? settingConfig[name].default: undefined}
							handleChange={handleImportSettingChange}
						/>
					</td>
				</tr>
				))}
				<tr>
					<th>設定に名前をつけて保存</th>
					<td>
						<input
							type='text'
							value={settingName}
							onChange={(e) => setSettingName(e.target.value)}
							placeholder=""
						/>
						<button onClick={addSetting} >現在の設定を保存</button>
					</td>
				</tr>
				</>}
			</tbody>
		</table>

	</>)
}

export default SettingTable;