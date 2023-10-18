import React, { useState } from 'react';
import BlockTitle from '../UIElements/BlockTitle';
import BlockContent from '../UIElements/BlockContent';
import Checkbox from '@mui/material/Checkbox';
import PercentageMeter from '../UIElements/PercentageMeter';
import './DomainTimeline.css';
import classNames from 'classnames';
// import './JSResources.css';

const oneWeek = 604800000;
const oneDay = 60*60*24*1000;
const oneHour = 60*60*1000;
const oneMinute = 60*1000;
const tempExample = 1697626826857;
const defaultTLConfig = {
        durationEffectsHeight: true,
        elementAlignment: 'top',
        showLabels: false,
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
                        startTime: 1692626329857,
                        duration: 60*5*1000,
                        color: "#333",
                }, {
                        startTime: 1696626822857,
                        duration: 60*60*1000,
                        color: "#333",

                }, {
                        startTime: 1697426826851,
                        duration: oneDay,
                        color: "#333",

                }, {
                        startTime: 1697000000000,
                        duration: 1200000,
                        color: "#333",
                }

        ]

};

const defaultTLConfigB = {
        durationEffectsHeight: true,
        elementAlignment: 'bottom',
        showLabels: true,
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
                        startTime: 1697116826851,
                        duration: oneDay,
                        color: "#333",
                }, {
                        startTime: 1697626816859,
                        duration: 2*oneHour,
                        color: "#333",

                }, {
                        startTime: 1697626826852,
                        duration: .5*oneHour,
                        color: "#333",

                }, {
                        startTime: 1697626226857,
                        duration: 60*4*1000,
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
        console.log("******timelineElements******", timelineElements);
        return (<div className={classNames(['timeline', 'align-'+elementAlignment])}>
                <TimelineGrid timeScale={timeScale} grid={grid} tlconfig={tlconfig}/>
                <TimelineElements elementAlignment={elementAlignment} timelineElements={timelineElements} timeScale={timeScale}/>
        </div>);
}
function TimelineGrid(props) {
        const grid = props['grid'];
        const timeScale=props["timeScale"];
        const tlconfig=props["tlconfig"];
        // console.log('TimelineGrid grid', grid);
        // console.log('timeScale:', timeScale);

        return (<div className='timeline-grid-container'>
                <div className='timeline-grid'>
                        <GridLines timeScale={timeScale} grid={grid} tlconfig={tlconfig}/>
                </div>
        </div>);
}
function TimelineElements(props) {
        const timeScale = props["timeScale"];
        const timelineElements = props["timelineElements"];
        const now = new Date();
        const nowMS = now.getTime();
        console.log('timelineElements:',timelineElements);
        const elements = timelineElements.map((timelineElement)=> {
                const startTimePerc = ((nowMS-timelineElement.startTime)/timeScale)*100+"%";
                const widthPerc = Math.ceil(((timelineElement.duration)/timeScale)*100)+"%";
                const elementColor = "#00f";
                console.log("timelineElement.startTime:", timelineElement.startTime);
                console.log("Date(timelineElement.startTime):", new Date(timelineElement.startTime));
                console.log("timelineElement", timelineElement);
                console.log("timeScale", timeScale);
                console.log("startTimePerc", startTimePerc);
                console.log("widthPerc", widthPerc);

                return (<TimelineElement x={startTimePerc} w={widthPerc} elementColor={elementColor}/>);
        });
        return (<div className="timeline-elements-container"><div className="timeline-elements">{elements}</div></div>);

}
function TimelineElement(props) {
        const timeScale = props["timeScale"];
                const xCalc = props["x"];
                const width = props["w"];
                const elementColor = props["elementColor"];
                const style = {
                        width: width,
                        right: xCalc,
                        position: 'absolute',
                        backgroundColor: "#e00",
                        height: "3rem",
        
                }
                return (<div className="timeline-element" style={style}></div>);
        }
        
function GridLines(props) {
        const timeScale = props["timeScale"];
        const gridLineStyle = props["gridLineStyle"];
        const showLabels = props["tlconfig"].showLabels;
        const grid = props['grid'];
        const nowMS = new Date().getTime();
        const now = new Date(nowMS);
        let lines = [];
        const lastMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
        const timeSinceMidnight = nowMS-lastMidnight;
        // console.log('Gridlines timeScale:', timeScale);
        // console.log("GridLines nowMS:", nowMS);
        // console.log("GridLines now:", now);
        // console.log("GridLines lastMidnight:", lastMidnight);
        // console.log("GridLines timeSinceMidnight:", timeSinceMidnight);
        for(let n=0;n<=timeScale;n+=oneDay) {
                const nPerc = n/timeScale*100;
                const theDay = new Date(lastMidnight-n);
                lines.push({
                        day: theDay,
                        dayOfWeek: theDay.getDay(),
                        agoPerc: (n+timeSinceMidnight)/timeScale*100,
                })
                // console.log("GridLines n:", n);
                // console.log("GridLines nPerc:", nPerc);
        }
        // console.log('lines:', lines);
        const gridLines = lines.map((line, index) => {
                return (<GridLine key={index} x={line.agoPerc+"%"} gridLineStyle={gridLineStyle} label={line.dayOfWeek} date={line.day} showLabels={showLabels}/>);
        });
        return (<>{gridLines}</>);
}
function GridLine(props) {
        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const showLabels = props["showLabels"];
        const label = props['label'];
        const theDate = props['date'];
        const date = theDate.getDate();
        const gridLineStyle = {
                position: 'absolute',
                backgroundColor: "#eee",
                height: "100%",
                width: "4px",
                right: props["x"]
        };                






        // if timeScale is greater than 2 weeks
                // then don't show every day label
        // if timeScale is greater than 1 month
                // then don't show day lines
        // if timeScale is greater than 3 months
                // then show Monday lines with numbers




        return (<div className='grid-line' style={gridLineStyle}>
                {/* {(showLabels==true) && <span class="grid-line-label">{weekday[label]}</span>} */}
                {(showLabels==true) && <span class="grid-line-label">{JSON.stringify(date)}</span>}
        </div>);
}



function Events() {
        const tlconfig = defaultTLConfigB;
        return (<>
                <Timeline timeScale={oneWeek*6} timeLineConfiguration={tlconfig} />
        </>);
}
 
function Instances() {
        const tlconfig = defaultTLConfig;
        return (<>
                <Timeline timeScale={oneWeek*6} timeLineConfiguration={tlconfig} />
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