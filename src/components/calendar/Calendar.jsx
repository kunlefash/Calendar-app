import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import './calendar.scss';

import React, { Component } from 'react'
import PropTypes from 'prop-types'
/* A class component that is using the props that are passed in from the parent component. */

class Calendar extends Component {
    static propTypes = {
        props: PropTypes.object
    }
    calendarComponentRef = React.createRef();

    handleDateClick = (arg) => {
        //Get all the events for the date that was clicked
        this.props.changeDate(arg.dateStr);
    }
    
    render() {
        return (
            <div className="calendar-container">
                <FullCalendar
                    dateClick={this.handleDateClick}
                    //get the event that is about to be updated
                    eventClick={({ event }) => this.props.updateEvent(event)}
                    defaultView="dayGridMonth"
                    ref={this.calendarComponentRef}
                    header={{
                        left: 'prev',
                        center: 'title',
                        right: 'today , next'
                    }}
                    
                    slotLabelFormat={
                        {
                            hour: '2-digit',
                            minute: '2-digit',
                            omitZeroMinute: false,
                            meridiem: 'narrow',
                            hour12: true
                        }
                    }
                    // Setting the time format for the calendar.
                    // timeFormat='h:mm'
                    plugins={[dayGridPlugin, interactionPlugin]}
                    events={this.props.events != null ? this.props.events : ""}
                    eventTimeFormat={{
                        hour: '2-digit', //2-digit, numeric
                        minute: '2-digit', //2-digit, numeric
                        omitZeroMinute: true,
                        meridiem: 'narrow',
                        // second: '0-digit', //2-digit, numeric
                        // meridiem: false, //lowercase, short, narrow, false (display of AM/PM)
                        hour12: false //true, false
                    }}
                />
            </div>
        )
    }
}
export default Calendar;