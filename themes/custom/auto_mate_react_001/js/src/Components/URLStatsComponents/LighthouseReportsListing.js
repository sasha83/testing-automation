import React, { useState, useEffect, useLocation } from 'react';
import axios from 'axios';

function LighthouseReportsListing(props) {

    const urlID = props['url-nid'];
    const LHRData = props["lhr-data"];
    const setLHRData = props["set-lhr-data"];
    React.useEffect(() => {
        axios
        .get("http://automate.ddev.site/url-lighthouse-reports-rest?url_id="+urlID)
        .then(data => setLHRData(data.data))
        .catch(error => console.log(error));
     }, []);
    // console.log(LHRData);
    if(LHRData&&LHRData!=undefined&&LHRData.length>0) {
        const lhrListings = LHRData.map((lhreport, index) => {
            return <tr key={index}><td>{lhreport.field_instance_id}</td><td>{lhreport.field_fetch_time}</td></tr>;
        });
        return <table className="lighthouse-reports-listing"><tbody>{lhrListings}</tbody></table>;    
    } else {
        return <div></div>;
    }
}

export default LighthouseReportsListing;