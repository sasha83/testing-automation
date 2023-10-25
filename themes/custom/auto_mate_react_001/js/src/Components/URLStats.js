import React, { useState, useEffect, useLocation } from 'react';
import ViewFilters from './URLStatsComponents/ViewFilters';
import BlockTitle from '../UIElements/BlockTitle';
import BlockContent from '../UIElements/BlockContent';
import PercentageMeter from '../UIElements/PercentageMeter';
import LighthouseReportsListing from './URLStatsComponents/LighthouseReportsListing';
import Checkbox from '@mui/material/Checkbox';
import './URLStats.css';


import { func } from 'prop-types';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function URLStats(props) {
    const GlobalState = props["GlobalState"];
    const urlData = GlobalState.urlData;
    const LHRData = GlobalState.LHRData;
    const updateGlobalState = props["updateGlobalState"];
    const uiState = props["uiState"];
    const activeJSResourcesURLs = uiState.activeJSResourcesURLs;
    const activeJSResourceNodes = uiState.activeJSResourceNodes;
    const handleResourcesChange = props["handleResourcesChange"];
    const handleJSResourcesSelectedURLs = props["handleJSResourcesSelectedURLs"];
    const handleJSResource = props["handleJSResource"];

    if (GlobalState.urlData && Array.isArray(GlobalState.urlData) && GlobalState.urlData.length > 0) {
        let urlListUpdated = [];
        const urlList = GlobalState.urlData.map((url, urlIndex) => {
            const dataColumns = uiState.dashboardDataTypes.map((dataType, uiStateIndex) => {
                if (dataType.enabled == true) {
                    if (dataType.data_type == 'other') {
                        // return (<td><p>other here</p></td>);
                    } else if (dataType.data_type == 'jsresources') {
                        return (<td key={uiStateIndex}><Checkbox onChange={e => { handleJSResourcesSelectedURLs(parseInt(url.nid), e) }} /></td>);
                    // } else if (dataType.data_type == 'lighthouse_list') {
                    //     return (<td key={uiStateIndex}><LighthouseReportsListing lighthouse-reports={url.lhrData} GlobalState={GlobalState} /></td>);
                    } else if (dataType.data_type == 'meter') {
                        return (<td key={uiStateIndex}>{url[dataType.parameter]}<PercentageMeter value={url[dataType.parameter]} outer-width="90%" /></td>);
                    } else {
                        return <td key={uiStateIndex}></td>;
                    }
                }
            });

            urlListUpdated.push(url);
            // getURLScriptData(LHRData, url.nid, activeScript);
            const urlResourceListing = activeJSResourceNodes.map((node, index) => {
                const mostRecentLHR = LHRData.filter((lhr) => lhr.field_url_reference_1 == url.nid);
                const foundInScriptTreemapData = mostRecentLHR[0].field_script_treemap_data.filter((script) => script.name == node.name);
                if (foundInScriptTreemapData[0] != undefined && foundInScriptTreemapData[0].name != undefined) {
                    const unusedBytes = foundInScriptTreemapData[0].unusedBytes;
                    const totalBytes = foundInScriptTreemapData[0].resourceBytes;
                    const usedBytes = foundInScriptTreemapData[0].resourceBytes - unusedBytes;
                    const usedPerc = usedBytes / totalBytes * 100;
                    return <tr key={index}><td className='url-js-resource-name'>{foundInScriptTreemapData[0].name}</td><td className='url-js-resource-usage'><PercentageMeter value={usedBytes / totalBytes} outer-width="100%" /><span className='meter-label'>{numberWithCommas(usedBytes)} of {numberWithCommas(totalBytes)} used</span></td></tr>;
                }

                // if(LHRData.filter((lhr) => {lhr.field_url_reference_1==url.nid && lhr.field_script_treemap_data.))

                // return <tr key={urlID}><td>{urlID}</td></tr>;
            });
            return (
                <tr
                    className="views-field views-field-title"
                    key={urlIndex}>
                    <td><Checkbox /></td>
                    <td className='views-field views-field-title'>
                        <a href={url.view_node}>{url.title}</a>

                        <table className='url-js-resources'>
                            <tbody>
                                {urlResourceListing}
                            </tbody>
                        </table>
                    </td>
                    {dataColumns}
                </tr>);

        });

        const th = uiState.dashboardDataTypes.map((dataType, index) => {
            if (dataType.enabled == true) return <th key={index}>{dataType.title}</th>
        });

        return (
            <div className="block block-url-stats-block">
                <BlockTitle title="URL Stats" />
                <BlockContent
                    blockName="url-stats"
                    content={
                        <>
                            <ViewFilters handleResourcesChange={handleResourcesChange} GlobalState={GlobalState} updateGlobalState={updateGlobalState} uiState={uiState} />
                            <div className="view-content">
                                <table className="views-table views-view-table cols-8">
                                    <thead>
                                        <tr>{th}</tr>
                                    </thead>
                                    <tbody>
                                        {urlList}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    }
                />
            </div>);
    }
}

export default URLStats;