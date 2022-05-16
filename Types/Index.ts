type SearchValues = { [key: string]: [value: string | number | any] };

type SearchPagination = {
    page: number;
    order?: string,
    orderBy?: string,
    search?: SearchValues,
};

export {
	SearchValues,
    SearchPagination,
}