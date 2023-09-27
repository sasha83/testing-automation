import React, { useState, useEffect, useLocation } from 'react';
import axios from 'axios';
import './App.css';
import URLStats from './Components/URLStats';
import JSResources from './Components/JSResources';

export default function App() {
    const [urlData, setURLData] = useState(null);
    // const location = useLocation();
    // const [pathName, setPathName] = useState(null) ;
    
    // useEffect(() => {
    //     if(location) {
    //         let tmp = location.pathName.slice(location.pathName.lastIndexOf("/") , location.pathName.length) ;
    //         setPathName(tmp) ;
    //     }
    // }, [location])
    // console.log("pathName: ", location.pathname.split("/").pop());
    const nodeID = location.pathname.split("/").pop();
    React.useEffect(() => {
        axios
        .get("http://automate.ddev.site/domain-urls-rest?domain_id="+parseInt(nodeID))
        .then(data => setURLData(data.data))
        .catch(error => console.log(error));
     }, []);
     return <><URLStats url-data={urlData}/><JSResources url-data={urlData}/></>
}