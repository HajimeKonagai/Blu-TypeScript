import React, { useEffect, useState } from 'react';

import * as icon from '@/Blu/General/Icon';

import { valReplace } from '../CsvImporter';
import ImportResult from './ImportResult';

const DataTableImport = ({
	data,
	config,
	searchFields,
	toFields,
	importData,
	setImportData,
	importResult,
	setImportResult,
	encodeText,
	ignoreHeader,
	ignoreFooter,
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
			if (
				i >= ignoreHeader &&
				i < (data.length - ignoreFooter)
			)
			{
				newData[i] = {};
			}
		});
		setImportData(newData);
	}
	const uncheckAll = () =>
	{
		setImportData({});
	}

	return(<div className="data-table-import">
		<table className="widefat">
			<thead>
				<tr>
					<th>
						インポート対象
						<button onClick={ checkAll }><icon.checkSquare /></button>
						<button onClick={ uncheckAll }><icon.square /></button>
					</th>

					{searchFields && searchFields.map((searchField) =>
					(
					<th>検索[{searchField.from}]→[
						{config.find(element => searchField.to == element.name) ?
						config.find(element => searchField.to == element.name).label: searchField.to}
					]</th>
					))}

					{toFields && toFields.map((item, key) =>
					(
					<th>[{item.from}]→[
						{config.find(element => item.to == element.name)  ?
						config.find(element => item.to == element.name).label: item.to}
					]にインポート</th>
					))}

					<th>結果<button onClick={() => setImportResult({})}>クリア</button></th>
				</tr>
			</thead>
			<tbody>
			{
				data.map((item, i) =>
				{
					return (<tr>

						<th>
							<input type="checkbox" checked={importData[i]} onChange={ () => check(i)} />
							{importData[i] && importData[i].dry && (<span>テスト済</span>)}
						</th>
						{searchFields && searchFields.map((searchField) => (
						<td>
							{valReplace(
								encodeText(item[searchField.from]),
								searchField.replace
							)}
						</td>
						))}
						{toFields &&
							toFields.map((importField) =>
							{
								return <td>
									{item[importField.from] &&
										valReplace(
											encodeText(item[importField.from]),
											importField.replace
										)
									}
								</td>
							})
						}
						<td className="import-result">
							<ImportResult
								result={importResult[i]}
							/>
						</td>
					</tr>)
				})
			}
			</tbody>
		</table>
	</div>);
}


export default DataTableImport;