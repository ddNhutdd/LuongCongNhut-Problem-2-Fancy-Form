import { axiosWithoutAuth } from "./config.services"

export const getPrices = () => {
	try {
		return axiosWithoutAuth.get('prices.json');
	} catch (error) {
		console.log(error);
	}
}