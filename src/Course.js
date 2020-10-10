import React from 'react';
import { Button } from 'react-bootstrap';
import './App.css';
import Section from './Section'
import { Modal } from 'react-bootstrap'
import { Container } from 'react-bootstrap'
import { Row } from 'react-bootstrap'
import { Col } from 'react-bootstrap'
import { Jumbotron } from 'react-bootstrap'


class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      // representation of course
      // format: {course.number: {section.number: [subsections]}}
    };
  }

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
    var button = <Button variant="success" size="lg" onClick={() => this.props.addToCart(data, "All", "All")}> Add Course </Button>
    // course is in cart, change button to remove course
    if (this.props.isInCart(data.number)) {
      button = <Button variant="warning" size="lg" onClick={() => this.props.removeFromCart(data.number)}> Remove Course </Button>
    }


    // design modal dialog
    const showSections = () => this.setState({show: true});
    const closeSections = () => this.setState({show: false});

    var section_button = <Button variant="primary" size="lg" onClick={() => showSections()}>See Sections</Button>
    var modal_dialog = 
      <Modal size="lg" show={this.state.show} onHide={() => closeSections()}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.data.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.getSections()}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => closeSections()}>Close</Button>
        </Modal.Footer>
    </Modal>
    

    return (
      <div>
        <Jumbotron fluid>
          <Container>
            <h2>
            <Container>
              <Row className="justify-content-md-center">
                <Col md="auto">({data.number})</Col>
                <Col md="auto">{data.name}</Col>
                <Col md="auto">{data.credits} credits</Col>
                <Col md="auto">{button}</Col>
              </Row>
            </Container>
            </h2>
            <h3>Subject: {data.subject}</h3>
            <p>Description: {data.description}</p>
            <p>{requisites}</p>
            <p>{keywords}</p>
            <center>{section_button}</center>
            {modal_dialog}
          </Container>
        </Jumbotron>
      </div>
    )
  }
}

export default Course;
