import React, { useEffect, useState } from 'react';

import Root from '@/Blu/Contexts/Root';
import { usePost } from '@/Blu/General/Api';
import ImageReader from '@/Blu/Components/Atoms/Form/ImageReader';

import SettingTable from './Importer/SettingTable';
import DataTableMedia from './Importer/DataTableMedia';


type Props = {
	config: any,
	settingConfig?: any,
	importApi: string,
	settingLoadApi: string,
	settingSaveApi: string,
}

const ImgImporter: React.VFC<Props> = ({
	config,
	settingConfig,
	importApi,
	settingLoadApi,
	settingSaveApi,
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

	const [ importSetting, setImportSetting ] = useState({});

	const [ files, setFiles ] = useState([]);

	const imageRead = (files) =>
	{
		setFiles((prev) => {
			const newFiles = prev.slice();
			files.map((file) => {
				newFiles.push(file);
			});

			return newFiles;
		});

	}

	// import
	const [ live, setLive ] = useState(false);
	const [ importRunning, setImportRunning ] = useState(false);
	const [ renames, setRenames ] = useState([]);
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
			.slice(0, 1); // 1つずつ

		if (postData.length <= 0)
		{
			setImportRunning(false);
			setLive(false);
			return;
		}

		const params = new FormData();

		if (live) params.append('live', '1');

		postData.map((key) =>
		{
			const item = files[key];
			params.append('data[' + key + '][name]', renames[key] ? renames[key] + '.' + item.name.split('.').pop(): item.name);
			params.append('data[' + key + '][file]', item.file);
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


	const clearAll = () =>
	{
		setFiles([]);
		setRenames([]);
		setImportData([]);
		setImportResult([]);
	}

	return (<div className="img-importer">
		{settingConfig &&
			<SettingTable
				settingLoadApi={settingLoadApi}
				settingSaveApi={settingSaveApi}
				settingConfig={settingConfig}
				importSetting={importSetting}
				setImportSetting={setImportSetting}
			/>
		}


		<h2>インポート</h2>
		<table className="">
			<tbody>
				<tr>
					<th>ファイル読み込み</th>
					<td>
						<ImageReader
							imageRead={imageRead}
						/>
					</td>
				</tr>
			</tbody>
		</table>

		<div>
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
				残り{Object.keys(importData).length}
				</>
			}
		</div>

		{files.length > 0 && !live &&
			<button onClick={clearAll}>ファイルをクリア</button>
		}

		<DataTableMedia
			data={files}
			renames={renames}
			setRenames={setRenames}
			importData={importData}
			setImportData={setImportData}
			importResult={importResult}
			setImportResult={setImportResult}
		/>


	</div>);
}


const ImgImporterRoot = (props) => 
{
	return (<Root
		debug={true}
	>
			<ImgImporter {...props} />
	</Root>)
}

export default ImgImporterRoot;