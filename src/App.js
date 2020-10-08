import React from 'react';
import './App.css';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: {},
      filteredCourses: {},
      subjects: [],
      cartCourses: {} // representation of course
      // format: {course.number: {section.number: [subsections]}}
    };

    // scope of callback functions is within App.js
    this.isInCart = this.isInCart.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
  }


  // have 3 parameters for all cart methods: course, section, subsection

  /*
  course: course.number
  section: section.number (undefined for course button)
  subsection: subsection. number (undefined for section button)
  This method determines whether a button is "Add" or "Remove"
  */
  isInCart(course, section, subsection) {
    if (! (course in this.state.cartCourses)) {
      return false;
    }
    else if (!section) { 
      // course button is "Add" if course is in cart
      return true;
    }
    else if (! (section in this.state.cartCourses[course])) {
      return false;
    }
    else if (!subsection) {
      // section button is "Add" if section is in cart
      return true;
    }
    else if (! (this.state.cartCourses[course][section].includes(subsection))) {
      return false;
    }
    else {
      return true;
    }

    
  }


  /*
  course_info: complete course info
  section_info: complete section info ("All" for course button)
  subsection_info: complete subsection info ("All for subsection button")
  This method adds three variations to cart: 1) a course + all sections + subsections; 2) a course + a section + all subsections; 3) a course + a section + a subsection
  */
  addToCart(course_info, section_info, subsection_info) {
    // cart {course: {section: [subsection]}}
    // cart["PSYCH202"] = {};
    // cart["PSYCH202"]["LEC001"] = []
    // cart["PSYCH202"]["LEC001"].push("Subsection")

    // console.log(course_info, section_info, subsection_info);
    // console.log(this.state.allCourses);

    // local variable for easy reference
    var cart_temp = this.state.cartCourses;

    if (!(course_info.number in cart_temp)) { 
      // course not in cart, create a key-value pair
      cart_temp[course_info.number] = {};
    }


    if (section_info === "All") { // course button
      for (const section of course_info.sections) {
        cart_temp[course_info.number][section.number] = []; 
        for (const subsection of section.subsections) {
          cart_temp[course_info.number][section.number].push(subsection.number);
        }
      }
    }
    else if (subsection_info === "All") { // section button
      cart_temp[course_info.number][section_info.number] = [];
      for (const subsection of section_info.subsections) {
        cart_temp[course_info.number][section_info.number].push(subsection.number);
      }
    }
    else { // subsection button
      if (!(section_info.number in cart_temp[course_info.number])) { // section not added, add section
        cart_temp[course_info.number][section_info.number] = [];
      }
      cart_temp[course_info.number][section_info.number].push(subsection_info.number);
    }

    this.setState({cartCourses: cart_temp});
  }

  removeFromCart(course, section, subsection) {
    // cart["PSYCH202"]["LEC001"].remove("Subsection")
    // delete cart["PSYCH202"]["LEC001"]
    // delete cart["PSYCH202"]
    // also remove parents if zero is left

    // create a local variable
    var cart_temp = this.state.cartCourses;

    if (!section) { // remove the whole course
      delete cart_temp[course];
    }
    else if (!subsection) { // remove the whole section
      delete cart_temp[course][section];
      if (!Object.keys(cart_temp[course]).length) {
        delete cart_temp[course];
      }
    }
    else { // delete a subsection
      let index = cart_temp[course][section].indexOf(subsection);
      cart_temp[course][section].splice(index, 1);

      if (!cart_temp[course][section].length) {
        delete cart_temp[course][section];
      }

      if (!Object.keys(cart_temp[course]).length) {
        delete cart_temp[course];
      }
    }

    this.setState({cartCourses: cart_temp});
  }

  componentDidMount() {
    fetch('http://mysqlcs639.cs.wisc.edu:53706/api/react/classes').then(
      res => res.json()
    ).then(data => this.setState({allCourses: data, filteredCourses: data, subjects: this.getSubjects(data)}));
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(const course of Object.values(data)) {
      if(subjects.indexOf(course.subject) === -1)
        subjects.push(course.subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }

  render() {

    // convert cartCourses representation to actual information
    var full_cart = [];

    for (const course of Object.values(this.state.allCourses)) {
      if (course.number in this.state.cartCourses) {
        // pass the info of cartCourses to Cart tab
        full_cart.push(course);
      }
    }

    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />



        <Tabs defaultActiveKey="search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          <Tab eventKey="search" title="Search" style={{paddingTop: '5vh'}}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects}/>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.state.filteredCourses} allData={this.state.allCourses} addToCart={this.addToCart} removeFromCart={this.removeFromCart}isInCart={this.isInCart} cartMode={false} />
          </div>
          </Tab>

          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '5vw'}}>
              <CourseArea data={full_cart} addToCart={this.addToCart} removeFromCart={this.removeFromCart} isInCart={this.isInCart} cartMode={true}/>
            </div>
          </Tab>
        </Tabs> 
      </>
    )
  }
}

export default App;
