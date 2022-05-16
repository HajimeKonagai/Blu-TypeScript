import React, { createContext, useState, useContext, ReactNode } from 'react'

type FormHookFunction = ({name, defaultData,  editData}: {name: string, defaultData: any, editData: any}) => any;
type FormComponentCallback
	= ({ fieldConfig, defaultValue, defaultData, editValue, editData, relationName, setEditValue, fieldErrors }) => JSX.Element;

type FormContextProps = {
	formHooks: { [name: string]: FormHookFunction };
	formComponents: { [name: string]: FormComponentCallback };
}


const FormContext = createContext<FormContextProps>({
	formHooks: {},
	formComponents: {},
});


// const FormContextProvider: React.VFC<{children: ReactNode, formHooks}> = ({ children, formHooks, formComponents }) =>
const FormContextProvider = ({ children, formHooks = {}, formComponents = {} }) =>
{
	return (
		<FormContext.Provider
			value={{
				formHooks: formHooks,
				formComponents: formComponents,
			}}>
			{ children }
		</FormContext.Provider>
	);
};


const useFormContext = () => useContext(FormContext);


export {
	FormHookFunction,
	FormComponentCallback,
	FormContextProvider,
	useFormContext,
}