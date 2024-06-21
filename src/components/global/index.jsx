import React from "react"
import PropTypes from 'prop-types'
import './global.scss'

function Global(props) {
	const { children } = props;
	return (
		<>
			{children}
		</>
	)
}
Global.propTypes = {
	children: PropTypes.node
}
export default Global