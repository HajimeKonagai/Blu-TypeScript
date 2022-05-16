const isChanged = ( { type, nameOrigin, value, defaultData } ) =>
{
	let changed = false;
	switch (type)
	{
	case 'hasOne':
		for (let key in value)
		{
			if (!defaultData[nameOrigin] || defaultData[nameOrigin][key] != value[key])
			{
				changed = true;
				break;
			}
		}
		break;
	case 'hasMany':
		for (let key in value)
		{
			if (value[key])
			{
				changed = true;
			}
		}
		break;
	case 'belongsTo':
		changed = !defaultData[nameOrigin] || defaultData[nameOrigin].id != value;
		break;
	case 'manyMany':
		changed = ! Array.isArray(defaultData[nameOrigin]) || ! ( defaultData[nameOrigin].map((d) => d.id).sort().toString() == value.sort().toString() );
		break;

	case 'manyManyPivot':
		for (let key in value)
		{
			if (value[key])
			{
				changed = true;
			}
		}
		break;
	

	default:
		changed = value != defaultData[nameOrigin];
		break;
	}
	return changed;
}

export {
    isChanged,
};