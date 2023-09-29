import React, { useState, useEffect, useLocation } from 'react';
import axios from 'axios';
import PageDomain from './Pages/PageDomain';

export default function App() {
    const [urlData, setURLData] = useState(null);
    const nodeID = location.pathname.split("/").pop();
    React.useEffect(() => {
        axios
        .get("http://automate.ddev.site/domain-urls-rest?domain_id="+parseInt(nodeID))
        .then(data => setURLData(data.data))
        .catch(error => console.log(error));
     }, []);
    
     return <><PageDomain url-data={urlData}/></>
}