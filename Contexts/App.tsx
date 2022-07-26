import React, { createContext, useState, useContext, ReactNode } from 'react'

type AppComponentCallback
	= ({ config, setting, searchParams, setSearchParams }) => JSX.Element;

type AppContextProps = {
	appComponents: { [name: string]: AppComponentCallback };
}


const AppContext = createContext<AppContextProps>({
	appComponents: {},
});


// const AppContextProvider: React.VFC<{children: ReactNode, formHooks}> = ({ children, formHooks, formComponents }) =>
const AppContextProvider = ({ children, appComponents = {} }) =>
{
	return (
		<AppContext.Provider
			value={{
				appComponents: appComponents,
			}}>
			{ children }
		</AppContext.Provider>
	);
};


const useAppContext = () => useContext(AppContext);


export {
	AppComponentCallback,
	AppContextProvider,
	useAppContext,
}