import React, { useState } from 'react';
import BlockTitle from '../UIElements/BlockTitle';
import BlockContent from '../UIElements/BlockContent';
import Checkbox from '@mui/material/Checkbox';
import PercentageMeter from '../UIElements/PercentageMeter';
import './DomainTimeline.css';
// import './JSResources.css';

const oneWeek = 60580000;
const oneDay = 60580000/7;
const oneHour = 60*60;
const defaultTLConfig = {
        timeScale: oneWeek,
        durationEffectsHeight: true,
        grid: {
                weekMarkers: true,
                dayMarkers: true,
                monthMarkers: true,
                halfDayMarkers: true,
                quarterDayMarkers: true,
                eighthDayMarkers: true,
        },
        timelineElements: [
                {
                        startTime: oneDay,
                        duration: -3*oneDay,
                        color: "#333",
                }, {
                        startTime: 0,
                        duration: -2*oneDay,
                        color: "#333",

                }, {
                        startTime: 0,
                        duration: -5*oneDay,
                        color: "#333",

                }, {
                        startTime: 0,
                        duration: -5*oneHour,
                        color: "#333",
                }

        ]

};






function Timeline(props) {
        const tlconfig = props['timeLineConfiguration'];
        const timelineElements = tlconfig.timelineElements;
        return (<>
                <TimelineGrid/>
                <TimelineElements/>
        </>);
}
function TimelineElements() {
        return (<><h4>Timeline Elements</h4></>);
}
function TimelineElement() {
        return (<><h4>Timeline Element</h4></>);
}
function TimelineGrid() {
        return (<><h4>Timeline Grid</h4></>);
}



function Events() {
        const tlconfig = defaultTLConfig;
        return (<>
                <Timeline timeLineConfiguration={tlconfig} />
        </>);
}
 
function Instances() {
        const tlconfig = defaultTLConfig;
        return (<>
                <Timeline timeLineConfiguration={tlconfig} />
        </>);
}
 


function DomainTimeline() {
        return (
                <>
                        <h1>DomainTimeline</h1>
                        <div className="timeline-container">
                                <Events />
                                <Instances />
                        </div>
                </>
        );
}

export default DomainTimeline;