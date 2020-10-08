import React from 'react';
import { Button } from 'react-bootstrap';
import './App.css';
import Section from './Section'

class Course extends React.Component {
  getSections() {
    let sections = [];

    for (const section of Object.values(this.props.data.sections)) {
      if (!this.props.isInCart(this.props.data.number, section.number) && this.props.cartMode) {
        // do not display a section if it is not in cart and we are in cart mode
        continue;
      }
      sections.push (
        <Section key={section.number} course={this.props.data} data={section} addToCart={this.props.addToCart} removeFromCart={this.props.removeFromCart} isInCart={this.props.isInCart} cartMode={this.props.cartMode}/>
      )
    }

    return sections;
  }

  render() {
    var data = this.props.data; // for easy reference

    // keywords
    var length = data.keywords.length;
    var keywords = "Keywords: ";
    for (var i = 0; i < length; i++) {
      if (i === length - 1) {
        keywords += data.keywords[i]
      }
      else {
        keywords += data.keywords[i] + ", ";
      }
    }

    // requisites
    length = data.requisites.length;
    var requisites = "Requisites: ";
    if (length === 0) {
      requisites += "None";
    }
    else {
      for (i = 0; i < length; i++) {
        
        var one_req = "(";
        for (var j = 0; j < data.requisites[i].length; j++) {
          one_req += data.requisites[i][j];
          if (j !== data.requisites[i].length - 1) {
            one_req += " OR "
          }
        }
        one_req += ")"

        requisites += one_req;
        if (i !== data.requisites.length - 1) {
          requisites += " AND "
        }
      }
    }
    
    // default button: Add to cart
    var button = <Button onClick={() => this.props.addToCart(data, "All", "All")}> Add Course </Button>
    // course is in cart, change button to remove course
    if (this.props.isInCart(data.number)) {
      button = <Button variant="warning" onClick={() => this.props.removeFromCart(data.number)}> Remove Course </Button>
    }

    return (
      <div>
        <h2>
          ({data.number}) {data.name} | {data.credits} credits  
          {button}
        </h2>
        <h3>Subject: {data.subject}</h3>
        <p>{data.description}</p>
        <p>{requisites}</p>
        <p>{keywords}</p>
        <h2>Sections:</h2>
        {this.getSections()}
      </div>
    )
  }
}

export default Course;
