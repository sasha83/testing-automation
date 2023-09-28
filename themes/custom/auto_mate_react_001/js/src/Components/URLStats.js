import React, { useState, useEffect, useLocation } from 'react';
import BlockTitle from '../UIElements/BlockTitle';
import BlockContent from '../UIElements/BlockContent';
import PercentageMeter from '../UIElements/PercentageMeter';
import LighthouseReportsListing from './URLStatsComponents/LighthouseReportsListing';
import { func } from 'prop-types';


function URLStats(props) {
    // const setActiveURL = props['url-setter'];
    if(props["url-data"]&&props["url-data"]!=null) {
        let urls = props["url-data"];
        const urlList = urls.map((url, index) => {
            return <tr 
                        className="views-field views-field-title"
                        key={index}>
                            <td className='views-field views-field-title'>
                                <a href={url.view_node}>{url.title}</a>
                            </td>
                            <td><LighthouseReportsListing url-nid={url.nid}/></td>
                            <td>{url.field_cls_average}<PercentageMeter value={url.field_cls_average}/></td>
                            <td>{url.field_fcp_average}<PercentageMeter value={url.field_fcp_average}/></td>
                            <td>{url.field_fmp_average}<PercentageMeter value={url.field_fmp_average}/></td>
                            <td>{url.field_lcp_average}<PercentageMeter value={url.field_lcp_average}/></td>
                            <td>{url.field_tbt_average}<PercentageMeter value={url.field_tbt_average}/></td>
                </tr>;
            ;
        });
        const theadings = [
            "",
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
                    }
                />
            </div>);    
    }
}

export default URLStats;