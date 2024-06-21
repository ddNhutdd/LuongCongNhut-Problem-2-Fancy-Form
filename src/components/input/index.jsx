import React, { useEffect, useRef, useState } from 'react';
import css from './input.module.scss';
import { FaCaretDown } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const dropdownCalPos = (dropdownElement, setTop, setLeft, setWidth) => {
	const rect = dropdownElement.getBoundingClientRect();
	setTop(rect.top + rect.height + 1);
	setLeft(rect.left);
	setWidth(rect.width);
}

const classShowMenu = (state) => {
	return state ? css.show : ''
}

const renderListItem = (list, itemClickHandle) => {
	return list.map(item => {
		return (
			<div
				onClick={itemClickHandle.bind(null, item)}
				key={item.value}
				className={css.input__menuItem}
			>
				<img src={`./src/assets/imgs/${item?.label?.toUpperCase()}.svg`} alt="test" />
				{item.label}
			</div>
		)
	})
}

export const inputType = {
	string: 'string',
	number: 'number'
}

function Input(props) {
	const {
		selectedItem,
		listItem,
		onChange,
		placeholder,
		inputValue,
		inputOnchange,
		inputDisabled,
		type = inputType.string,
	} = props;

	const inputRef = useRef(null);
	const dropdownHeaderRef = useRef(null);

	const [menuTop, setMenuTop] = useState(0);
	const [menuLeft, setMenuLeft] = useState(0);
	const [menuWidth, setMenuWidth] = useState(0);
	const [showMenu, setShowMenu] = useState(false);

	const dropdownClickHandle = () => {
		setShowMenu(state => !state);
	}

	const menuItemClickHandle = (item) => {
		setShowMenu(false);
		onChange(item);
	}

	useEffect(() => {
		dropdownCalPos(dropdownHeaderRef.current, setMenuTop, setMenuLeft, setMenuWidth);
		window.addEventListener("resize", dropdownCalPos.bind(null, dropdownHeaderRef.current, setMenuTop, setMenuLeft, setMenuWidth));

		const closeMenu = (ev) => {
			if (dropdownHeaderRef?.current?.contains(ev.target)) {
				return
			}
			setShowMenu(false);
		}
		document.addEventListener('click', closeMenu);

		return () => {
			window.addEventListener("resize", dropdownCalPos);
			document.removeEventListener('click', closeMenu)
		}
	}, [])

	return (
		<div ref={inputRef} className={css.input}>
			<div
				onClick={dropdownClickHandle}
				ref={dropdownHeaderRef}
				className={css.input__dropdown}
			>
				<span className={css.input__header}>
					<img src={`./src/assets/imgs/${selectedItem?.label?.toUpperCase()}.svg`} alt="test" />
					{selectedItem?.label}
				</span>
				<span className={css.input__down}>
					<FaCaretDown />
				</span>
			</div>
			<div className={css.input__container}>
				<input
					type={type}
					value={inputValue}
					onChange={inputOnchange}
					placeholder={placeholder}
					disabled={inputDisabled}
				/>
			</div>
			{createPortal(
				<div
					style={{
						top: menuTop,
						left: menuLeft,
						width: menuWidth
					}}
					className={`${css.input__menu} ${classShowMenu(showMenu)}`}
				>
					{renderListItem(listItem, menuItemClickHandle)}
				</div>,
				document.getElementById("root")
			)}
		</div>
	)
}
Input.propTypes = {
	selectedItem: PropTypes.object,
	listItem: PropTypes.array,
	placeholder: PropTypes.string,
	inputValue: PropTypes.string,
	inputOnchange: PropTypes.func,
	onChange: PropTypes.func,
	inputDisabled: PropTypes.bool,
	type: PropTypes.oneOf(Object.values(inputType))
}
export default Input
