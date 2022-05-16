import React from 'react';

const ImageReader = ({ multiple = true, imageRead, name='file' }) =>
{
	const fileRead = async (e) =>
	{
		e.preventDefault();

		const files = [];
        e.stopPropagation();
		[].forEach.call(e.target.files, (f) =>
		{
			files.push({
				name: f.name,
				src: '',
				file: f,
			});
		});


		for (let i = 0; i < files.length; i++) // map ではだめというか面倒
		{
			files[i].src = await fileToSrc(files[i].file);
		}

		imageRead(files);
	}

	const fileToSrc = (file) =>
	{
		return new Promise((resolve, reject) =>
		{
			const reader = new FileReader();
			reader.onload = (e) =>
			{
				resolve(e.target.result);
			}
			reader.readAsDataURL(file); // TODO fxxk ie
		});
	}

	return(
		<div>
			<label>
				<input
					name={name}
					type="file"
					multiple={multiple}
					onChange={fileRead}
				/>
			</label>
		</div>
	);

}

export default ImageReader;
