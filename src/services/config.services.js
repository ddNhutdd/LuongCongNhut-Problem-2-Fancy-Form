import axios from "axios";

const BASE_URL = 'https://interview.switcheo.com/';

export const axiosWithoutAuth = axios.create({
	baseURL: BASE_URL,
	timeout: 180_000,
});