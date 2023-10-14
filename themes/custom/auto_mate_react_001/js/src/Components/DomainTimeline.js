import React, { useState } from 'react';
import BlockTitle from '../UIElements/BlockTitle';
import BlockContent from '../UIElements/BlockContent';
import Checkbox from '@mui/material/Checkbox';
import PercentageMeter from '../UIElements/PercentageMeter';

// import './JSResources.css';

const oneWeek = 60580000;
const oneDay = 60580000;
const defaultTLConfig = {
        timeScale: 60580000,
        durationEffectsHeight: true,
        grid: {
                weekMarkers: true,
                dayMarkers: true,
                monthMarkers: true
        },
        gridElements: [
                {
                        startTime: 0,
                        duration: 1,
                        color: "#333",

                }, {
                        startTime: 0,
                        duration: 1,
                        color: "#333",

                }, {
                        startTime: 0,
                        duration: 1,
                        color: "#333",

                }

        ]

};

function Events() {
        const tlconfig = defaultTLConfig;
        return (<>
                <Timeline timeLineConfiguration={tlconfig} />
        </>);
}
function Event() {
        return (<h3>Event</h3>);
}

function Instances() {
        const tlconfig = defaultTLConfig;
        return (<>
                <Timeline timeLineConfiguration={tlconfig} />
        </>);
}
function Instance() {
        return (<h3>Instance</h3>);
}

function Timeline() {
        return (<><h2>Timeline</h2></>);

}
function DomainTimeline() {
        return (
                <>
                        <h1>DomainTimeline</h1>
                        <div class="timeline-container">
                                <Events />
                                <Instances />
                                {/*

                                markers
                                        mm:dd:yy date
                                        00:00:00 24 hr time

                                        grid labels
                                        grid lines

                                        x-axis
                                        y-axis

                                top grid

                                        <Events events={events}>
                                                sort by duration
                                                <Event start={startTime} duration={duration} eventType={eventType}/>
                                                



                                bottom grid

                                        <Instances LHRData={LHRData}>
                                                sort by duration        
                                                color determined by CPU that ran the tests. 
                                                duration determines vertical height of the range as well.  
                                                        larger durations make box bigger, and less opaque
                                                <Instance fetch_time={fetch_time} finish_timestamp={finish_timestamp} />
                                */}
                        </div>
                </>
        );
}

export default DomainTimeline;