import React from 'react';
import './main.scss';
import Button from 'react-bootstrap/Button';
import { Row, Navbar, Container, Col, ListGroup, Form } from 'react-bootstrap';
import Calendar from './components/calendar';
import Events from './components/events';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);
    // Fix timezone bug
    this.state = {
      date: new Date(new Date().toLocaleDateString()),
      events: localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [],
      today: [],
      loadEvent: {},
      show: false
    };
  }
  componentDidMount() {
    this.getEvents(moment(new Date()).format('YYYY-MM-DD'));
  }
  getTime = date => {
    return moment(date).format("hh:mm");
  }
  getDate = date => {
    return moment(date).format("YYYY-MM-DD");
  }
  saveStateToLocalStorage = () => {
    localStorage.setItem('events', JSON.stringify(this.state.events));
  }

  // updates the state with the new event and make a copy of state to local storage for persistent data usage
  addEvent = (event) => {
    event.id = uuidv4();
    this.setState(({ events }) => ({
      events: [...events, event]
    }), () => {
      this.saveStateToLocalStorage();
    })
    this.getEvents(moment(new Date()).format('YYYY-MM-DD'));
  }
  deleteEvent = (event) => {
    const newEvents = this.state.events.filter(e => e.id !== event.id);
    this.setState({
      events: newEvents
    }, () => {
      this.saveStateToLocalStorage();
    })
  }
  updateEvent = (event) => {
    const eventId = this.state.loadEvent.id
    //removes the old event from the state
    event.id = eventId;
    this.deleteEvent(event);
    //keep the previous Id and add the event
    this.addEvent(event);
  }

  //adds the prev
  prepareEventUpdate = event => {
    // filter the event that is being clicked by using it's id
    const currentEvent = this.state.events.filter(e => e.id === event.id)[0];

    currentEvent.startTime = this.getTime(currentEvent.start);
    currentEvent.start = this.getDate(currentEvent.start);

    currentEvent.endTime = this.getTime(currentEvent.end);
    currentEvent.end = this.getDate(currentEvent.end);

    this.setState({
      loadEvent: currentEvent,
      show: true
    })
  }
  getEvents = date => {
    const events = [];
    this.state.events.forEach(event => {
      if ((moment(event.start).isBefore(date) && moment(event.end).isAfter(date)) || moment(event.start, 'YYYY-MM-DD').isSame(date)) {
        let start = event.start.slice(11, 16);
        if (start === "") {
          start = 'All Day'
        }
        events.push({ title: event.title, start });
      }
    })
    // sort events in order according to the time of the day ASC
    this.setState({
      today: events.sort((a, b) => a.start > b.start)
    })
  }
  changeDate = (date) => {
    this.setState({
      date: new Date(date + 'T00:00:00'),
      show: false
    })
    this.getEvents(date);
  }
  handleShow = () => {
    this.setState({
      show: true
    })
  }
  handleClose = () => {
    this.setState({
      loadEvent: {},
      show: false
    }, () => {
      this.getEvents(moment(this.state.date).format('YYYY-MM-DD'));
    })
  }
  render() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return (
      <>
        <Container fluid>
          <Row>
            <Col md={12}>
              <Navbar expand="lg" variant="light" bg="light">
                <Container>
                  <Navbar.Brand href="#"><h1>Calendar App</h1></Navbar.Brand>
                </Container>
              </Navbar>
            </Col>
          </Row>
          <Row className="main-row">
            <Col xs={12} sm={12} md={8} lg={9} xl={6}>
              <Calendar changeDate={this.changeDate} updateEvent={this.prepareEventUpdate} events={this.state.events} />
            </Col>
            <Col className="events-container" md={4} lg={3}>
              <div className="events-header">
                <h2>{days[this.state.date.getDay()]}</h2>
                <h1>{months[this.state.date.getMonth()]} {this.state.date.getDate()}</h1>
              </div>
              <ListGroup className="events-list" >
                {this.state.today.length ? this.state.today.map((event, i) => <ListGroup.Item key={i}>
                  <b>{event.start} </b> - {event.title}
                </ListGroup.Item>)
                  : 
                  <Form.Group className="mb-3">
                    <Form.Label>Appointments</Form.Label>
                    <Form.Control type="text" placeholder="Enter appointments" />
                  </Form.Group>
                }
              </ListGroup>
              <Button className="add-btn" onClick={this.handleShow}>Add</Button>
              <Events deleteEvent={this.deleteEvent} updateEvent={this.updateEvent} event={this.state.loadEvent} show={this.state.show} handleClose={this.handleClose} addEvent={this.addEvent} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default App;