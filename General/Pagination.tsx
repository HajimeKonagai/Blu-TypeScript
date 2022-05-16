import React from 'react'

type Props = {
	page: number;
    lastPage: number;
	setPage: (page: number) => void;
	add?: number;
	prev?: string|boolean,
	next?: string|boolean,
}

const Pagination: React.VFC<Props> = ( { page, lastPage, setPage, add = 3, prev="PREV",  next="NEXT" } ) =>
{
	const pages: number[] = [];
	const firstPageNum = Math.max(1, page - add);
	const lastPageNum = Math.min(lastPage, page + add + (add + (firstPageNum - page)));

	for (let i = firstPageNum; i <= lastPageNum; i++)
	{
		pages.push(i);
	}

	return (
			<nav className="pagination">
				{prev && page > 1 && (<span className="prev" onClick={() => setPage(page - 1)}>{prev}</span>)}

				<span className="pages">
					{!pages.includes(1) && (<button className="page first link-button small" onClick={() => setPage(1)}>1</button>)}
					{!pages.includes(1) && !pages.includes(2) && (<span className="first"></span>)}
					{pages.map((p) => (
						p == page && (
							<span key={p} className="current page link-button small disable">{p}</span>
						) || (
							<button key={p} className="page link-button small" onClick={() => setPage(p)}>{p}</button>
						)
					))}
					{!pages.includes(lastPage) && !pages.includes(lastPage-1) && (<span className="last"></span>)}
					{!pages.includes(lastPage) && (<button className="page last link-button small" onClick={() => setPage(lastPage)}>{lastPage}</button>)}
				</span>

				{next && page < lastPage && (<span className="next" onClick={() => { console.log(page+1); setPage(page + 1)}}>{next}</span>)}
			</nav>
	);
}

export default Pagination;

