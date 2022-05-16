import axios, { AxiosError } from 'axios';
import { useQuery, useMutation, UseMutationResult } from 'react-query'


const get = async <T>({ route, params }) =>
{
	const { data } = await axios.get<T>(route, { params: params });

	return data;
}
const useGet = <T>({ route, params = false }) =>
{
	if (!params) return useQuery(route, () => get<T>({ route: route, params: params}));

	return useQuery([route, {params: params}], () => get<T>({ route: route, params: params}));
}

const post = <T>(route) =>
{
	return async <T>({ params, headers={} }) =>
	{
		const { data } = await axios.post<T>(route, params, headers)

		return data;
	}
}
const patch = <T>(route) =>
{
	return async <T>({ params, headers={} }) =>
	{
		const { data } = await axios.post<T>(route, params, {
			headers:
			{
				'X-HTTP-Method-Override': 'PATCH',
			}
		});

		return data;
	}
}
const put = <T>(route) =>
{	
	return async <T>({ params, headers={} }) =>
	{
		const { data } = await axios.post<T>(route, params, {
			headers:
			{
				// 'content-type': 'multipart/form-data',
				'X-HTTP-Method-Override': 'PUT',
			}
		});

		return data;
	}
}
const _delete = <T>(route) =>
{	
	return async <T>({ params }) =>
	{
		const { data } = await axios.delete<T>(route, params);

		return data;
	}
}


const usePost = <T>( { route, onSuccess, onError, onSettled } ) =>
{
    const api = post<T>(route);

	return useP_({
		api: api,
		route: route,
		onSuccess: onSuccess,
		onError: onError,
		onSettled: onSettled
	});
}
const usePatch = <T>( { route, onSuccess, onError, onSettled } ) =>
{
    const api = patch<T>(route);

	return useP_({
		api: api,
		route: route,
		onSuccess: onSuccess,
		onError: onError,
		onSettled: onSettled
	});
}
const usePut = <T>( { route, onSuccess, onError, onSettled } ) =>
{
    const api = put<T>(route);

	return useP_({
		api: api,
		route: route,
		onSuccess: onSuccess,
		onError: onError,
		onSettled: onSettled
	});
}

const useDelete = <T>( { route, onSuccess, onError, onSettled } ) =>
{
    const api = _delete<T>(route);

	return useP_({
		api: api,
		route: route,
		onSuccess: onSuccess,
		onError: onError,
		onSettled: onSettled
	});
}


type useP_Props<T> = {
	api: UseMutationResult<T>;
	route: string,
	onSuccess: any,
	onError: any,
	onSettled: any
}

// TODO: multiple
const useP_ = <T>({ api, route, onSuccess, onError, onSettled }) =>
{
	return useMutation(api, 
	{
		onSuccess: (data) =>
		{
			if (onSuccess)
			{
				onSuccess({
					data: data,
					route: route,
				});
			}
		},
		onError: (error: AxiosError) =>
		{
			if (onError)
			{
				onError({
					error: error,
					route: route,
				});
			}

		},
		onSettled: (data, error) =>
		{
			if (onSettled)
			{
				onSettled({
					data: data,
					error: error,
					route: route,
				});
			}
		}
	});
}

export {
	useGet,
	usePost,
	usePatch,
	usePut,
	useDelete,
}