import React from 'react'

const DataTableRaw = ({ data, encodeText }) =>
{
	return (
		<table className="data-table-raw">
			<thead>
				<tr>
				{data[0] &&
					data[0].map((item, key) =>
					{
							return <th>{key}</th>
					})
				}
				</tr>
			</thead>
			<tbody>
			{
				data.map((item, i) =>
				{
					return <tr>
					{
						data[i].map((item) =>
						{
							return <td>{encodeText(item)}</td>;
						})
					}
					</tr>
				})
			}
			</tbody>
		</table>
	);
}
export default DataTableRaw;
