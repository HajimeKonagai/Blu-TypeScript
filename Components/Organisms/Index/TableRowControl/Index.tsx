import React from 'react';

import * as icon from '@/Blu/General/Icon';

const IndexTableRowControl = ({item, panelOpen, findPanel}) =>
{
    return (<>
        <a className={'button show   ' + (findPanel({ type: 'view',   id: item.id }) ? 'active': '')} onClick={(e) => { e.preventDefault(); panelOpen({ type: 'view',   id: item.id })} } href={'#'}><icon.eye /></a>
        <a className={'button edit   ' + (findPanel({ type: 'edit',   id: item.id }) ? 'active': '')} onClick={(e) => { e.preventDefault(); panelOpen({ type: 'edit',   id: item.id })} } href={'#'}><icon.edit2 /></a>
        <a className={'button delete ' + (findPanel({ type: 'delete', id: item.id }) ? 'active': '')} onClick={(e) => { e.preventDefault(); panelOpen({ type: 'delete', id: item.id })} } href={'#'}><icon.trash2 /></a>
    </>);
};

export default IndexTableRowControl;