import React, { useEffect, useState } from 'react';

import * as icon from '@/Blu/General/Icon';
import Loading from '@/Blu/General/Loading';
import Pagination from '@/Blu/General/Pagination';
import SpotEditor from '@/Blu/Components/Organisms/Index/SpotEditor';
import { InputField } from '../Organisms/Form/Field';
import { useIndexContext } from '@/Blu/Contexts/Index';

declare var route;

type Props = {
	config: any,
	setting?: any,
	handleSpotEditor,
	useIndex,
	useShow,
	useUpdate
	searchParams,
	setSearchParams,
	spotEditor?,
	rowControls,
}

const Index:React.VFC<Props> = ({
	config,
	setting=false,
	searchParams,
	setSearchParams,
	handleSpotEditor,
	useIndex,
	useShow,
	useUpdate,
	spotEditor=true,
	rowControls,
}) =>
{
	const [ order, setOrder ] = useState<[string, string]|boolean>(false); // [column, isDesc]
	const [ page, setPage ] = useState(1);

	const [ searchValues, setSearchValues ] = useState({});

	const [ editing, setEditing ] = useState<{name: string, id: number|string, defaultData:{}|null}|null>(null);
	const [ editingCloseLock, setEditingCloseLock ] = useState<boolean>(false);

	const { data, isLoading } = useIndex(searchParams);

	const search = () =>
	{
		const values:any = {
			page: page,
		};

		if (order)
		{
			values.orderBy = order[0];
			values.order = order[1];
		}

		Object.keys(searchValues).map((key) =>
		{
			values[key] = searchValues[key];
		});

		setSearchParams(values);
	}

	useEffect(() =>
	{
		search();
	}, [page, order]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (page != 1)
			{
				setPage(1);
			}
			else
			{
				search();
			}
		}, 1000)

		return () => clearTimeout(timer)
	}, [searchValues]);

	const changeSearchValue = ({ name, value }) =>
	{
		const newSearchValues = {...searchValues};

		if (value)
		{
			newSearchValues[name] = value;
		}
		else
		{
			delete newSearchValues[name];
		}

		setSearchValues(newSearchValues);
	}

	const { indexComponents } = useIndexContext();

	if (isLoading || !data) return <Loading message='一覧を読み込み中...' />;

	const columns = setting && 'columns' in setting ? setting.columns : Object.keys(config);


	// TODO: Panels と index の分離 query が　走ると panels がサイレンだーされてしまうので
	return (<div className='index'>

		{indexComponents && Object.keys(indexComponents).map((icKey) => {
			return indexComponents[icKey]({
				data        : data,
				isLoading   : isLoading,
				searchValues: searchValues,
				order       : order,
				page        : page,
			})
		})}

		<Pagination
			page={data.current_page || data.meta.current_page}
			lastPage={data.last_page | data.meta.last_page}
			setPage={setPage}
		/>

		<table
		>
			<thead>
				<tr>
					{Object.keys(rowControls).map((key) => (
						<th>{key}</th>
					))}
					{columns.map((key) => (
					<th key={key} className={key}>
						{config[key].label}
						{'sort' in config[key] && config[key].sort && (
							<button
							className={`sort order ${order && order[0] == key ? (order[1] == 'asc' ? 'asc' : 'desc') : ''}`}
							onClick={() => {
								if (order && order[0] == key)
								{
									switch (order[1])
									{
									case 'asc':
										setOrder([key, 'desc']);
										break;
									case 'desc':
										setOrder(false);
										break;
									default:
										setOrder([key, 'asc']);
										break
									}
								}
								else
								{
									setOrder([key, 'asc']);
								}
							}}
						>
							{order && (
								order[0] == key ? (order[1] == 'asc' ? <icon.chevronDown />: <icon.chevronUp />):<icon.chevronsUpDown />
							) || (
								<icon.chevronsUpDown />
							)}
						</button>
						)}
					</th>
					))}
				</tr>

				<tr>
					{Object.keys(rowControls).map((key) => (
						<th></th>
					))}
					{columns.map((key) => (
					<th key={key}>
						{config[key].search && (
							Object.getPrototypeOf(config[key].search) === Object.prototype && (
								Object.keys(config[key].search).map((searchName) =>
								(<>

										<InputField
											type={config[key].search[searchName].type}
											name={searchName}
											uniqueName={searchName}
											fieldConfig={config[key].search[searchName]}
											defaultData={''}
											editData={searchValues}
											setEditValue={changeSearchValue}
											errors={[]}
										/>

									{/*<input name={searchName} type="text" onChange={changeSearchValue} value={searchValues[searchName] ? searchValues[searchName]: ''} />*/}
								</>
								))
							)
						)}
					</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.data.map((item) => (
				<tr
					key={item.id}
				>

					{Object.keys(rowControls).map((key) => (
						<th key={key}>
							{rowControls[key](item)}
						</th>
					))}

					{columns.map((key) => (
						<td
							className={key}
							onDoubleClick={(e) =>
							{
								if (!spotEditor) return;
								if (!useUpdate || config[key].type == 'raw') return;
								
								if (! (editing && editing.name == key && editing.id == item.id))
								{
									if (editingCloseLock && !confirm('編集中のデータがります。保存されていませんが閉じてもよろしいですか？')) return;
									setEditing({ name: key, id: item.id, defaultData: item })
									setEditingCloseLock(false);
								}
							}}
						>
							{(editing && editing.name == key && editing.id == item.id) && (
								<div>
									<SpotEditor
										id={item.id}
										useShow={useShow}
										useUpdate={useUpdate}
										name={key}
										fieldConfig={config[key]}
										handleUpdated={() => {
											handleSpotEditor({});
											setEditing(null);
											setEditingCloseLock(false);
										}}
										closeLock={editingCloseLock}
										setCloseLock={(lock) => setEditingCloseLock(lock)}
										close={() => {
											if (editingCloseLock && !confirm('編集中のデータがります。保存されていませんが閉じてもよろしいですか？')) return;
											setEditing(null);
											setEditingCloseLock(false);
										}}
									/>
								</div>
							) || (
								<div>
								{
									config[key].attribute && (
										<>
										{config[key].attribute in item ? item[config[key].attribute]: ''}
										</>
									) || (<>
										{key in item ? item[key]: ''}
									</>)
								}
								</div>
							)}
						</td>
					))}

				</tr>
				))}
			</tbody>
		</table>
	
		<Pagination
			page={data.current_page || data.meta.current_page}
			lastPage={data.last_page | data.meta.last_page}
			setPage={setPage}
		/>

	</div>);
}

export default Index;