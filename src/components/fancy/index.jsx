import React, { useRef, useState } from "react";
import Input, { inputType } from '../input';
import css from './fancy.module.scss';
import { getPrices } from "../../services/prices.services";
import useQuery, { apiStatus } from "../../hooks/useQuery";
import { math } from '../../App.jsx';

const calcValue = (fromAmount, listPrices, fromSelected, toSelected) => {
	try {
		// find from prices
		const fromPrice = listPrices.find((price) => price.currency === fromSelected.currency)?.price;

		// find to prices
		const toPrice = listPrices.find((price) => price.currency === toSelected.currency)?.price;

		// calc
		const fromAmountFraction = math.fraction(fromAmount);
		const fromPriceFraction = math.fraction(fromPrice);
		const toPriceFraction = math.fraction(toPrice);
		const resultFraction = math.chain(fromAmountFraction)
			.multiply(fromPriceFraction)
			.divide(toPriceFraction)
			.done()
		return math.number(resultFraction)
	} catch (error) {
		return 'N/A';
	}
}

function Fancy() {
	// list item
	const [listItems, setListItems] = useState([]);
	const getListItemsApi = async () => {
		try {
			const resp = await getPrices();
			const data = resp?.data;
			const uniqueData = Array.from(data.reduce((map, obj) => {
				map.set(obj.currency, obj);
				return map;
			}, new Map()).values());

			const result = uniqueData.map(item => {
				item.value = item.currency;
				item.label = item.currency;
				return item;
			})
			setListItems(result)
			setFromSelected(result[0]);
			setToSelected(result[0])
		} catch (error) {
			console.log(error);
		}
	}
	const [callApi, status] = useQuery(getListItemsApi)

	//from 
	const [fromSelected, setFromSelected] = useState(listItems[0]);
	const dropdownFromChange = (item) => {
		setFromSelected(item);
		setInputToValue(calcValue(inputFromValue, listItems, item, toSelected).toString());
	}
	const [inputFromValue, setInputFromValue] = useState('');
	const inputFromChangeHandle = (ev) => {
		setInputFromValue(ev.target.value);
		setInputToValue(calcValue(ev.target.value, listItems, fromSelected, toSelected).toString());
	}

	//to
	const [toSelected, setToSelected] = useState(listItems[0]);
	const dropdownToChange = (item) => {
		setToSelected(item);
		setInputToValue(calcValue(inputFromValue, listItems, fromSelected, item).toString())
	}
	const [inputToValue, setInputToValue] = useState('');
	const inputToChangeHandle = (ev) => {
		setInputToValue(ev.target.value)
	}

	//first time 
	const firstTime = useRef(true)
	if (firstTime.current) {
		firstTime.current = false;
		callApi();
	}

	if (status === apiStatus.fetching) {
		return (
			<div className={css.fancy}>
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h1>Convert</h1>
						</div>
						<div className="col-12">
							Loading ...
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={css.fancy}>
			<div className="container">
				<div className="row">
					<div className="col-12">
						<h1>Convert</h1>
					</div>
					<div className="col-6 col-md-12">
						<Input
							selectedItem={fromSelected}
							listItem={listItems}
							onChange={dropdownFromChange}
							placeholder={`Input Value`}
							inputValue={inputFromValue}
							inputOnchange={inputFromChangeHandle}
							type={inputType.number}
						/>
					</div>
					<div className="col-6 col-md-12">
						<Input
							selectedItem={toSelected}
							listItem={listItems}
							onChange={dropdownToChange}
							placeholder={`Input Value`}
							inputValue={inputToValue}
							inputOnchange={inputToChangeHandle}
							inputDisabled={true}
							type={inputType.string}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Fancy