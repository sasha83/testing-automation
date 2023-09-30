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
    const testDisplayedData = {};
    const GlobalState = props["GlobalState"];
    if(GlobalState.urlData&&GlobalState.urlData!=null) {
        let urlListUpdated = [];
        const urlList = GlobalState.urlData.map((url, index) => {
            // console.log(url);
            url.test = url.nid;
            if(!url.JSResources) url.JSResources={
                enabled: true,

            }
            if(!url.CSSResources) url.CSSResources={enabled: false}
            if(!url.FontResources) url.FontResources={enabled: false}
            if(!url.ImageResources) url.ImageResources={enabled: false}
            if(!url.LHRData) url.LHRData=[];
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
                                            {url.JSResources.enabled==true && (<URLJSResources js-resources={url.JSResources} GlobalState={GlobalState}/>)}
                                            {url.CSSResources.enabled && (<URLCSSResources/>)}
                                            {url.FontResources.enabled && (<URLFontResources/>)}
                                            {url.ImageResources.enabled && (<URLImageResources/>)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td><Checkbox checked={url.JSResources.enabled}/></td>
                        <td><Checkbox checked={url.CSSResources.enabled}/></td>
                        <td><Checkbox checked={url.FontResources.enabled}/></td>
                        <td><Checkbox checked={url.ImageResources.enabled}/></td>
                        <td><LighthouseReportsListing url-nid={url.nid} GlobalState={GlobalState}/></td>
                        <td>{url.field_cls_average}<PercentageMeter value={url.field_cls_average} outer-width="90%"/></td>
                        <td>{url.field_fcp_average}<PercentageMeter value={url.field_fcp_average} outer-width="90%"/></td>
                        <td>{url.field_fmp_average}<PercentageMeter value={url.field_fmp_average} outer-width="90%"/></td>
                        <td>{url.field_lcp_average}<PercentageMeter value={url.field_lcp_average} outer-width="90%"/></td>
                        <td>{url.field_tbt_average}<PercentageMeter value={url.field_tbt_average} outer-width="90%"/></td>
                </tr>);
            ;
        });
        // console.log('urlListUpdated:', urlListUpdated);
        // setURLData(urlListUpdated);
        const theadings = [
            "Active",
            "URL",
            "JS Resources",
            "CSS Resources",
            "Font Resources",
            "Image Resources",
            "Available Lighthouse Reports",
            "CLS Average",
            "FCP Average",
            "FMP Average",
            "LCP Average",
            "TBT Average",
        ].map((label, index) => {
            return <th key={index}>{label}</th>});

        return (
            <div className="block block-url-stats-block">
                <BlockTitle title="URL Stats"/>
                <BlockContent
                    blockName="url-stats"
                    content={
                        <>
                            <ViewFilters GlobalState={GlobalState} data-example={GlobalState.urlData[0]}/>
                            <div className="view-content">
                                <table className="views-table views-view-table cols-8">
                                    <thead>
                                        <tr>{theadings}</tr>
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