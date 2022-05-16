import React from 'react'

type Props = {
	message?: string|null;
}

const Loading: React.VFC<Props> = ({message = null}) =>
{
	return (<div className="loading">
		<div className="loader"></div>
		{message && (<div className="message">{message}</div>)}
	</div>);
}

export default Loading;
