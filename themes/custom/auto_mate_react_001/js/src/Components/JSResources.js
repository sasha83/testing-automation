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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function JSResources(props) {
    // if(props["activeJSResourcesURLs"]&&props["activeJSResourcesURLs"].length>0) {
    const uiState=props["uiState"];
    const GlobalState=props["GlobalState"];
    const urlData=GlobalState.urlData;
    const LHRData=GlobalState.LHRData;
    // console.log('urlData:', urlData);
    // console.log('LHRData:', LHRData);
    if(uiState.activeJSResourcesURLs.length>0) {
        const activeJSResourcesURLs=uiState.activeJSResourcesURLs;
        // console.log('activeJSResourcesURLs:', activeJSResourcesURLs);
        const urlList = activeJSResourcesURLs.map((urlID, index) => {
            const url=urlData.filter((urlDat) => urlDat.nid==urlID);
            // console.log('url:', url);
            return <tr key={url[0].nid}><td><Checkbox/></td><td>{url[0].nid}</td><td>{url[0].title}</td></tr>;
        });

        // JSON.parse(data[0][field_name].replaceAll('&quot;', '"'));
        const resourceNodesByID=activeJSResourcesURLs.map((urlID, index) => {
            const mostRecent=LHRData.filter((LHRDat) => parseInt(LHRDat.field_url_reference_1)==parseInt(urlID));
            // console.log('mostRecent[0].field_script_treemap_data:', JSON.parse(mostRecent[0].field_script_treemap_data.replaceAll('&quot;', '"')), urlID);            
            return {nid: urlID, nodes: JSON.parse(mostRecent[0].field_script_treemap_data.replaceAll('&quot;', '"')).nodes};
        });
        console.log('resourceNodesByID:', resourceNodesByID);
        let globalJSResources=[];
        let uniqueJSResources=[];
        resourceNodesByID.map((url, index) => {
            console.log('url:', url);
            // uniqueJSResources.push({nid: url.nid, nodes: []});
            url.nodes.map((JSnode, JSnodeIndex) => {
                const findName = globalJSResources.filter((resource) => resource.name==JSnode.name);
                if(findName.length==0) globalJSResources.push({name: JSnode.name, bytes: JSnode.resourceBytes});
                // if(globalJSResources.indexOf(JSnode.name)==-1) globalJSResources.push({name: JSnode.name, bytes: JSnode.resourceBytes});
            });
        });
        function compareBytes( a, b ) {
            if ( a.bytes < b.bytes ){
                return 1;
            }
            if ( a.bytes > b.bytes ){
                return -1;
            }
            return 0;
        }
          
        globalJSResources.sort( compareBytes );
          
        const globalJSNodes=globalJSResources.map((node, index) => {
            return (<tr><Checkbox/><td className='js-resource-name'>{node.name}</td><td className='js-resource-size'>{numberWithCommas(node.bytes)}</td></tr>);
        });
        
        console.log('globalJSResources:', globalJSResources);
        return (<div className='block block-js-resources-block'>
            <BlockTitle title="JavaScript Resources"/>
            <BlockContent
                blockName="js-resources"
                content={
                    <table><tbody>{globalJSNodes}</tbody></table>
                }
            /></div>);
    
    }
}

export default JSResources;