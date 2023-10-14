import React, { useState, useEffect, useLocation } from 'react';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';

function LighthouseReportsListing(props) {
    // console.log(props);
    const GlobalState=props["GlobalState"];
    const handleClick = props["handleClick"];
    // console.log(handleClick);
    const LHRData = props["lighthouse-reports"];
    if(LHRData&&LHRData!=undefined&&LHRData.length>0) {
        const lhrListings = LHRData.map((lhreport, index) => {
            return <tr key={index}><td><button onClick={handleClick}>test</button><Checkbox checked={lhreport.enabledUI}/></td><td>{lhreport.field_instance_id}</td><td>{lhreport.field_fetch_time}</td></tr>;
        });
        return <table className="lighthouse-reports-listing"><tbody>{lhrListings}</tbody></table>;    
    } else {
        return <div></div>;
    }
}

export default LighthouseReportsListing;    