import React, { useState, useEffect, useLocation } from 'react';
import ViewFilters from './URLStatsComponents/ViewFilters';
import BlockTitle from '../UIElements/BlockTitle';
import BlockContent from '../UIElements/BlockContent';
import PercentageMeter from '../UIElements/PercentageMeter';
import LighthouseReportsListing from './URLStatsComponents/LighthouseReportsListing';
import Timeline from './URLStatsComponents/Timeline';
import Checkbox from '@mui/material/Checkbox';


import { func } from 'prop-types';


function URLStats(props) {
    const GlobalState = props["GlobalState"];
    const urlData=GlobalState.urlData;
    const LHRData=GlobalState.LHRData;
    const updateGlobalState = props["updateGlobalState"];
    const uiState=props["uiState"];
    const activeJSResourcesURLs=uiState.activeJSResourcesURLs;
    const activeJSResourceNodes=uiState.activeJSResourceNodes;
    const handleResourcesChange=props["handleResourcesChange"];
    const handleJSResourcesSelectedURLs=props["handleJSResourcesSelectedURLs"];
    const handleJSResource=props["handleJSResource"];

    if(GlobalState.urlData&&Array.isArray(GlobalState.urlData)&&GlobalState.urlData.length>0) {
        let urlListUpdated = [];
        const urlList = GlobalState.urlData.map((url, urlIndex) => {
            const dataColumns = uiState.dashboardDataTypes.map((dataType, uiStateIndex) => {
                if(dataType.enabled==true) {
                    if(dataType.data_type=='other') {
                        // return (<td><p>other here</p></td>);
                    } else if(dataType.data_type=='jsresources') {
                        return(<td><Checkbox onChange={e => {handleJSResourcesSelectedURLs(parseInt(url.nid), e)}}/></td>);
                    } else if(dataType.data_type=='lighthouse_list') {
                        return (<td><LighthouseReportsListing lighthouse-reports={url.lhrData} GlobalState={GlobalState}/></td>);
                    } else if(dataType.data_type=='meter') {
                        return(<td>{url[dataType.parameter]}<PercentageMeter value={url[dataType.parameter]} outer-width="90%"/></td>);
                    } else {
                        return <td></td>;
                    }
                }
            });

            urlListUpdated.push(url);
            // getURLScriptData(LHRData, url.nid, activeScript);
            const urlResourceListing = activeJSResourceNodes.map((node, index) => {
                const mostRecentLHR = LHRData.filter((lhr) => lhr.field_url_reference_1 == url.nid);

                const foundInScriptTreemapData = mostRecentLHR[0].field_script_treemap_data.filter((script) => script.name==node.name);
                // console.log('node:', node);
                // console.log('mostRecentLHR:', mostRecentLHR[0]);
                // console.log('foundInScriptTreemapData:', foundInScriptTreemapData);
                if(foundInScriptTreemapData[0].name) {
                    return <tr><td>{foundInScriptTreemapData[0].name}</td><td>unusedBytes: {foundInScriptTreemapData[0].unusedBytes}</td><td>totalBytes: {foundInScriptTreemapData[0].resourceBytes}</td></tr>;
                }

                // if(LHRData.filter((lhr) => {lhr.field_url_reference_1==url.nid && lhr.field_script_treemap_data.))

                // return <tr key={urlID}><td>{urlID}</td></tr>;
            });
            console.log('url:', url);
            console.log('urlResourceListing:', urlResourceListing);
            return (
                <tr 
                    className="views-field views-field-title"
                    key={urlIndex}>
                        <td><Checkbox/></td>
                        <td className='views-field views-field-title'>
                            <a href={url.view_node}>{url.title}</a>
                            
                            <table className='url-js-resources'>
                                <tbody>
                                    {
                                        // each URL
                                        // needs to see if any of the selected JS Resources
                                            // are in the script treemap data of the latest LHR 
                                            // that has a url reference value of the current URL ID.
                                    }

                                    {urlResourceListing}
                                </tbody>
                            </table>
                        </td>

                         {dataColumns}
                        {/* {uiState.columns.JSResources==true && (<td><Checkbox checked={url.JSResources.enabled}/></td>)}
                        {uiState.columns.CSSResources==true && (<td><Checkbox checked={url.CSSResources.enabled} onChange={GlobalState.handleResourcesChange}/></td>)}
                        {uiState.columns.FontResources==true && (<td><Checkbox checked={url.FontResources.enabled} onChange={function(){url.FontResources.enabled=!url.FontResources.enabled;}}/></td>)}
                        {uiState.columns.ImageResources==true && (<td><Checkbox checked={url.ImageResources.enabled} onChange={function(){url.ImageResources.enabled=!url.ImageResources.enabled;}}/></td>)}
                        {uiState.columns.lhr==true && (<td><LighthouseReportsListing handleClick={handleClick} lighthouse-reports={url.lhrData} GlobalState={GlobalState}/></td>)}
                        {uiState.columns.cls==true && (<td>{url.field_cls_average}<PercentageMeter value={url.field_cls_average} outer-width="90%"/></td>)}
                        {uiState.columns.fcp==true && (<td>{url.field_fcp_average}<PercentageMeter value={url.field_fcp_average} outer-width="90%"/></td>)}
                        {uiState.columns.fmp==true && (<td>{url.field_fmp_average}<PercentageMeter value={url.field_fmp_average} outer-width="90%"/></td>)}
                        {uiState.columns.lcp==true && (<td>{url.field_lcp_average}<PercentageMeter value={url.field_lcp_average} outer-width="90%"/></td>)}
                        {uiState.columns.tbt==true && (<td>{url.field_tbt_average}<PercentageMeter value={url.field_tbt_average} outer-width="90%"/></td>)} */}
                </tr>);

        });

        const th = uiState.dashboardDataTypes.map((dataType, index) => {
            if(dataType.enabled==true) return <th key={index}>{dataType.title}</th>});

        return (
            <div className="block block-url-stats-block">
                <BlockTitle title="URL Stats"/>
                <BlockContent
                    blockName="url-stats"
                    content={
                        <>
                            <Timeline GlobalState={GlobalState}/>
                            <ViewFilters handleResourcesChange={handleResourcesChange} GlobalState={GlobalState} updateGlobalState={updateGlobalState} uiState={uiState}/>
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