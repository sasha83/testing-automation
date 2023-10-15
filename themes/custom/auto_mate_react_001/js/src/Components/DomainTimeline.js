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
        elementAlignment: 'top',
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
                        startTime: -1*oneDay,
                        duration: 60*5,
                        color: "#333",
                }, {
                        startTime: -3*oneDay,
                        duration: 60*60,
                        color: "#333",

                }, {
                        startTime: -5*oneDay,
                        duration: oneDay,
                        color: "#333",

                }, {
                        startTime: -2*oneHour,
                        duration: 60,
                        color: "#333",
                }

        ]

};

const defaultTLConfigB = {
        timeScale: oneWeek,
        durationEffectsHeight: true,
        elementAlignment: 'bottom',
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
                        startTime: -3*oneDay,
                        duration: 60,
                        color: "#333",
                }, {
                        startTime: -12*oneHour,
                        duration: 2*oneHour,
                        color: "#333",

                }, {
                        startTime: -5*oneDay,
                        duration: .5*oneHour,
                        color: "#333",

                }, {
                        startTime: -5*oneHour,
                        duration: 60*4,
                        color: "#333",
                }

        ]

};






function Timeline(props) {
        const timeScale = props["timeScale"];
        const tlconfig = props['timeLineConfiguration'];
        const grid = tlconfig.grid;
        const timelineElements = tlconfig.timelineElements;
        const elementAlignment = tlconfig.elementAlignment;
        const now = new Date();
        const lastMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        console.log("now:", now, now.getTime());
        console.log("lastMidnight:", lastMidnight, lastMidnight.getTime());


        return (<>
                <TimelineGrid timeScale={timeScale} grid={grid}/>
                <TimelineElements elementAlignment={elementAlignment} timelineElements={timelineElements}/>
        </>);
}
function TimelineElements(props) {
        return (<><h4>Timeline Elements</h4></>);
}
function TimelineElement(props) {
        return (<><h4>Timeline Element</h4></>);
}
function TimelineGrid(props) {
        const grid = props['grid'];
        const timeScale=props["timeScale"];
        console.log('TimelineGrid grid', grid);
        console.log('timeScale:', timeScale);
        const gridLineStyle = {
                border: "10px solid red",

        }

        return (<div className='timeline-grid-container'>
                <div className='timeline-grid'>
                        <GridLines gridLineStyle={gridLineStyle}/>
                </div>
        </div>);
}
function GridLines(props) {
        const gridLineStyle = props["gridLineStyle"];
        return (<GridLine/>);
}
function GridLine(props) {
        const gridLineStyle = props["gridLineStyle"];
        const x = props["x"];
        return (<div className='grid-line' style={gridLineStyle}>
                Hello world
        </div>);
}



function Events() {
        const tlconfig = defaultTLConfigB;
        return (<>
                <Timeline timeScale={oneWeek} timeLineConfiguration={tlconfig} />
        </>);
}
 
function Instances() {
        const tlconfig = defaultTLConfig;
        return (<>
                <Timeline timeScale={oneWeek} timeLineConfiguration={tlconfig} />
        </>);
}
 



function DomainTimeline(props) {
        const GlobalState = props['GlobalState'];
        return (
                <>
                        <h1>DomainTimeline</h1>
                        <div className="timeline-container">
                                <Events GlobalState={GlobalState}/>
                                <Instances GlobalState={GlobalState}/>
                        </div>
                </>
        );
}

export default DomainTimeline;