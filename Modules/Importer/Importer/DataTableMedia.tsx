import React, { useState, useEffect } from 'react';

import * as icon from '@/Blu/General/Icon';

import ImportResult from './ImportResult';

const DataTableMedia = ({
	data,
	renames,
	setRenames,
	importData,
	setImportData,
	importResult,
	setImportResult,
}) =>
{

	const check = (i) =>
	{
		const newData = {...importData};
		if (newData[i])
		{
			delete newData[i];
		}
		else
		{
			newData[i] = {
				result: {},
			};
		}

		setImportData(newData);
	}

	const checkAll = () =>
	{
		const newData = {};
		data.map((item, i) =>
		{
			newData[i] = { result: '' };
		});
		setImportData(newData);
	}

	const uncheckAll = () =>
	{
		setImportData({});
	}



	const changeName = (e,i) =>
	{
		const newRenames = renames.slice();
		if (e.target.value)
		{
			newRenames[i] = e.target.value;
		}
		else if (newRenames[i])
		{
			delete newRenames[i];
		}
		setRenames(newRenames);
	}


	return (<>
		<table className="data-table-media">
			<thead>
				<tr>
					<th>
						インポート対象<br />
						<button onClick={ checkAll } title="全てチェック"><icon.checkSquare /></button>
						<button onClick={ uncheckAll } title="全てのチェックを外す"><icon.square /></button>
					</th>
					<th>画像プレビュー</th>
					<th>ファイル名</th>
					<th>結果<button onClick={() => setImportResult({})}>クリア</button></th>
				</tr>
			</thead>
			<tbody>
			{
				data.map((item, i) =>
				(<tr>
						<th>
							<input type="checkbox" checked={importData[i]} onChange={ () => check(i)} />
							{importData[i] && importData[i].dry && (<span>テスト済</span>)}
						</th>
						<td>
							<img
								src={item.src}
								style={{maxHeight: '100px'}}
							/>
						</td>
						<td>
							{item.name}
							<input type="text" value={ renames[i] ? renames[i]: '' } onChange={(e) => changeName(e,i) } />
							{ renames[i] ? '.' + item.name.split('.').pop(): '' }
						</td>
						<td className="import-result">
							<ImportResult
								result={importResult[i]}
							/>
						</td>
					</tr>
				))
			}
			</tbody>
		</table>
	</>);
}


export default DataTableMedia;
