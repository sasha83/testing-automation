import React, { useState } from 'react';
import BlockTitle from '../UIElements/BlockTitle';
import BlockContent from '../UIElements/BlockContent';
import Checkbox from '@mui/material/Checkbox';
import PercentageMeter from '../UIElements/PercentageMeter';
import './DomainTimeline.css';
// import './JSResources.css';

const oneWeek = 60*60*1000*24*7;
const oneDay = 60*60*24*1000;
const oneHour = 60*60*1000;
const oneMinute = 60*1000;
const defaultTLConfig = {
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
        return (<><TimelineElement x={-1*oneDay}/></>);
}
function TimelineElement(props) {
        const xCalc = props["x"];
        // return (<><h4>Timeline Element</h4></>);
}
function TimelineGrid(props) {
        const grid = props['grid'];
        const timeScale=props["timeScale"];
        
        console.log('TimelineGrid grid', grid);
        console.log('timeScale:', timeScale);
        const gridLineStyle = {
                backgroundColor: "#333",
                height: "100%",
                width: "1px",
        }

        return (<div className='timeline-grid-container'>
                <div className='timeline-grid'>
                        <GridLines timeScale={timeScale} gridLineStyle={gridLineStyle} grid={grid}/>
                </div>
        </div>);
}
function GridLines(props) {
        const timeScale = props["timeScale"];
        const gridLineStyle = props["gridLineStyle"];
        const grid = props['grid'];
        const nowMS = new Date().getTime();
        const now = new Date(nowMS);
        let lines = [];
        const lastMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
        const timeSinceMidnight = nowMS-lastMidnight;
        console.log('Gridlines timeScale:', timeScale);
        console.log("GridLines nowMS:", nowMS);
        console.log("GridLines now:", now);
        console.log("GridLines lastMidnight:", lastMidnight);
        console.log("GridLines timeSinceMidnight:", timeSinceMidnight);
        for(let n=0;n<=timeScale;n+=oneDay) {
                const nPerc = n/timeScale*100;
                const theDay = new Date(lastMidnight-n);
                lines.push({
                        day: theDay,
                        agoPerc: (n+timeSinceMidnight)/timeScale*100
                })
                console.log("GridLines n:", n);
                console.log("GridLines nPerc:", nPerc);
        }
        console.log(lines);
        const gridLines = lines.map((line) => {
                return (<GridLine x={line.agoPerc+"%"} gridLineStyle={gridLineStyle}/>);
        });
        return (<>{gridLines}</>);
}
function GridLine(props) {
        // console.log('gridLineStyle:', gridLineStyle);
        // gridLineStyle.right = props["x"];
        const gridLineStyle = {
                position: 'absolute',
                backgroundColor: "#333",
                height: "100%",
                width: "1px",
                right: props["x"]
        };                
        return (<div className='grid-line' style={gridLineStyle}>
                line
        </div>);
}



function Events() {
        const tlconfig = defaultTLConfigB;
        return (<>
                <Timeline timeScale={oneWeek*1.5} timeLineConfiguration={tlconfig} />
        </>);
}
 
function Instances() {
        const tlconfig = defaultTLConfig;
        return (<>
                <Timeline timeScale={oneWeek*1.5} timeLineConfiguration={tlconfig} />
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