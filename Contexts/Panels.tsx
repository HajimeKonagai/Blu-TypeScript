import React, { createContext, useState, useContext, ReactNode, useRef } from 'react'
import { Rnd } from 'react-rnd';


const PanelsContext = createContext({
	panels: {},
	openPanel: ({id, component}: { id: string | number, component: ReactNode }) => {},
	closePanel: (id: string | number ) => {},
	tekitoValue: 55,
});


const PanelsContextProvider: React.VFC<{children: ReactNode}> = ({ children }) =>
{
	const [ panels, setPanels ] = useState({});


	const openPanel = ({
		id,
		component,
	}) =>
	{
		const padding = 20;
		const shift = 20;
		const offsetTop = panelsRef.current && 'offsetTop' in panelsRef.current ? panelsRef.current['offsetTop'] : 0;
		const offsetWidth = panelsRef.current && 'offsetWidth' in panelsRef.current ? panelsRef.current['offsetWidth'] : 0;

		const posTop = panelsRef.current.getBoundingClientRect().top + window.pageYOffset;
		const top = window.pageYOffset > posTop ? window.pageYOffset - posTop : 0;

		// const top = Math.max((window.pageYOffset - offsetTop), 0);
		let x = 0;
		let y = top;
		let width = offsetWidth;
		let height = window.pageYOffset > posTop ? window.innerHeight: window.innerHeight - posTop;

		x = x + padding;
		y = y + padding;
		width = width - padding*2;
		height = height - padding*2;

		// 全く同じ位置に来てしまったらずらす
		Object.keys(panels).map((key_id) =>
		{
			if (panels[key_id].x == x && panels[key_id].y)
			{
				x += shift;
				y += shift;
				width -= shift;
				height -= shift;
			}
		});

		if (!id) id = Object.keys(panels).length;
		const state = {}; // TODO:
		setPanels((prevPanels) =>
		{
			const newPanels = {...prevPanels};
			newPanels[id] =
			{
				component: component,
				x: 'x' in state ? state.x : x,
				y: 'y' in state ? state.y : y,
				width : 'width'  in state ? state.width  : width,
				height: 'height' in state ? state.height : height,
				zIndex: 'zIndex' in state ? state.zIndex : Object.keys(prevPanels).length + 1,
			};


			return setZIndexes(id, newPanels);
		});
		return id;
	}

	const closePanel = (id) =>
	{
		setPanels((prevPanels) =>
		{
			const newPanels = { ...prevPanels };
			delete newPanels[id];
			return newPanels;
		});
	}

	const getPanel = (id) =>
	{
		return id in panels ? panels[id] : false;
	}


	const onDragStop = (e, d, id) =>
	{
		setPanels((prevPanels) =>
		{
			const newPanels = {...prevPanels};
			newPanels[id].x = d.x;
			newPanels[id].y = d.y;
			return setZIndexes(id, newPanels);
		});
	}

	const onResizeStop = (e, ref, position, id) =>
	{
		setPanels((prevPanels) =>
		{
			const newPanels = {...prevPanels};
			newPanels[id].x = position.x;
			newPanels[id].y = position.y;
			newPanels[id].width = ref.style.width;
			newPanels[id].height = ref.style.height;
			return setZIndexes(id, newPanels);
		});
	}

	const onClick = (id) =>
	{
		setPanels((prevPanels) =>
		{
			const newPanels = {...prevPanels};
			return setZIndexes(id, newPanels);
		});
	}

	const setZIndexes = (id, newPanels) =>
	{
		const maxZIndex = Object.keys(newPanels).length;
		let currentZIndex = newPanels[id] && newPanels[id].zIndex ? newPanels[id].zIndex: 0;
		let currentMaxZIndex = 0;

		Object.keys(newPanels).map((key_id) =>
		{
			currentMaxZIndex = Math.max(currentMaxZIndex, newPanels[key_id].zIndex);
		});

		if (currentMaxZIndex >= currentZIndex)
		{
			Object.keys(newPanels).map((key_id, idx) =>
			{
				if (newPanels[key_id].zIndex > currentZIndex)
				{
					newPanels[key_id].zIndex = Math.min(maxZIndex - 1, Math.max(newPanels[key_id].zIndex-1, 0));
				}
			});

			if (newPanels[id]) newPanels[id].zIndex = maxZIndex;
		}

		return newPanels;
	}

	const panelsRef = useRef<HTMLDivElement>(null);

	const tekitoValue = 111;

	return (
		<PanelsContext.Provider
			value={{
				tekitoValue,
				panels,
				openPanel,
				closePanel,
			}}
		>
			{ children }

			<div
				className="panels"
				ref={panelsRef}
			>
			{Object.keys(panels).map((id) => (
				<Rnd
					className="panel"
					default={{
						x     : panels[id].x,
						y     : panels[id].y,
						width : panels[id].width,
						height: panels[id].height,
					}}
					size={{
						width: panels[id].width,
						height: panels[id].height,
					}}
					position={{
						x: panels[id].x,
						y: panels[id].y,
					}}
					onDragStop={(e, d) => onDragStop(e, d, id)}
					onResizeStop={(e, direction, ref, delta, position) => onResizeStop(e, ref, position, id)}
					dragHandleClassName='panel-drag'
					onClick={() => onClick(id)}
					onDragStart={() => onClick(id)}
					style={{
						zIndex: panels[id].zIndex,
					}}
				>
				<div className="panel-content">
					{panels[id].component}
				</div>
			</Rnd>
			))}
			</div>

		</PanelsContext.Provider>
	);
};

const usePanelsContext = () => useContext(PanelsContext);


export {
	PanelsContextProvider,
	usePanelsContext,
}