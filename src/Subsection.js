import React from 'react'
import './App.css'
import { Button } from 'react-bootstrap';

class Subsection extends React.Component {

	getTimes() {
		let times = [];
		var data = this.props.data; // for easy reference

		for (var key in data.time) {
			let time = data.time[key];
			times.push(
				<li key={key}>{key}: {time}</li>
			)
		}

		return times;
	}

	

	render() {
		var data = this.props.data; // for easy reference

		// default button: add to cart
		var button = <Button variant="success" onClick={() => this.props.addToCart(this.props.course, this.props.section, data)}> Add Subsection </Button>
		// if subsection is in cart: remove from cart
		if (this.props.isInCart(this.props.course.number, this.props.section.number, data.number)) {
		button = <Button variant="warning" onClick={() => this.props.removeFromCart(this.props.course.number, this.props.section.number, data.number)}> Remove Subsection </Button>
		}

		return (
			<>
				<tr>
					<td>{data.number}</td>
					<td>{data.location}</td>
					<td>{this.getTimes()}</td>
					<td>{button}</td>
				</tr>
			</>
		)
	}
}

export default Subsection;