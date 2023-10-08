import React, { useState, useEffect, useLocation } from 'react';
import axios from 'axios';
import PageDomain from './Pages/PageDomain';
import { useImmer } from 'use-immer'
import { func } from 'prop-types';

export default function App() {

    const nodeID = location.pathname.split("/").pop();




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
            title: 'URL',
            filter_exposed: true,
            enabled: true,
        }, {
            title: 'JavaScript Resources',
            filter_exposed: true,
            enabled: true,
        }, {
            title: 'CSS Resources',
            filter_exposed: true,
            enabled: false,
        }, {
            title: 'Font Resources',
            filter_exposed: true,
            enabled: true,
        }, {
            title: 'Image Resources',
            filter_exposed: true,
            enabled: true,
        }, {
            title: 'Lighthouse Reports',
            filter_exposed: true,
            enabled: true,
        }, {
            title: 'Cumulative Layout Shift',
            filter_exposed: true,
            enabled: true,
        }, {
            title: 'First Contentful Paint',
            filter_exposed: true,
            enabled: true,
        }, {
            title: 'First Meaningful Paint',
            filter_exposed: true,
            enabled: true,
        }, {
            title: 'Largest Contentful Paint',
            filter_exposed: true,
            enabled: true,
        }, {
            title: 'Total Blocking Time',
            filter_exposed: true,
            enabled: true,
        }
    ];
    const [urlData, setURLData] = useState(null);
    const [LHRData, setLHRData] = useState(null);
    // const [uiState, setUIState] = useState({
    //     'columns': columnsInit,
    //     'dashboardDataTypes': dashboardDataTypes
    // })

    const [uiState, updateUIState] = useImmer(dashboardDataTypes)


    const handleResourcesChange = function(resourceIndex, checkedValue, GlobalState, updateGlobalState) {
        // console.log();
        console.log('pre GlobalState:', GlobalState, resourceIndex, checkedValue);
        if(GlobalState.uiState.dashboardDataTypes[resourceIndex].enabled) {
            updateGlobalState(draft => {
                draft.uiState.dashboardDataTypes[resourceIndex].enabled=checkedValue;
            });
        }
        console.log('post GlobalState:', GlobalState);
    }
    const [GlobalState, updateGlobalState] = useImmer({
        nodeID: nodeID,
        urlData: [],
        uiState: {
            dashboardDataTypes: dashboardDataTypes
        },
        LHRData: [],
        updateUIState: updateUIState,
    });

    const handleURLData=function(urlData, GlobalState) {
        updateGlobalState(draft => {
            draft.urlData=urlData;
        })
        // console.log(GlobalState);
    }
    const handleLHRData=function(LHRData, GlobalState) {
        updateGlobalState(draft => {
            draft.LHRData=LHRData;
        })
    }
    // const handleUIState=function(uiState, GlobalState) {
    //     updateGlobalState(draft => {
    //         draft.uiState=uiState;
    //     })
    // };
//         nodeID, urlData, setURLData,
//         LHRData, setLHRData,
//         uiState, updateUIState,
// // 
    React.useEffect(() => {
        axios
        .get("http://automate.ddev.site/domain-urls-rest?domain_id="+parseInt(nodeID))
        .then(data => handleURLData(data.data, GlobalState))
        .catch(error => console.log(error));
     }, []);
     React.useEffect(() => {
        axios
        .get("http://automate.ddev.site/domain-lhrs-rest?domain_id="+parseInt(nodeID))
        .then(data => handleLHRData(data.data, GlobalState))
        .catch(error => console.log(error));
     }, []);
     let urlDataTemp = [];
     let lhrDataTemp = [];
     const rando = Math.random();
    //  console.log('GlobalState:', GlobalState);
    return <><PageDomain handleResourcesChange={handleResourcesChange} GlobalState={GlobalState} updateGlobalState={updateGlobalState}/></>
}

