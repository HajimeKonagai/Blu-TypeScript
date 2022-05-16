import React from 'react';

import * as icon from '@/Blu/General/Icon';

const IndexTableRowControlShow = ({item, panelOpen, findPanel}) =>
{
    return (<>
        <a className={'button show   ' + (findPanel({ type: 'view',   id: item.id }) ? 'active': '')} onClick={(e) => { e.preventDefault(); panelOpen({ type: 'view',   id: item.id })} } href={'#'}><icon.eye /></a>
    </>);
};

export default IndexTableRowControlShow;