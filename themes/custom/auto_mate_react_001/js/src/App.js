import React, { useState, useEffect, useLocation } from 'react';
import axios from 'axios';
import PageDomain from './Pages/PageDomain';
import { useImmer } from 'use-immer'
import { func } from 'prop-types';

export default function App() {
    const path = location.pathname.split("/");
    console.log('path::',path);
    const nodeID = location.pathname.split("/").pop();

    const handleJSResource=function(URLData, LHRData, node, e) {
        const enable = e.target.checked;
        let enabledJSResourceNodes=[];
        if(enable==true) {
            if(uiState.activeJSResourceNodes.filter((uiActiveNode) => { uiActiveNode.name==node.name}).length==0) {
                enabledJSResourceNodes = uiState.activeJSResourceNodes.map((uiActiveNode)=>{ return uiActiveNode; });
                enabledJSResourceNodes.push(node);
            } 

        } else {
            enabledJSResourceNodes = uiState.activeJSResourceNodes.map((uiActiveNode)=>{ return uiActiveNode; });
            const index = enabledJSResourceNodes.filter((enUIActiveNode)=>{ enUIActiveNode.name==node.name});
            if (index > -1) {
                enabledJSResourceNodes.splice(index, 1);
            }
        }
        updateUIState(draft => {
            draft.activeJSResourceNodes=enabledJSResourceNodes;
        });
    }
    const handleJSResourcesSelectedURLs = function(urlID, e) {
        const enable = e.target.checked;
        let jsResourcesEnabledURLs=[];
        if(enable==true) {
            jsResourcesEnabledURLs = uiState.activeJSResourcesURLs.map((url)=>{ return url; });
            if(!jsResourcesEnabledURLs.includes(urlID)) { jsResourcesEnabledURLs.push(urlID); } 
        } else {
            jsResourcesEnabledURLs = uiState.activeJSResourcesURLs.map((url)=>{ return url; });
            const index = jsResourcesEnabledURLs.indexOf(urlID);
            if (index > -1) {
                jsResourcesEnabledURLs.splice(index, 1);
            }
        }
        updateUIState(draft => {
            draft.activeJSResourcesURLs=jsResourcesEnabledURLs;
        });
    
        if(jsResourcesEnabledURLs.length>0) {
            updateUIState(draft => {
                draft.sidebar = true;
            });
        } else {
            updateUIState(draft => {
                draft.sidebar = false;
            });
        }
    }

    const handleURLData=function(urlData) {
        console.log('urlData', urlData);
        updateGlobalState(draft => {
            draft.urlData=urlData;
        })
    }
    const handleLHRData=function(LHRData) {
        console.log('LHRData:', LHRData);
        // LHRData.forEach(function(lhr){
        //     console.log('*********lhr', lhr);
        //     console.log('*********lhr.field_script_treemap_data',lhr.field_script_treemap_data.replaceAll('&quot;', '"'));
        //     console.log('*********lhr.field_script_treemap_data parsed', JSON.parse(lhr.field_script_treemap_data.replaceAll('&quot;', '"')).nodes);
        // });
        const parsedLHRData = LHRData.map((lhr)=>{
            const scriptTreemapData = JSON.parse(lhr.field_script_treemap_data.replaceAll('&quot;', '"')).nodes;
            lhr.field_script_treemap_data=scriptTreemapData;
            return lhr;
        });
        // console.log('parsedLHRData:', parsedLHRData);
        updateGlobalState(draft => {
            draft.LHRData=parsedLHRData;
        })
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
            data_type: 'jsresources',
            changeFunction: handleJSResourcesSelectedURLs,
        }, {
            title: 'CSS Resources',
            filter_exposed: true,
            enabled: false,
            data_type: 'checkbox'
        }, {
            title: 'Font Resources',
            filter_exposed: true,
            enabled: false,
            data_type: 'checkbox'
        }, {
            title: 'Image Resources',
            filter_exposed: true,
            enabled: false,
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
            enabled: false,
            data_type: 'meter',
            parameter: 'field_fcp_average'
        }, {
            title: 'First Meaningful Paint',
            filter_exposed: true,
            enabled: false,
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
    const activeJSResourceNodes = [];
    const [uiState, updateUIState] = useImmer({
        'dashboardDataTypes': dashboardDataTypes,
        'activeJSResourcesURLs': activeJSResourcesURLs,
        'activeJSResourceNodes': activeJSResourceNodes,
        'sidebar': false
    })
    const [mainClasses, updateMainClasses] = useImmer({
        'main-content': true,
        'side-bar-open': (uiState.sidebar) && true
    });

    function handleResourcesChange(resourceIndex, checkedValue) {
        updateUIState(draft => {
            draft.dashboardDataTypes[resourceIndex].enabled=checkedValue;
        });
    }
    const [GlobalState, updateGlobalState] = useImmer({
        nodeID: nodeID,
        urlData: [],
        LHRData: [],
        mainClasses, updateMainClasses
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
     const rando = Math.random();
    return <><PageDomain mainClasses={mainClasses} GlobalState={GlobalState} updateGlobalState={updateGlobalState} uiState={uiState} handleResourcesChange={handleResourcesChange} handleJSResourcesSelectedURLs={handleJSResourcesSelectedURLs} handleJSResource={handleJSResource}/></>
}

