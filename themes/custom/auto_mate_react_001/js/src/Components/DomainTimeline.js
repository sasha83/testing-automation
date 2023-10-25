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
        elementAlignment: 'bottom',
        showLabels: true,
        // These don't do anything yet. just an idea.
        grid: {
                weekMarkers: true,
                dayMarkers: true,
                monthMarkers: true,
                halfDayMarkers: true,
                quarterDayMarkers: true,
                eighthDayMarkers: true,
        }

};

const defaultTLConfigB = {
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





function Instances(props) {
        const GlobalState=props["GlobalState"];
        console.log('INSTANCES GlobalState:', GlobalState);
        let tlconfig = defaultTLConfigB;
        if(GlobalState.sortedInstances) {
                let timelineElements = GlobalState.sortedInstances.map((instance) => {
                        // console.log('instance start:', new Date(instance[instance.length-1].field_fetch_time).getTime());
                        return {
                                "actionID": instance[instance.length-1].field_instance_id,
                                "actionFunction": GlobalState.handleActiveInstance,
                                "startTime": new Date(instance[instance.length-1].field_fetch_time).getTime(),
                                "duration": oneHour,
                                "color": '#0F0'
                        };
                });
                // console.log("timelineElements from instances:", timelineElements);
                tlconfig.timelineElements = timelineElements;
                return (<>
                        <Timeline timeScale={oneWeek*13} timeLineConfiguration={tlconfig} />
                </>);
        
        }
}

function Timeline(props) {
        const timeScale = props["timeScale"];
        const tlconfig = props['timeLineConfiguration'];
        const grid = tlconfig.grid;
        const timelineElements = tlconfig.timelineElements;
        const elementAlignment = tlconfig.elementAlignment;
        const now = new Date();
        const lastMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        console.log("tlconfig:",tlconfig);
        return (<div className={classNames(['timeline', 'align-'+elementAlignment])}>
                <TimelineGrid timeScale={timeScale} grid={grid} tlconfig={tlconfig}/>
                <TimelineElements elementAlignment={elementAlignment} timelineElements={timelineElements} timeScale={timeScale}/>
        </div>);
}
function TimelineElements(props) {
        const timeScale = props["timeScale"];
        const timelineElements = props["timelineElements"];
        const now = new Date();
        const nowMS = now.getTime();
        const tlconfig=props["tlconfig"];
        const elements = timelineElements.map((timelineElement, ind)=> {
                const startTimePerc = ((nowMS-timelineElement.startTime)/timeScale)*100+"%";
                // const widthPerc = Math.ceil(((timelineElement.duration)/timeScale)*100)+"%";
                const widthPerc = (((timelineElement.duration)/timeScale)*100)+"%";
                const elementColor = timelineElement.color;
                return (<TimelineElement actionID={timelineElement.actionID} key={ind} x={startTimePerc} w={widthPerc} elementColor={elementColor} actionFunction={timelineElement.actionFunction}/>);
        });
        return (<div className="timeline-elements-container"><div className="timeline-elements">{elements}</div></div>);

}
function TimelineElement(props) {
        const timeScale = props["timeScale"];
        const xCalc = props["x"];
        const width = props["w"];
        const elementColor = props["elementColor"];
        const tlconfig=props["tlconfig"];
        console.log("props.actionFunction:", props.actionFunction);
        const style = {
                width: width,
                right: xCalc,
                backgroundColor: elementColor
        }
        if(props.actionFunction) {
                return (<div className="timeline-element" data-action-id={props.actionID} onClick={()=>{props.actionFunction(props.actionID)}} style={style}>
                        <div className='timeline-element-brackets'>{props.actionID}</div>
                </div>);
        } else {
                return (<div className="timeline-element" data-action-id={props.actionID} style={style}>
                        <div className='timeline-element-brackets'>{props.actionID}</div>
                </div>);
        }
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
        for(let n=0;n<=timeScale;n+=oneDay) {
                const nPerc = n/timeScale*100;
                const theDay = new Date(lastMidnight-n);
                lines.push({
                        day: theDay,
                        dayOfWeek: theDay.getDay(),
                        agoPerc: (n+timeSinceMidnight)/timeScale*100,
                })
        }
        const gridLines = lines.map((line, index) => {
                return (<GridLine key={index} x={line.agoPerc+"%"} gridLineStyle={gridLineStyle} label={line.dayOfWeek} date={line.day} showLabels={showLabels}/>);
        });
        return (<>{gridLines}</>);
}
function GridLine(props) {
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const weekdayShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        const showLabels = props["showLabels"];
        const theDate = props['date'];
        const date = theDate.getDate();


        const showDay = (theDate.getDay()==1) ? true:false;

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

        let label = "";
        if(date==1) label+=month[theDate.getMonth()]+", ";
        label+=JSON.stringify(date);
        if(showDay==true) label+=" ("+weekday[theDate.getDay()].toString()+")";


        return (<div className='grid-line' style={gridLineStyle}>
                {/* {(showLabels==true) && <span class="grid-line-label">{weekday[label]}</span>} */}
                {(showLabels==true) && <span className="grid-line-label">
                        {label}
                </span>}
        </div>);
}


function groupBy(objectArray, property) {
        return objectArray.reduce((acc, obj) => {
                const key = obj[property];
                if (!acc[key]) {
                   acc[key] = [];
                }
                // Add object to list for given key's value
                acc[key].push(obj);
                return acc;
        }, {});
}          
 
function Events(props) {
        const GlobalState=props["GlobalState"];
        let tlconfig = defaultTLConfig;
        if(GlobalState.eventData) {
                const timelineElements = GlobalState.eventData.map((event)=>{
                        return {
                                "actionID": event.nid,
                                "actionFunction": null,
                                "startTime": event.field_event_timestamp*1000,
                                "duration": 60*60*1000,
                                "color": "#00F"
                        };
                });

                tlconfig.timelineElements=timelineElements;
                return (<>
                        <Timeline timeScale={oneWeek*13} timeLineConfiguration={tlconfig} />
                </>);
        
        }
}
 



function DomainTimeline(props) {
        const GlobalState = props['GlobalState'];
        return (
                <>
                        <div className="timeline-container">
                                <Events GlobalState={GlobalState}/>
                                <Instances GlobalState={GlobalState}/>
                        </div>
                </>
        );
}

export default DomainTimeline;