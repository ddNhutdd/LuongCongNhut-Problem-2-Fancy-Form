import { useState } from "react";
let result = new Array(4).fill(() => { });

export const apiStatus = {
	pending: 'pending',
	fetching: 'fetching',
	fullfilled: 'fullfilled',
	rejected: 'rejected'
}

const useQuery = (callApiCallback) => {
	const [apiStatusInner, setApiStatusInner] = useState(apiStatus.pending);
	const [error, setError] = useState();
	const [data, setData] = useState();
	const callQuery = async (...params) => {
		try {
			if (apiStatusInner === apiStatus.fetching) {
				return;
			}
			setApiStatusInner(apiStatus.fetching);
			const resp = await callApiCallback(...params);
			setData(resp);
			setApiStatusInner(apiStatus.fullfilled);
		} catch (error) {
			setApiStatusInner(apiStatus.rejected);
			setError(error);
		}
	}

	result[0] = callQuery;
	result[1] = apiStatusInner;
	result[2] = error;
	result[3] = data;
	return result;
}

export default useQuery;