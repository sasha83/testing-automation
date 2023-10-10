import React, { useState, useEffect, useLocation } from 'react';
import axios from 'axios';
import PageDomain from './Pages/PageDomain';
import { useImmer } from 'use-immer'
import { func } from 'prop-types';

export default function App() {

    const nodeID = location.pathname.split("/").pop();


    const handleURLData=function(urlData) {
        updateGlobalState(draft => {
            draft.urlData=urlData;
        })
    }
    const handleLHRData=function(LHRData) {
        updateGlobalState(draft => {
            draft.LHRData=LHRData;
        })
    }
    const handleJSResourcesSelectedURLs = function(urlID) {
        // console.log('uiState:',uiState);
        // console.log('uiState.activeJSResourcesURLs:',uiState.activeJSResourcesURLs, urlID);
        let jsResourcesEnabledURLs = [1234,2345,3456];
        console.log('jsResourcesEnabledURLs.includes(urlID)',jsResourcesEnabledURLs.includes(urlID), urlID);
        if(!jsResourcesEnabledURLs.includes(urlID)) {
            jsResourcesEnabledURLs.push(urlID);
        } 
        console.log('jsResourcesEnabledURLs:',jsResourcesEnabledURLs);
        updateUIState(draft => {
            console.log('draft:',draft);
            draft.activeJSResourcesURLs=[777,777,777];
        });
        console.log('uiState:', uiState);
    }



    const dashboardDataTypes = [
        {
            title: 'Active',
            filter_exposed: false,
            enabled: true,
            data_type: 'other'
        },
        {
            title: 'URL',
            filter_exposed: false,
            enabled: true,
            data_type: 'other'
        }, {
            title: 'JavaScript Resources',
            filter_exposed: true,
            enabled: true,
            data_type: 'checkbox',
            changeFunction: handleJSResourcesSelectedURLs,
        }, {
            title: 'CSS Resources',
            filter_exposed: true,
            enabled: false,
            data_type: 'checkbox'
        }, {
            title: 'Font Resources',
            filter_exposed: true,
            enabled: true,
            data_type: 'checkbox'
        }, {
            title: 'Image Resources',
            filter_exposed: true,
            enabled: true,
            data_type: 'checkbox'
        }, {
            title: 'Lighthouse Reports',
            filter_exposed: true,
            enabled: true,
            data_type: 'lighthouse_list'
        }, {
            title: 'Cumulative Layout Shift',
            filter_exposed: true,
            enabled: true,
            data_type: 'meter',
            parameter: 'field_cls_average'
        }, {
            title: 'First Contentful Paint',
            filter_exposed: true,
            enabled: true,
            data_type: 'meter',
            parameter: 'field_fcp_average'
        }, {
            title: 'First Meaningful Paint',
            filter_exposed: true,
            enabled: true,
            data_type: 'meter',
            parameter: 'field_fmp_average'
        }, {
            title: 'Largest Contentful Paint',
            filter_exposed: true,
            enabled: true,
            data_type: 'meter',
            parameter: 'field_lcp_average'
        }, {
            title: 'Total Blocking Time',
            filter_exposed: true,
            enabled: true,
            data_type: 'meter',
            parameter: 'field_tbt_average'
        }
    ];
    const activeJSResourcesURLs = [];
    const [urlData, setURLData] = useState(null);
    const [LHRData, setLHRData] = useState(null);
    const [uiState, updateUIState] = useImmer({
        'dashboardDataTypes': dashboardDataTypes,
        'activeJSResourcesURLs': activeJSResourcesURLs
    })

    // const [uiState, updateUIState] = useImmer(dashboardDataTypes)


    function handleResourcesChange(resourceIndex, checkedValue) {
        updateUIState(draft => {
            console.log('uiState.dashboardDataTypes:',uiState.dashboardDataTypes);
            draft.dashboardDataTypes[resourceIndex].enabled=checkedValue;
        });
    }
    const [GlobalState, updateGlobalState] = useImmer({
        nodeID: nodeID,
        urlData: [],
        LHRData: []
    });


    React.useEffect(() => {
        axios
        .get("http://automate.ddev.site/domain-urls-rest?domain_id="+parseInt(nodeID))
        .then(data => handleURLData(data.data))
        .catch(error => console.log(error));
     }, []);
     React.useEffect(() => {
        axios
        .get("http://automate.ddev.site/domain-lhrs-rest?domain_id="+parseInt(nodeID))
        .then(data => handleLHRData(data.data))
        .catch(error => console.log(error));
     }, []);
    //  let urlDataTemp = [];
    //  let lhrDataTemp = [];
     const rando = Math.random();
    //  console.log('GlobalState:', GlobalState);
    return <><PageDomain GlobalState={GlobalState} updateGlobalState={updateGlobalState} uiState={uiState} handleResourcesChange={handleResourcesChange} handleJSResourcesSelectedURLs={handleJSResourcesSelectedURLs}/></>
}

