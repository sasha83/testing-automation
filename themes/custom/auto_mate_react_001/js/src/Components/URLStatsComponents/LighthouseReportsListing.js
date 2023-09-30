import React, { useState, useEffect, useLocation } from 'react';
import axios from 'axios';

function LighthouseReportsListing(props) {
    const GlobalState = props['GlobalState'];
    const urlID = props['url-nid'];

    React.useEffect(() => {
        axios
        .get("http://automate.ddev.site/url-lighthouse-reports-rest?url_id="+urlID)
        .then(data => GlobalState.setLHRData(data.data))
        .catch(error => console.log(error));
     }, []);
    if(GlobalState.LHRData&&GlobalState.LHRData!=undefined&&GlobalState.LHRData.length>0) {
        const lhrListings = GlobalState.LHRData.map((lhreport, index) => {
            return <tr key={index}><td>{lhreport.field_instance_id}</td><td>{lhreport.field_fetch_time}</td></tr>;
        });
        return <table className="lighthouse-reports-listing"><tbody>{lhrListings}</tbody></table>;    
    } else {
        return <div></div>;
    }
}

export default LighthouseReportsListing;