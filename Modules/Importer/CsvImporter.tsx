import React, { useEffect, useState } from 'react';
import Encoding from 'encoding-japanese'

import { usePost } from '@/Blu/General/Api';
import Root from '@/Blu/Contexts/Root';

import CsvReader from './Importer/CsvReader';
import DataTableRaw from './Importer/DataTableRaw';
import DataTableImport from './Importer/DataTableImport';
import SearchFields from './components/SearchFields';
import ImportFields from './components/ImportFields';
import SettingTable from './Importer/SettingTable';

type Props = {
	config: any;
	settingConfig?: any;
	importApi: string;
	settingLoadApi: string;
	settingSaveApi: string;

	useSearch?: boolean;
	initialSettingIsOpen: boolean,
}


const CsvImporter: React.VFC<Props> = ({
	config,
	settingConfig={},
	importApi,
	settingLoadApi,
	settingSaveApi,
	useSearch = true,
	initialSettingIsOpen=true,
}) =>
{
	const useImport = ({onSuccess, onError}) => {
		return usePost({
			route: importApi,
			onSuccess: onSuccess,
			onError: onError,
			onSettled: false,
		})
	};

	const [ showSetting, setShowSetting ] = useState(initialSettingIsOpen);

	const [ importSetting, setImportSetting ] = useState<any>({});
	const encodeText = (text) =>
	{
		return Encoding.convert(text, {to: 'UNICODE', from: importSetting?.encode ? importSetting.encode : 'SJIS'})
	}

	const [ rawData, setRawData ] = useState([]);
	const [ showRawData, setShowRawData ] = useState(false);
	const [ fromFields, setFromFields ] = useState<any[]>([]);

	const [ toFields, setToFields ] = useState([]);
	const [ searchFields, setSearchFields ] = useState([]);

	const csvRead = (csvArr) =>
	{
		// TODO 書く設定の from フィールドを変える

		setFromFields(Object.keys(csvArr[0]));
		setRawData(csvArr);
	}

	// import
	const [ live, setLive ] = useState(false);
	const [ importRunning, setImportRunning ] = useState(false);
	const [ importData, setImportData ] = useState({});
	const [ importResult, setImportResult ] = useState({});

	useEffect(() => {
		if (live) setImportRunning(true);
	}, [live]);

	useEffect(() => {
		if (importRunning) runImport();
	}, [importRunning]);

	useEffect(() => {
		if (importRunning) runImport();
	}, [importResult]);


	const runImport = () => 
	{
		if (!importRunning) return;

		const postData = Object.keys(importData)
			.filter(key => {
				if (!live)
				{
					return !importData[key].dry;
				}
				else
				{
					return true;
				}
			})
			.slice(0, 5); // 5つ

		if (postData.length <= 0)
		{
			setImportRunning(false);
			setLive(false);
			return;
		}

		const params = new FormData();

		if (live) params.append('live', '1');

		// setting
		Object.keys(importSetting).map((key) =>
		{
			if (importSetting[key]) params.append('importSetting[' + key + ']', importSetting[key]);
		});

		searchFields.map((searchField) =>
		{
			params.append('search[' + searchField.to + ']', searchField.compare);
		});

		postData.map((key) =>
		{
			const item = rawData[key];
			if (toFields)
			{
				searchFields.map((searchField, index) =>
				{
					const searchValue = valReplace(
						encodeText(item[searchField.from]),
						searchField.replace
					);
	
					params.append('data[' + key + '][search][' + searchField.to + ']', searchValue);
				});


				toFields.map((toField) =>
				{
					// if (item[importField.from])
					const value = valReplace(
						encodeText(item[toField.from]),
						toField.replace
					);

					params.append('data[' + key + '][fields][' + toField.to + ']', value);
				});
			}
		});


		importQuery.mutate({ params: params });
	}

	const importQuery = useImport({
		onSuccess: ({ data }) =>
		{
			const key = live ? 'live': 'dry';
			const newImportData = {...importData};
			const newResult = {...importResult};

			for (let index in data)
			{
				if (live)
				{
					delete newImportData[index];
				}
				else
				{
					newImportData[index].dry = true;
				}
				if (!newResult[index]) newResult[index] = [];
				newResult[index].push({
					key: key,
					results: data[index],
				});
			}

			setImportData(newImportData);
			setImportResult(newResult);
			//queryClient.invalidateQueries(settingLoadApi);
			//toast.success('保存した設定を更新しました。');
		},
		onError: () => {
			// インポートを中止
		}
	});


	const addSettingHook = (newSetting) =>
	{
		newSetting.searchFields = searchFields;
		newSetting.toFields = toFields;

		return newSetting;
	}
	const applySettingHook = (setting) =>
	{
		if ('searchFields' in setting) setSearchFields(setting.searchFields);
		if ('toFields' in setting) setToFields(setting.toFields);
	}




	// add encode
	settingConfig.encode= {
		label: 'Encoding',
		type: 'select',
		options: {
			SJIS: 'SJIS',
			EUCJP: 'EUCJP',
			UTF8: 'UTF8',
		}
	};
	// add ignore header
	settingConfig.ignoreHeader = {
		label: 'ヘッダー行(最初から〜行は無視する)',
		type: 'number',
	};
	settingConfig.ignoreFooter = {
		label: 'フッター行(最後から〜行は無視する)',
		type: 'number',
	};

	return (<div className="csv-importer">

		<label>
			<input type="checkbox" checked={showSetting} onChange={(e) => setShowSetting(e.target.checked)} />
			設定を表示
		</label>

		<SettingTable
			settingLoadApi={settingLoadApi}
			settingSaveApi={settingSaveApi}
			settingConfig={settingConfig}
			importSetting={importSetting}
			setImportSetting={setImportSetting}
			addSettingHook={addSettingHook}
			applySettingHook={applySettingHook}
			showSetting={showSetting}
		/>

		{showSetting && <>

			{useSearch &&
				<SearchFields
					config={config}
					searchFields={searchFields}
					setSearchFields={setSearchFields}
					fromFields={fromFields}
				/>
			}


		<ImportFields
			fromFields={fromFields}
			toFields={toFields}
			setToFields={setToFields}
			config={config}
		/>

		</>}

		<h2>インポート</h2>
		<table className="">
			<tbody>
				<tr>
					<th>ファイル読み込み</th>
					<td>
						<CsvReader
							callback={csvRead}
						/>
					</td>
				</tr>
			</tbody>
		</table>


		<div>
			<h2>インポート</h2>
			{!importRunning &&
				<>
				<button onClick={() => setImportRunning(true)}>テストする</button>
				<button onClick={() => setLive(true)}>インポート</button>
				</>
			}
			{importRunning &&
				<>
				<button onClick={() => {
					setImportRunning(false);
					setLive(false);
				}}>キャンセル</button>
				残り{live ? Object.keys(importData).length : Object.keys(importData).filter((key) => !importData[key].dry).length}
				</>
			}
		</div>


		<div>
			<label>
				CSV元データ表示:
				<input type="checkbox" onChange={ (e) => setShowRawData(!showRawData) } checked={showRawData} />
			</label>
		</div>



		{!showRawData && <>
		<h3>インポート</h3>
		<DataTableImport
			data={rawData}
			config={config}
			searchFields={searchFields}
			toFields={toFields}
			importData={importData}
			setImportData={setImportData}
			importResult={importResult}
			setImportResult={setImportResult}
			encodeText={encodeText}
			ignoreHeader={ importSetting.ignoreHeader && parseInt(importSetting.ignoreHeader) ? parseInt(importSetting.ignoreHeader): 0}
			ignoreFooter={ importSetting.ignoreHeader && parseInt(importSetting.ignoreFooter) ? parseInt(importSetting.ignoreFooter): 0}

		/>
		</>}

		{showRawData && <>
			<h3>元データ</h3>
			<DataTableRaw
				data={rawData}
				encodeText={encodeText}
			/>
		</>}

	</div>);
}


export const valReplace = (value, replace) =>
{
	let newValue = value.toString();
	replace.map((rep) => {
		newValue = newValue.replaceAll(rep.from, rep.to);
	});

	return newValue;
}

const CsvImporterRoot = (props) => 
{
	return (<Root
		debug={true}
	>
			<CsvImporter {...props} />
	</Root>)
}

export default CsvImporterRoot;
