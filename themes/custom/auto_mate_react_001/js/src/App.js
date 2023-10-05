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
    const dashboardDataTypes = [
        {
            title: 'JavaScript Resources',
            enabled: true,
        }, {
            title: 'CSS Resources',
            enabled: false,
        }, {
            title: 'Font Resources',
            enabled: true,
        }, {
            title: 'Image Resources',
            enabled: true,
        }, {
            title: 'Lighthouse Reports',
            enabled: true,
        }, {
            title: 'Cumulative Layout Shift',
            enabled: true,
        }, {
            title: 'First Contentful Paint',
            enabled: true,
        }, {
            title: 'First Meaningful Paint',
            enabled: true,
        }, {
            title: 'Largest Contentful Paint',
            enabled: true,
        }, {
            title: 'Total Blocking Time',
            enabled: true,
        }
    ];
    const [urlData, setURLData] = useState(null);
    const [LHRData, setLHRData] = useState(null);
    const [testData, setTestData] = useState({});
    const [uiState, setUIState] = useState({
        'columns': columnsInit,
        'dashboardDataTypes': dashboardDataTypes
    })



    const handleClick = function(){
        GlobalState.setTestData({test: 123});
        console.log(GlobalState.testData);
    }
    const handleResourcesChange = function(resourceTitle, checkedValue) {
        console.log('resourceTitle: ', resourceTitle);
        console.log('uiState:', uiState);
        let uiStateTemp = uiState;
        // let uiState = GlobalState.uiState;
        uiStateTemp.dashboardDataTypes = GlobalState.uiState.dashboardDataTypes.map((dashboardDataType, index) => {
                console.log("dashboardDataType.enabled", dashboardDataType.enabled);
                if(dashboardDataType.title==resourceTitle) {
                    dashboardDataType.enabled=checkedValue;
                }
                return dashboardDataType;
            });

        GlobalState.setUIState(uiStateTemp);
        GlobalState.setURLData(urlData);
    

        // GlobalState.setUIState(uiState);
        // console.log('GlobalState.uiState:', GlobalState.uiState);
    }


    const GlobalState = {
        nodeID, urlData, setURLData,
        LHRData, setLHRData,
        uiState, setUIState,
        testData, setTestData,
        handleClick,
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
    return <><PageDomain handleResourcesChange={handleResourcesChange} GlobalState={GlobalState}/></>
}

