import React from 'react';
import ReactDOM from 'react-dom';

import * as icon from '@/Blu/General/Icon';

export const SearchFieldDefault = {
		from: '',
		to: '',
		replace: [],
		compare: '=',

};

export const SearchFields = ({
	searchFields,
	setSearchFields,
	config,
	fromFields,
}) =>
{
	const addSearchField = () =>
	{
		setSearchFields((prev) =>
		{
			const newSearchFields = prev.slice();
			newSearchFields.push({...SearchFieldDefault});

			return newSearchFields;
		});
	}

	const removeSearchField = (index) =>
	{
		setSearchFields((prev) =>
		{
			const newSearchFields = prev.slice();
			newSearchFields.splice(index, 1);

			return newSearchFields;
		});
	}

	const changeSearchField = (index, key, value) =>
	{
		setSearchFields((prev) =>
		{
			const newSearchFields = prev.slice();
			newSearchFields[index][key] = value;

			return newSearchFields;
		});
	}

	const addSearchReplace = (index) =>
	{
		setSearchFields((prev) =>
		{
			const newSearchFields = prev.slice();
			newSearchFields[index].replace = [...prev[index].replace, {
				from: '',
				to: '',
			}];

			return newSearchFields;
		});
	}
	const removeSearchReplace = (index, i) =>
	{
		setSearchFields((prev) =>
		{
			const newSearchFields = prev.slice();
			newSearchFields[index].replace.splice(i, 1);

			return newSearchFields;
		});
	}
	const changeSearchReplace = (index, value, i, key) =>
	{
		setSearchFields((prev) =>
		{
			const newSearchFields = prev.slice();
			const next = {...prev};
			newSearchFields[index].replace[i][key] = value;

			return newSearchFields;
		});
	}


	return (
		<>
		<h3>検索対象フィールド</h3>
		<table className="">
			<thead>
				<tr>
					<th>ファイルの〜と</th>
					<th>〜を検索</th>
					<th>文字の置き換え<br /><small>※あいまい検索では「%」をワイルドカードとして使用できます。</small></th>
					<th>検索メソッド</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
				{searchFields.map((searchField, index) =>(
				<tr>
					<td>
						<select
							value={searchField.from}
							onChange={(e) => changeSearchField(index, 'from', e.target.value)}
						>
							<option value=""></option>
							{fromFields && fromFields.map((item) =>
								{
									return <option value={item}>{item}</option>;
								})
							}
						</select>

					</td>
					<td>
						<select
							value={searchField.to}
							onChange={(e) => changeSearchField(index, 'to', e.target.value)}
						>
							<option value=""></option>
							<option value="id">ID</option>
							{config.map((item) =>
							{
								return <option value={item.name}>{item.label}</option>
							})}
						</select>
					</td>
					<td>
						<ul>
						{
							searchField.replace.map((v, i) => 
							{
								return (<li>
									<input type="text" value={v.from} size={6} onChange={ (e) => changeSearchReplace(index,e.target.value, i, 'from') } />
									→
									<input type="text" value={v.to}   size={6} onChange={ (e) => changeSearchReplace(index, e.target.value, i, 'to') } />
									<button onClick={() => removeSearchReplace(index, i)}><icon.delete_ /></button>
								</li>);
							})
						}
						</ul>
						<button onClick={() => addSearchReplace(index)}><icon.plus /></button>
					</td>
					<td>
						<select
							value={searchField.compare}
							onChange={(e) => changeSearchField(index, 'compare', e.target.value)}
						>
							<option value="=">完全一致</option>
							<option value="like">あいまい検索</option>
						</select>
					</td>
					<th>
						<button onClick={() => removeSearchField(index)}><icon.delete_ /></button>
					</th>
				</tr>
				))}
			</tbody>
			<tfoot>
				<tr>
					<th>
						<button onClick={addSearchField}><icon.plus /></button>
					</th>
				</tr>
			</tfoot>
		</table>
		</>
	);
}

export default SearchFields;
