import React from 'react';

import ViewField from '@/Blu/Components/Organisms/View/Field';

const View = ({ config, defaultData }) =>
{

	return (<div className='view'>
		{Object.keys(config).map((name) => {
			return (<div className={`view-field ${name}`}>
				<label>
					{config[name].label}
				</label>
				<span className='view-value'>
					<ViewField
						name={name}
						fieldConfig={config[name]}
						defaultData={defaultData}
					/>
				</span>
			</div>)
		})}
	</div>);
}

export default View;