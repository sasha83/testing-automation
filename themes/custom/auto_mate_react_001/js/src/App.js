import React, { useState, useEffect, useLocation } from 'react';
import axios from 'axios';
import PageDomain from './Pages/PageDomain';
import PageURL from './Pages/PageURL';

import { useImmer } from 'use-immer'
import { func } from 'prop-types';
import $ from 'jquery';

function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        // Add object to list for given key's value
        acc[key].push(obj);
        return acc;
    }, {});
}


export default function App() {
    const path = location.pathname.split("/");
    const nodeID = location.pathname.split("/").pop();

    const nodeType = path[path.length - 2];

    const handleJSResource = function (URLData, LHRData, node, e) {
        const enable = e.target.checked;
        let enabledJSResourceNodes = [];
        if (enable == true) {
            if (uiState.activeJSResourceNodes.filter((uiActiveNode) => { uiActiveNode.name == node.name }).length == 0) {
                enabledJSResourceNodes = uiState.activeJSResourceNodes.map((uiActiveNode) => { return uiActiveNode; });
                enabledJSResourceNodes.push(node);
            }

        } else {
            enabledJSResourceNodes = uiState.activeJSResourceNodes.map((uiActiveNode) => { return uiActiveNode; });
            const index = enabledJSResourceNodes.filter((enUIActiveNode) => { enUIActiveNode.name == node.name });
            if (index > -1) {
                enabledJSResourceNodes.splice(index, 1);
            }
        }
        updateUIState(draft => {
            draft.activeJSResourceNodes = enabledJSResourceNodes;
        });
    }
    const handleJSResourcesSelectedURLs = function (urlID, e) {
        const enable = e.target.checked;
        let jsResourcesEnabledURLs = [];
        if (enable == true) {
            jsResourcesEnabledURLs = uiState.activeJSResourcesURLs.map((url) => { return url; });
            if (!jsResourcesEnabledURLs.includes(urlID)) { jsResourcesEnabledURLs.push(urlID); }
        } else {
            jsResourcesEnabledURLs = uiState.activeJSResourcesURLs.map((url) => { return url; });
            const index = jsResourcesEnabledURLs.indexOf(urlID);
            if (index > -1) {
                jsResourcesEnabledURLs.splice(index, 1);
            }
        }
        updateUIState(draft => {
            draft.activeJSResourcesURLs = jsResourcesEnabledURLs;
        });

        if (jsResourcesEnabledURLs.length > 0) {
            updateUIState(draft => {
                draft.sidebar = true;
            });
        } else {
            updateUIState(draft => {
                draft.sidebar = false;
            });
        }
    }

    const handleURLData = function (urlData) {

        updateGlobalState(draft => {
            draft.urlData = urlData;
        })
    }
    const handleLHRData = function (LHRData) {

        // parse JSON field data stored as strings.
        const parsedLHRData = LHRData.map((lhr) => {
            const scriptTreemapData = JSON.parse(lhr.field_script_treemap_data.replaceAll('&quot;', '"')).nodes;
            lhr.field_script_treemap_data = scriptTreemapData;
            return lhr;
        });

        updateGlobalState(draft => {
            draft.LHRData = parsedLHRData;
        })


        // set up global state instances array
        function compareFetchTime(a, b) {
            if (a['field_fetch_time'] < b['field_fetch_time']) {
                return 1;
            }
            if (a['field_fetch_time'] > b['field_fetch_time']) {
                return -1;
            }
            return 0;
        }
        let instances = groupBy(LHRData, 'field_instance_id');






        // this is kind of a mess.  setting this up for the timeline component.
        let sortedInstances = [];
        instances = Object.entries(instances);


        instances.forEach(function (instance) {
            sortedInstances.push(instance[1].sort(compareFetchTime));
        });

        updateGlobalState(draft => {
            draft.sortedInstances = sortedInstances;
        })






    }

    const handleEventData = function (eventData) {

        const parsedEventData = eventData.map((event) => {
            return event;
        });
        updateGlobalState(draft => {
            draft.eventData = parsedEventData;
            $('.timeline-container').animate({ 'scrollLeft': '100000%' }, 100);
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
            // }, {
            //     title: 'Lighthouse Reports',
            //     filter_exposed: true,
            //     enabled: true,
            //     data_type: 'lighthouse_list'
        }, {
            title: 'Cumulative Layout Shift',
            filter_exposed: true,
            enabled: true,
            data_type: 'meter',
            parameter: 'field_cls_average',
            lhr_parameter: 'field_cumulative_layout_shift'
        }, {
            title: 'First Contentful Paint',
            filter_exposed: true,
            enabled: false,
            data_type: 'meter',
            parameter: 'field_fcp_average',
            lhr_parameter: 'field_first_contentful_paint',
        }, {
            title: 'First Meaningful Paint',
            filter_exposed: true,
            enabled: false,
            data_type: 'meter',
            parameter: 'field_fmp_average',
            lhr_parameter: 'field_first_meaningful_paint'
        }, {
            title: 'Largest Contentful Paint',
            filter_exposed: true,
            enabled: true,
            data_type: 'meter',
            parameter: 'field_lcp_average',
            lhr_parameter: 'field_largest_contentful_paint'
        }, {
            title: 'Total Blocking Time',
            filter_exposed: true,
            enabled: true,
            data_type: 'meter',
            parameter: 'field_tbt_average',
            lhr_parameter: 'field_total_blocking_time'
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
    function handleActiveInstance(instanceID) {
        updateUIState(draft => {
            draft.activeInstance = instanceID;
        });
    }
    function handleResourcesChange(resourceIndex, checkedValue) {
        updateUIState(draft => {
            draft.dashboardDataTypes[resourceIndex].enabled = checkedValue;
        });
    }
    const [GlobalState, updateGlobalState] = useImmer({
        nodeID: nodeID,
        urlData: [],
        LHRData: [],
        mainClasses, updateMainClasses,
        handleActiveInstance: handleActiveInstance,
    });


    React.useEffect(() => {
        axios
            .get("http://automate.ddev.site/domain-urls-rest?domain_id=" + parseInt(nodeID))
            .then(data => handleURLData(data.data))
            .catch(error => console.log(error));
    }, []);
    React.useEffect(() => {
        axios
            .get("http://automate.ddev.site/domain-lhrs-rest?domain_id=" + parseInt(nodeID))
            .then(data => handleLHRData(data.data))
            .catch(error => console.log(error));
    }, []);
    React.useEffect(() => {
        axios
            .get("http://automate.ddev.site/events-rest")
            .then(data => handleEventData(data.data))
            .catch(error => console.log(error));
    }, []);

    const rando = Math.random();
    if (nodeType == 'domain') {
        return <><PageDomain mainClasses={mainClasses} GlobalState={GlobalState} updateGlobalState={updateGlobalState} uiState={uiState} handleResourcesChange={handleResourcesChange} handleJSResourcesSelectedURLs={handleJSResourcesSelectedURLs} handleJSResource={handleJSResource} /></>;
    } else if (nodeType == 'url') {
        return <><PageURL uiState={uiState} /></>;
    }

}

