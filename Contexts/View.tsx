import React, { createContext, useState, useContext, ReactNode } from 'react'

type ViewComponentCallback
	= ({ name, fieldConfig, defaultData }) => JSX.Element;

type ViewContextProps = {
	viewComponents: { [name: string]: ViewComponentCallback };
}


const ViewContext = createContext<ViewContextProps>({
	viewComponents: {},
});


// const ViewContextProvider: React.VFC<{children: ReactNode}> = ({ children }) =>
const ViewContextProvider = ({ children, viewComponents }) =>
{

	return (
		<ViewContext.Provider
			value={{
				viewComponents: viewComponents,
			}}>
			{ children }
		</ViewContext.Provider>
	);
};

const useViewContext = () => useContext(ViewContext);

export {
	ViewComponentCallback,
	ViewContextProvider,
	useViewContext,
}