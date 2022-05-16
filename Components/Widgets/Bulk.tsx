import React, { useEffect, useState } from 'react';
import { arrayMoveImmutable } from 'array-move';

import { isChanged } from '@/Blu/Classes/Form';
import * as icon from '@/Blu/General/Icon';
import Container from '@/Blu/Components/Organisms/Bulk/Container';
import Row from '@/Blu/Components/Organisms/Bulk/Row';


type Props = {
	bulkName: string;
	config: any,
	sortName: string|undefined;
	defaultDataArr: any[];
	editDataArr: any[],
	setBulkEditValue,
	allowAdd?,
	allowDelete?,
	// useSave,
	errors,
};

const BulkTable:React.VFC<Props> = ({
	bulkName='bulk',
	config,
	sortName,
	defaultDataArr = [],
	editDataArr = [],
	setBulkEditValue,
	allowAdd = true,
	allowDelete = true,
	// useSave,
	errors=[],
}) =>
{
	const [ filters, setFilters ] = useState({});

	const changeFilterValue = (e) =>
	{

	}


	/**
	 * sortName で並べ替えたものを返す
	 */
	const sortBySortNameData = (newEditDataArr) =>
	{
		const mergedData = defaultDataArr.slice();

		newEditDataArr.map((eitem, eindex) =>
		{
			if (!mergedData[eindex])
			{
				mergedData[eindex] = eitem;
			}
			else
			{
				mergedData[eindex] = {...mergedData[eindex], ...eitem}	
			}

		});

		const sertBySortName: { seq: number, index: number }[] = mergedData.map((item, index) =>
		{
			
			if (!sortName)
			{
				return {
					seq: item.seq,
					index: index,
				};
			}

			return {
				seq: item[sortName],
				index: index,
			};
		})
		.filter((item) =>
		{
			if (!newEditDataArr[item.index] || !('delete' in newEditDataArr[item.index]) || !newEditDataArr[item.index]['delete'])
			{
				return item;
			}
		})
		.sort((a, b) =>
		{
			return a.seq - b.seq;
		});
		

		return sertBySortName;
	}

	/**
	 * sort
	 */
	const onSortEnd = ({ oldIndex, newIndex, add=false, deleteIndex=-1}) =>
	{
		const newEditDataArr = editDataArr.slice();

		if (add)
		{
			let arr_max_index = 0;
			newEditDataArr.map((v, i) => {
				arr_max_index = Math.max(arr_max_index, i);
			});
			if (isNaN(arr_max_index) || defaultDataArr.length > arr_max_index)
			{
				newEditDataArr[defaultDataArr.length] = {};
			}
			else
			{
				newEditDataArr.push({});
			}
		}


		if (deleteIndex > -1)
		{
			if ( deleteIndex < defaultDataArr.length )
			{
				const deleteData = newEditDataArr[deleteIndex] ?  newEditDataArr[deleteIndex]: {};
				deleteData['id'] = defaultDataArr[deleteIndex]['id'];
				deleteData['delete'] = true;
				newEditDataArr[deleteIndex] = deleteData;
			}
			else
			{
				delete newEditDataArr[deleteIndex];
			}
		}


		if (!sortName)
		{
			setBulkEditValue(newEditDataArr);
			return;
		}

		// 並べ替え前のデータ
		const sertBySortName: { seq: number, index: number }[] = sortBySortNameData(newEditDataArr);

		// 並べ替え後のデータ
		const sortedBySortName = arrayMoveImmutable(sertBySortName, oldIndex, newIndex)

		sortedBySortName.map((item, newIndex) =>
		{
			const dataDefault = item.index < defaultDataArr.length ? defaultDataArr[item.index]: {};// : createData[item.index - defaultValue.length];

			if (!newEditDataArr[item.index]) newEditDataArr[item.index] = {};

			if (sortName in dataDefault)
			{
				if (dataDefault[sortName] == (newIndex+1).toString())
				{
					delete newEditDataArr[item.index][sortName];
				}
				else
				{
					newEditDataArr[item.index][sortName] = (newIndex+1).toString(); // TODO: +1しないと一つ目が1になってしまうのが気持ち悪い
				}
			}
			else
			{
				newEditDataArr[item.index][sortName] = (newIndex+1).toString();
			}

			if (Object.keys(newEditDataArr[item.index]).length < 1 || (
				Object.keys(newEditDataArr[item.index]).length == 1 && 'id' in newEditDataArr[item.index]
			))
			{
				delete newEditDataArr[item.index];
			}
			else if ('id' in dataDefault)
			{
				// TODO: id => pk
				newEditDataArr[item.index]['id'] = dataDefault.id;
			}
		});


		setBulkEditValue(newEditDataArr);
	}

	const handleBulkRowChange = (args) =>
	{
		if (!Array.isArray(args))
		{
			args = [args];
		}

			console.log('bulk', editDataArr);

		const newEditDataArr = editDataArr.slice();

		args.map((arg) =>
		{
			const { index, name, value } = arg;

			const nameOrigin = name;

			if (!newEditDataArr[index]) newEditDataArr[index] = {};

			const dataDefault = index < defaultDataArr.length ? defaultDataArr[index]: {};// : createData[index - defaultValue.length];

			const changed = isChanged({
				type: config[nameOrigin].type,
				nameOrigin: nameOrigin,
				value: value,
				defaultData: dataDefault,
			});

			if (changed)
			{
				newEditDataArr[index][name] = value;
			}
			else
			{
				delete newEditDataArr[index][name];
			}


			if (Object.keys(newEditDataArr[index]).length < 1 || (
				Object.keys(newEditDataArr[index]).length == 1 && 'id' in newEditDataArr[index]
			))
			{
				delete newEditDataArr[index];
			}
			else if ('id' in dataDefault)
			{
				// TODO: id => pk
				newEditDataArr[index]['id'] = dataDefault.id;
			}

			
		});


		setBulkEditValue(newEditDataArr);
	}
	
	const addRow = () =>
	{
		onSortEnd({
			oldIndex: 0,
			newIndex: 0,
			add: true,
		});
	}

	const deleteRow = (index) =>
	{
		onSortEnd({
			oldIndex: 0,
			newIndex: 0,
			deleteIndex: index,
		});
	}

	/* TODO: すごい微妙、動かないがソートしてから適用は妥当
	useEffect(() => {
		onSortEnd({
			oldIndex: 0,
			newIndex: 0
		});
	}, []);
	*/
	

	const trComponents = sortBySortNameData(editDataArr).map((sortData, index) =>
	{
		
		let defaultValue = {};
		if (sortData.index < defaultDataArr.length)
		{
			defaultValue =  defaultDataArr[sortData.index];
		}
		let editValue = editDataArr[sortData.index] ? editDataArr[sortData.index] : {};

		return <Row
			key={sortData.index}
			bulkName={bulkName}
			index={index}
			bulkIndex={sortData.index}
			defaultValue={defaultValue}
			editValue={editValue}
			config={config}
			handleBulkRowChange={handleBulkRowChange}
			deleteRow={allowDelete ? deleteRow: null}
			isCreate={sortData.index >= defaultDataArr.length}
			errors={errors[index] ? errors[index] : {}}
		/>
	});


	// TODO: Panels と index の分離 query が　走ると panels がサイレンだーされてしまうので
	return (<div className='bulk'>
			<Container
				onSortEnd={onSortEnd}
				components={trComponents}
				useDragHandle={true}
			/>
			{allowAdd && (
			<div className='bulk-control'>
					<button onClick={addRow}><icon.plus /></button>
			</div>
			)}
	</div>);
}



export default BulkTable;
