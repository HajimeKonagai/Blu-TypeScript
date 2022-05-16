import React, { createContext, useState, useContext, ReactNode } from 'react'
import * as Icon from '@/Blu/General/Icon';


const ModalContext = createContext({
	tekitoValue: 10,
	openModal: (component: ReactNode) => { console.log('origin') },
	closeModal: () => {},
});


const ModalContextProvider: React.VFC<{children: ReactNode}> = ({ children }) =>
{
	const [ className, setClassName ] = useState(null);
	const [ modal, setModal ] = useState(null);
	const [ closeButton, setCloseButton ] = useState(true);

	const openModal = ({
		id,
		component
	}) =>
	{
		console.log('modal openmodal');
		if (id) setClassName(className);
		setModal(component);
	}

	const closeModal = () =>
	{
		setModal(null);
	}
	const tekitoValue=120;

	return (
		<ModalContext.Provider
			value={{
				openModal,
				closeModal,
				tekitoValue,
			}}
		>
			{ children }


			{modal && (

			<div
				className={`modal ${className}`}
			>
				<div className="modal-content">
					{closeButton && (<button className="close" onClick={closeModal}>
						<Icon.x />
					</button>)}
					{modal}
				</div>
			</div>
			
			)}

		</ModalContext.Provider>
	);
};


const useModalContext = () => useContext(ModalContext);


export {
	ModalContextProvider,
	useModalContext,
}