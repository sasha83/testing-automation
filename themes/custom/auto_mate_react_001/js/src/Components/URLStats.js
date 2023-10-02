import React, { useState, useEffect, useLocation } from 'react';
import ViewFilters from '../Components/ViewFilters';
import BlockTitle from '../UIElements/BlockTitle';
import BlockContent from '../UIElements/BlockContent';
import PercentageMeter from '../UIElements/PercentageMeter';
import LighthouseReportsListing from './URLStatsComponents/LighthouseReportsListing';
import Checkbox from '@mui/material/Checkbox';

import URLJSResources from './URLStatsComponents/URLJSResources';
import URLCSSResources from './URLStatsComponents/URLCSSResources';
import URLImageResources from './URLStatsComponents/URLImageResources';
import URLFontResources from './URLStatsComponents/URLFontResources';

import { func } from 'prop-types';


function URLStats(props) {
    const GlobalState = props["GlobalState"];

    const {urlData, lhrData, setURLData, setLHRData, uiState} = GlobalState;
    if(urlData&&Array.isArray(urlData)&&urlData.length>0) {
        let urlListUpdated = [];
        const urlList = urlData.map((url, index) => {
            url.test = url.nid;

            if(!url.JSResources) {
                url.JSResources={
                    enabled: false,
                }
            }
            if(!url.CSSResources) url.CSSResources={enabled: false}
            if(!url.FontResources) url.FontResources={enabled: false}
            if(!url.ImageResources) url.ImageResources={enabled: false}
            urlListUpdated.push(url);
            return (
                <tr 
                    className="views-field views-field-title"
                    key={index}>
                        <td><Checkbox/></td>
                        <td className='views-field views-field-title'>
                            <a href={url.view_node}>{url.title}</a>
                            <table className='url-resources'>
                                <tbody>
                                    <tr>
                                        <td>
                                            {url.JSResources.enabled==true && (<URLJSResources js-resources={url.JSResources}/>)}
                                            {url.CSSResources.enabled==true && (<URLCSSResources GlobalState={GlobalState}/>)}
                                            {url.FontResources.enabled==true && (<URLFontResources GlobalState={GlobalState}/>)}
                                            {url.ImageResources.enabled==true && (<URLImageResources GlobalState={GlobalState}/>)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        {uiState.columns.JSResources==true && (<td><Checkbox checked={url.JSResources.enabled} onChange={
                            function(){
                                url.JSResources.enabled=!url.JSResources.enabled;
                                // url.JSResources.data=GlobalState.updateURLJSData(url);
                            }
                        }/></td>)}
                        {uiState.columns.CSSResources==true && (<td><Checkbox checked={url.CSSResources.enabled} onChange={function(){url.CSSResources.enabled=!url.CSSResources.enabled;}}/></td>)}
                        {uiState.columns.FontResources==true && (<td><Checkbox checked={url.FontResources.enabled} onChange={function(){url.FontResources.enabled=!url.FontResources.enabled;}}/></td>)}
                        {uiState.columns.ImageResources==true && (<td><Checkbox checked={url.ImageResources.enabled} onChange={function(){url.ImageResources.enabled=!url.ImageResources.enabled;}}/></td>)}
                        {uiState.columns.lhr==true && (<td><LighthouseReportsListing lighthouse-reports={url.lhrData}/></td>)}
                        {uiState.columns.cls==true && (<td>{url.field_cls_average}<PercentageMeter value={url.field_cls_average} outer-width="90%"/></td>)}
                        {uiState.columns.fcp==true && (<td>{url.field_fcp_average}<PercentageMeter value={url.field_fcp_average} outer-width="90%"/></td>)}
                        {uiState.columns.fmp==true && (<td>{url.field_fmp_average}<PercentageMeter value={url.field_fmp_average} outer-width="90%"/></td>)}
                        {uiState.columns.lcp==true && (<td>{url.field_lcp_average}<PercentageMeter value={url.field_lcp_average} outer-width="90%"/></td>)}
                        {uiState.columns.tbt==true && (<td>{url.field_tbt_average}<PercentageMeter value={url.field_tbt_average} outer-width="90%"/></td>)}
                </tr>);
            ;

        });
        setURLData(urlListUpdated);
        let theadings = [
            "Active",
            "URL",
        ];
        (uiState.columns.JSResources==true) && theadings.push("JS Resources");
        (uiState.columns.CSSResources==true) && theadings.push("CSS Resources");
        (uiState.columns.FontResources==true) && theadings.push("Font Resources");
        (uiState.columns.ImageResources==true) && theadings.push("Image Resources");
        (uiState.columns.lhr==true) && theadings.push("Available Lighthouse Reports");
        (uiState.columns.cls==true) && theadings.push("CLS Average");
        (uiState.columns.fcp==true) && theadings.push("FCP Average");
        (uiState.columns.fmp==true) && theadings.push("FMP Average");
        (uiState.columns.lcp==true) && theadings.push("LCP Average");
        (uiState.columns.tbt==true) && theadings.push("TBT Average");
        // "JS Resources",
        // "CSS Resources",
        // "Font Resources",
        // "Image Resources",
        // "Available Lighthouse Reports",
        // "CLS Average",
        // "FCP Average",
        // "FMP Average",
        // "LCP Average",
        // "TBT Average",

        const th = theadings.map((label, index) => {
            return <th key={index}>{label}</th>});

        return (
            <div className="block block-url-stats-block">
                <BlockTitle title="URL Stats"/>
                <BlockContent
                    blockName="url-stats"
                    content={
                        <>
                            <ViewFilters GlobalState={GlobalState} data-example={urlData[0]}/>
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