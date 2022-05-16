import { useState, useEffect } from 'react';
 
const useWindowDimensions = () =>
{
 
	const getWindowDimensions = () =>
	{
		const { innerWidth: width, innerHeight: height } = window;
		return {
			width,
			height
		};
	}
 
	const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

	useEffect(() =>
	{
		const onResize = () =>
		{
			setWindowDimensions(getWindowDimensions());
		}
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	return windowDimensions;
}


const is_json = (data) =>
{
	try {
		JSON.parse(data);
	} catch (error) {
		return false;
	}
	return true;
}

const objectToFormData = (obj, prefix, formData = new FormData) =>
{
	if (obj && typeof obj === 'object' && !(obj instanceof Date) && !(obj instanceof File))
	{
		Object.keys(obj).map((key) => {
			objectToFormData(obj[key], prefix ? `${prefix}[${key}]` : key, formData);
		});
	}
	else if (obj && Array.isArray(obj))
	{
		obj.map((key) => {
			objectToFormData(obj[key], prefix ? `${prefix}[${key}]` : key, formData);
		});
	}
	else
	{
		const value = obj == null ? '' : obj;
		formData.append(prefix, value);
	}

	return formData;
}


export
{
	useWindowDimensions,
	is_json,
	objectToFormData,
}