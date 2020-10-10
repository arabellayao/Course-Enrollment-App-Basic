import React from 'react'
import { Button } from 'react-bootstrap';
import './App.css'
import Subsection from './Subsection.js'
import { Table } from 'react-bootstrap'

class Section extends React.Component {

	getSubsections() {
		let subsections = [];

		for (const subsection of Object.values(this.props.data.subsections)) {
			if (this.props.cartMode && !this.props.isInCart(this.props.course.number, this.props.data.number, subsection.number)) {
				// do not display subsection if we are in cart and the subsection is not in cart
				continue;
			}
			subsections.push(
				<Subsection key={subsection.number} data={subsection} course={this.props.course} section={this.props.data} addToCart={this.props.addToCart} removeFromCart={this.props.removeFromCart} isInCart={this.props.isInCart}/>
			)
		}
		
		return subsections;
	}

	getTimes() {
		var data = this.props.data; // for easy reference
		let times = []; // array of section times

		for (var key in data.time) {
			var time = data.time[key]
			times.push(
				<li key={key}>{key}: {time} </li>
			)
		}

		return times;
	}



	render() {
		var data = this.props.data; // for easy reference

		// default button: add section
		var button = <Button variant="success" onClick={() => this.props.addToCart(this.props.course, data, "All")}> Add Section </Button>
		// section is in cart: remove section
		if (this.props.isInCart(this.props.course.number, data.number)) {
		button = <Button variant="warning" onClick={() => this.props.removeFromCart(this.props.course.number, data.number)}> Remove Section </Button>
		}

		var subsections = this.getSubsections();
	
		return (
			<div>
				<h3>
					<li>{data.number} {button} </li>
				</h3>
				<ul>
					<li> Instructor: {data.instructor} </li>
					<li> Location: {data.location} </li>
					<li> Meeting Times </li>
					<ul>
						{this.getTimes()}
					</ul>
				</ul>
				{subsections.length !== 0 && 
				<h4>Subsection</h4>}
				{subsections.length !== 0 &&
				<Table striped hover>
				<thead>
					<tr>
						<th>#</th>
						<th>Location</th>
						<th>Meeting Times</th>
						<th>Cart</th>
					</tr>
				</thead>
				<tbody>{subsections}</tbody>
				</Table>}		
			</div>
		)
	}
}

export default Section;