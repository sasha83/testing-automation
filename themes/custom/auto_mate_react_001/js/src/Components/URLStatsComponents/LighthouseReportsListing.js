import React, { useState, useEffect, useLocation } from 'react';
import axios from 'axios';

function LighthouseReportsListing(props) {
    const [LHRData, setLHRData] = useState(null);
    const urlID = props['url-nid'];
    React.useEffect(() => {
        axios
        .get("http://automate.ddev.site/url-lighthouse-reports-rest?url_id="+urlID)
        .then(data => setLHRData(data.data))
        .catch(error => console.log(error));
     }, []);
    // console.log(LHRData);
    if(LHRData&&LHRData!=undefined) {
        const lhrListings = LHRData.map((lhreport, index) => {
            return <tr key={index}><td>{lhreport.field_instance_id}</td><td>{lhreport.field_fetch_time}</td></tr>;
        });
        return <table className="lighthouse-reports-listing"><tbody>{lhrListings}</tbody></table>;    
    } else {
        return <div></div>;
    }
}

export default LighthouseReportsListing;