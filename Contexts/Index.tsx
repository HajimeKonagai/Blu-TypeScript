import React, { createContext, useState, useContext, ReactNode } from 'react'

type IndexComponentCallback
	= ({ data, isLoading, searchValues, order, page }) => JSX.Element;

type IndexContextProps = {
	indexComponents: { [name: string]: IndexComponentCallback };
}


const IndexContext = createContext<IndexContextProps>({
	indexComponents: {},
});


// const IndexContextProvider: React.VFC<{children: ReactNode, formHooks}> = ({ children, formHooks, formComponents }) =>
const IndexContextProvider = ({ children, indexComponents = {} }) =>
{
	return (
		<IndexContext.Provider
			value={{
				indexComponents: indexComponents,
			}}>
			{ children }
		</IndexContext.Provider>
	);
};


const useIndexContext = () => useContext(IndexContext);


export {
	IndexComponentCallback,
	IndexContextProvider,
	useIndexContext,
}