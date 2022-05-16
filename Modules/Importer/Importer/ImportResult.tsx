import React from "react";
import { isStr } from "react-toastify/dist/utils";


const ImportResult = ({result}) =>
{
	return (<div className="import-result">
			{result && (
				<div className="result">
				{result.map((result) => (
				<>
					<h3>{result.key == 'live' ? '実行結果': 'テスト結果'}</h3>
					<ul>
					{result.results.messages.map((item, index) =>
					{
						if (Array.isArray(item) && item.length > 1) {
							if (item[0] == 'edit')
							{

							}
							else
							{
								return (<li className={item[0]}>{item[1]}</li>);
							}
						}
						else if ((typeof item === 'string' || item instanceof String))
						{
							return (<li className="">{item}</li>)
						}
					})}
					</ul>
					<ul>
					{result.results.links.map((item, index) => {
						if (Array.isArray(item) && item.length > 1)
						{
							return (<li className="link"><a href={item[0]}>{item[1]}</a></li>)
						}
						else if (typeof item === 'string' || item instanceof String)
						{
							return (<li className="link"><a href={item}>{item}</a></li>)
						}
					})}
					</ul>

				</>
				))}
				</div>
			) || (
				<div className="no-result">no result</div>
			)}
	</div>);
}

export default ImportResult;