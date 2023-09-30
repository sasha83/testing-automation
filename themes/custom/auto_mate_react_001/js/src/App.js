import React, { useState, useEffect, useLocation } from 'react';
import axios from 'axios';
import PageDomain from './Pages/PageDomain';

export default function App() {
    const [urlData, setURLData] = useState(null);
    const [LHRData, setLHRData] = useState(null);
    const GlobalState = {
        urlData, setURLData,
        LHRData, setLHRData
    };

    const nodeID = location.pathname.split("/").pop();
    React.useEffect(() => {
        axios
        .get("http://automate.ddev.site/domain-urls-rest?domain_id="+parseInt(nodeID))
        .then(data => setURLData(data.data))
        .catch(error => console.log(error));
     }, []);
     console.log("urlData:", urlData);
     return <><PageDomain url-data={urlData} lhr-data={LHRData} set-url-data={setURLData} set-lhr-data={LHRData} GlobalState={GlobalState}/></>
}