import React from 'react';
import ReactDOM from 'react-dom';

import * as icon from '@/Blu/General/Icon';

export const ImportFieldDefault = {
		from: '',
		to: name,
		replace: [],
		taxonomy_search: 'name',
		taxonomy_delimiter: ',',
		post_type_search: 'slug',
};

const ImportField = ({
	item,
	index,
	config,
	fromFields,
	setToFields,
}) =>
{
	const deleteImportField = (i) =>
	{
		setToFields((prev) =>
		{
			const next = prev.slice();
			next.splice(i, 1);
			return next;
		});
	}

	const importFieldChange = (i, key, value) =>
	{
		setToFields((prev) =>
		{
			const next = prev.slice();
			const newObj = {};
			newObj[key] = value;
			next[i] = {...prev[i], ...newObj};
			return next;
		});
	}

	const addImportFieldReplace = (i) =>
	{
		setToFields((prev) =>
		{
			const next = prev.slice();
			next[i].replace.push({
				from: '',
				to: '',
			});
			return next;
		});
	}
	const removeImportFieldReplace = (i, ri) =>
	{
		setToFields((prev) =>
		{
			const next = prev.slice();
			next[i].replace.splice(ri, 1);
			return next;
		});
	}

	const changeImportFieldReplace = (value, i, ri, key) =>
	{
		setToFields((prev) =>
		{
			const next = prev.slice();
			next[i].replace[ri][key] = value;
			return next;
		});
	}

	return (
		<tr>
			<td>
				<select
					onChange={(e) => importFieldChange(index, 'from', e.target.value) }
					value={item.from}
				>
				<option value=""></option>
				{fromFields.map((item) =>
					{
						return <option value={item}>{item}</option>;
					})
				}
				</select>
			→</td>
			<td>
				<input
					type="text"
					value={item.to}
					onChange={(e) => importFieldChange(index, 'to', e.target.value) }
				/>
				<span>
				{config.find(element => item.to == element.name) &&
					config.find(element => item.to == element.name).label
				}
				</span>
			</td>
			<td>
				{item.to =='post_type' &&
					<>
					検索:<select
						value={item.post_type_search}
						onChange={ (e) => importFieldChange(index, 'post_type_search', e.target.value) }
					>
						<option value="name">名前</option>
						<option value="slug">スラッグ</option>
					</select>
					</>
				}
				{ /*
					TODO taxonomy の場合は設定を付与する
					・id | slug | name | term_taxonomy_id に一致
					・値が入っていない場合に上書きするか
					・値がなかった場合に新たに作成するか
				*/ }
				<ul>
				{
					item.replace.map((r_v, r_i) =>
					{
						return (<li>
							<input type="text" value={r_v.from} size={6}
								onChange={ (e) => changeImportFieldReplace(e.target.value, index, r_i, 'from') } />
							→
							<input type="text" value={r_v.to}   size={6}
								onChange={ (e) => changeImportFieldReplace(e.target.value, index, r_i, 'to') } />


							<button onClick={() => removeImportFieldReplace(index, r_i)}><icon.delete_ /></button>
						</li>);
					})
				}
				</ul>
			<button onClick={() => addImportFieldReplace(index)}><icon.plus /></button>

			</td>
			<td>
				<button onClick={() => deleteImportField(index)}><icon.delete_ /></button>
			</td>
		</tr>
	);
}

export const ImportFields = ({
	fromFields,
	toFields,
	setToFields,
	config,
}) =>
{

	const addImportField = (name) =>
	{
		setToFields((prev) =>
		{
			const newObj = {...ImportFieldDefault}; // TODO Lib 化して深いコピー
			newObj.replace = []; // TODO Lib 化して深いコピー
			newObj.to = name;
			const newArr = prev.slice();
			newArr.push(newObj)
			return newArr;
		});
	}


	return (<>
		<h3>インポートフィールド</h3>

		<table className="">
			<thead>
				<tr>
					<th>ファイルの〜から</th>
					<th>〜にインポート</th>
					<th>文字の置き換え</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
			{
				toFields.map((item, i) =>
				{
					return <ImportField
						item={item}
						index={i}
						config={config}
						fromFields={fromFields}
						setToFields={setToFields}
					/>
				})
			}
			</tbody>
			<tfoot>
				<td colSpan={4}>
				{
					Object.keys(config).map((key) =>
					{
						return (
							<button
								onClick={ () => addImportField(config[key].name) }
								value={config[key].name}
							>
								{config[key].label}
								{config[key].models && config[key].models.length > 1 && '(' + config[key].models.length + ')'}
							</button>
						);
					})
				}
				</td>
			</tfoot>
		</table>
	</>);

}

export default ImportFields;
