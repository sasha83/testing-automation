import React, { useState, useEffect, useLocation } from 'react';
import axios from 'axios';
import PageDomain from './Pages/PageDomain';

export default function App() {

    const nodeID = location.pathname.split("/").pop();


    // const getFullLHRList(GlobalState) {
    //     const {setLHRData} = props["GlobalState"];
    //     React.useEffect(() => {
    //         axios
    //         .get("http://automate.ddev.site/domain-urls-rest?domain_id="+parseInt(nodeID))
    //         .then(data => setLHRData(data.data))
    //         .catch(error => console.log(error));
    //      }, []);
    // }
    // const updateURLJSData(urlID) {

    //     // get the lhrs of this url, 
    //     // see if they're checked/enabled, 
    //     //     see if the data is there for the checked/enabled ones,
    //     //         request data from 'lhr-data-js-resources/?lhr_id="LHRID"' if not


    //     React.useEffect(() => {
    //         axios
    //         .get("http://automate.ddev.site/lhr-data-js-resources/?lhr_id="LHRID")
    //         .then(data => setLHRData(data.data))
    //         .catch(error => console.log(error));
    //     }, []);
    //     console.log("urlData:", urlData);

    // }




    const columnsInit = {
        'JSResources': true,
        'CSSResources': false,
        'FontResources': false,
        'ImageResources': false,
        'lhr': true,
        'cls': true,
        'fcp': false,
        'fmp': false,
        'lcp': true,
        'tbt': true,

    }
    const [urlData, setURLData] = useState(null);
    const [LHRData, setLHRData] = useState(null);
    const [uiState, setUIState] = useState({
        'columns': columnsInit
    })
    const GlobalState = {
        nodeID, urlData, setURLData,
        LHRData, setLHRData,
        uiState, setUIState,
    };
    React.useEffect(() => {
        axios
        .get("http://automate.ddev.site/domain-urls-rest?domain_id="+parseInt(nodeID))
        .then(data => setURLData(data.data))
        .catch(error => console.log(error));
     }, []);
     React.useEffect(() => {
        axios
        .get("http://automate.ddev.site/domain-lhrs-rest?domain_id="+parseInt(nodeID))
        .then(data => setLHRData(data.data))
        .catch(error => console.log(error));
     }, []);
     let urlDataTemp = [];
     let lhrDataTemp = [];
     const rando = Math.random();
    //  console.log('rando:', rando);
    //  console.log('(rando<=.5)',(rando<=.5));
     if(LHRData && LHRData!=undefined && LHRData.length>0 && urlData && urlData!=undefined && urlData.length>0) {

        // find selected/active Lighthouse Reports within URLs
        urlData.forEach((url) => {
            if(url.lhrData==undefined) {
                url.lhrData=[];
            }
            let lhrindex = 0;
            LHRData.forEach((lhr) => {
                if(lhr.field_url_reference_1==url.nid) {
                    lhr.enabledUI = (Math.random()<=.5),
                    url.lhrData.push(lhr);
                }
                lhrindex++;
            });
            urlDataTemp.push(url);
        });
        setURLData(urlDataTemp);
        setLHRData([]);
    }
    return <><PageDomain GlobalState={GlobalState}/></>
}

