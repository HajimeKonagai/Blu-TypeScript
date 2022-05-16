class Setting
{
	static createPostTypeFields = (config, postTypes) =>
	{
		if (postTypes.length < 1)
		{
			return [];
		}

		let _postTypeFields = [];

		for (let i = 0; i < postTypes.length; i++)
		{
			const postType = postTypes[i];
			if (!config.post_type[postType])
			{
				continue;
			}

			if (config.post_type[postType].supports)
			{
				const supports = {
					title:   { name: 'post_title', label: 'タイトル' },
					editor:  { name: 'post_content', label: '記事の内容' },
					excerpt: { name: 'post_excerpt', label: '抜粋' },
				};
				for (let sk in supports)
				{
					if (config.post_type[postType].supports.includes(sk))
					{
						const findIndex = _postTypeFields.findIndex(element => element.name == supports[sk].name);
						if (findIndex > -1)
						{
							_postTypeFields[findIndex].postTypes.push(postType);
						}
						else
						{
							_postTypeFields.push({name: supports[sk].name,   label: supports[sk].label, postTypes: [postType] });
						}
					}
					// props.config[postType].supports.includes('editor')  && _postTypeFields.push({name: 'post_content', label: '記事の内容'});
					// props.config[postType].supports.includes('excerpt') && _postTypeFields.push({name: 'post_excerpt',   label: '抜粋'});
				}
			}

			if (true)
			{
				const findIndex = _postTypeFields.findIndex(element => element.name == 'post_type');
				if (findIndex > -1)
				{
					_postTypeFields[findIndex].postTypes.push(postType);
				}
					else
				{
					_postTypeFields.push({name: 'post_type',  label: 'ポストタイプ', postTypes: [postType] });
				}
			}

			if (config.taxonomy)
			{
				Object.keys(config.taxonomy).map((key) =>
				{
					const taxonomy = config.taxonomy[key];
					_postTypeFields.push({
						name: 'taxonomy-' + key,
						label: taxonomy.label ? taxonomy.label : key,
						postTypes: [postType]
					});
				});
			}


			if (config.post_type[postType].meta)
			{
				Object.keys(config.post_type[postType].meta).map((key) =>
				{
					const meta = config.post_type[postType].meta[key];
					if ('group' == meta.type)
					{
						Object.keys(meta.meta).map((gk) =>
						{
							const findIndex = _postTypeFields.findIndex(element => element.name == gk);
							if (findIndex > -1)
							{
								_postTypeFields[findIndex].postTypes.push(postType);
							}
							else
							{
								_postTypeFields.push({
									name: gk,
									label: meta.meta[gk].label ? meta.meta[gk].label : gk,
									postTypes: [postType]
								});
							}
						});
					}
					else
					{
						const findIndex = _postTypeFields.findIndex(element => element.name == key);
						if (findIndex > -1)
						{
							_postTypeFields[findIndex].postTypes.push(postType);
						}
						else
						{
							_postTypeFields.push({
								name: key,
								label: meta.label ? meta.label : key,
								postTypes: [postType]
							});
						}
					}
				});
			}
		}

		return _postTypeFields;

	}

	static createDbFields()
	{
		const fields = {
			'number': '資料番号',
			'file_name': 'ファイル名',
			'title': '件名',
			'name': '資料名',
			'en_family_name': '科名（欧名）',
			'jp_family_name': '科名（和名）',
			'en_name': '学名',
			'jp_name': '種名（和名）',
			'collect_country': '採集地名：国名(和）',
			'collect_pref': '採集地名：県名',
			'collect_city': '採集地名：市郡町村区名',
			'collect_addr': '採集地名：以下（和）',
			'collect_date': '採集年月日',
			'collect_person': '採集者',
			'collect_number': '採集者標本番号',
			'rdb_country': '国RDB',
			'rdb_pref': '都道府県RDB',
			'is_private': '非公開(非公開->0 or 公開->1)',
		};

		let _dbFields = [];
		for (let key in fields)
		{
			_dbFields.push({
				name: key,
				label: fields[key],
				postTypes: ['plant']
			});
		}

		return _dbFields;
	}
}
export default Setting;
