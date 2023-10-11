import React, { useState } from 'react';
import BlockTitle from '../UIElements/BlockTitle';
import BlockContent from '../UIElements/BlockContent';
import Checkbox from '@mui/material/Checkbox';
import PercentageMeter from '../UIElements/PercentageMeter';


// first: get lhr data connected to urls

// JS Resources 
// Shared by all selected URLs.
// then split by each URL, each showing the unique scripts
// checkbox, script URL,
// meter
// script bytes, total bytes

// then in URL Stats
    // URL Title
    // meter for each selected script
    // used, total

function JSResources(props) {
    // if(props["activeJSResourcesURLs"]&&props["activeJSResourcesURLs"].length>0) {
    const uiState=props["uiState"];
    const GlobalState=props["GlobalState"];
    const urlData=GlobalState.urlData;
    const LHRData=GlobalState.LHRData;
    console.log('urlData:', urlData);
    console.log('LHRData:', LHRData);
    if(uiState.activeJSResourcesURLs.length>0) {
        const activeJSResourcesURLs=uiState.activeJSResourcesURLs;
        console.log('activeJSResourcesURLs:', activeJSResourcesURLs);
        const urlList = activeJSResourcesURLs.map((urlID, index) => {
            const url=urlData.filter((urlDat) => urlDat.nid==urlID);
            console.log('url:', url);
            return <tr key={url[0].nid}><td><Checkbox/></td><td>{url[0].nid}</td><td>{url[0].title}</td></tr>;
        });

        
        const sharedJSResources=activeJSResourcesURLs.map((urlID, index) => {
            const mostRecent=LHRData.filter((LHRDat) => parseInt(LHRDat.field_url_reference_1)==parseInt(urlID));
            console.log('mostRecent:', mostRecent, urlID);            
            return mostRecent[0];
        });

        return (<div className='block block-js-resources-block'>
            <BlockTitle title="JavaScript Resources"/>
            <BlockContent
                blockName="js-resources"
                content={
                    <table><tbody>{urlList}</tbody></table>
                }
            /></div>);
    
    }
}

export default JSResources;