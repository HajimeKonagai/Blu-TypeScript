import React from 'react';

import * as icon from '@/Blu/General/Icon';

const IndexTableRowControlTrash = ({item, panelOpen, findPanel}) =>
{
    return (<>
        <a className={'button show   ' + (findPanel({ type: 'view',    id: item.id }) ? 'active': '')} onClick={(e) => { e.preventDefault(); panelOpen({ type: 'view',    id: item.id })} } href={'#'}><icon.eye /></a>
        <a className={'button restore' + (findPanel({ type: 'restore', id: item.id }) ? 'active': '')} onClick={(e) => { e.preventDefault(); panelOpen({ type: 'restore', id: item.id })} } href={'#'}><icon.cornerUpLeft /></a>
        <a className={'button destroy' + (findPanel({ type: 'destroy', id: item.id }) ? 'active': '')} onClick={(e) => { e.preventDefault(); panelOpen({ type: 'destroy', id: item.id })} } href={'#'}><icon.trash2 /></a>
    </>);
};

export default IndexTableRowControlTrash;