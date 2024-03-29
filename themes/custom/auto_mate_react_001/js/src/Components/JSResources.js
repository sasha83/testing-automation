import React, { useState } from 'react';
import BlockTitle from '../UIElements/BlockTitle';
import BlockContent from '../UIElements/BlockContent';
import Checkbox from '@mui/material/Checkbox';
import PercentageMeter from '../UIElements/PercentageMeter';
import './JSResources.css';

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
    const uiState = props["uiState"];
    const GlobalState = props["GlobalState"];
    const urlData = GlobalState.urlData;
    const LHRData = GlobalState.LHRData;
    const handleJSResource = props["handleJSResource"];
    // console.log('GlobalState in JSResources', GlobalState);
    if (uiState.activeJSResourcesURLs.length > 0) {
        const activeJSResourcesURLs = uiState.activeJSResourcesURLs;
        const activeJSResourceNodes = uiState.activeJSResourceNodes;
        const urlList = activeJSResourcesURLs.map((urlID, index) => {
            const url = urlData.filter((urlDat) => urlDat.nid == urlID);
            return <tr key={url[0].nid}><td><Checkbox /></td><td>{url[0].nid}</td><td>{url[0].title}</td></tr>;
        });

        const resourceNodesByID = activeJSResourcesURLs.map((urlID, index) => {
            const mostRecent = LHRData.filter((LHRDat) => parseInt(LHRDat.field_url_reference_1) == parseInt(urlID));
            if (mostRecent.length > 0) {
                return { nid: urlID, nodes: mostRecent[0].field_script_treemap_data }
            }

        });
        let globalJSResources = [];
        let uniqueJSResources = [];
        resourceNodesByID.map((url, index) => {
            url.nodes.map((JSnode, JSnodeIndex) => {
                const findName = globalJSResources.filter((resource) => resource.name == JSnode.name);
                if (findName.length == 0) globalJSResources.push({ name: JSnode.name, bytes: JSnode.resourceBytes });
            });
        });
        function compareBytes(a, b) {
            if (a.bytes < b.bytes) {
                return 1;
            }
            if (a.bytes > b.bytes) {
                return -1;
            }
            return 0;
        }

        globalJSResources.sort(compareBytes);
        const globalJSNodes = globalJSResources.map((node, index) => {
            if (activeJSResourceNodes[0] != undefined) {
                console.log('activeJSResourceNodes', activeJSResourceNodes[0].name)
            }
            const foundIn = activeJSResourceNodes.filter((n) => n.name == node.name);
            return (<tr><Checkbox checked={foundIn.length > 0} theNode={node} onChange={(e, theNode) => { handleJSResource(urlData, LHRData, node, e) }} /><td className='js-resource-name'>{node.name}</td><td className='js-resource-size'>{numberWithCommas(node.bytes)}</td></tr>);
        });

        let byteTotal = 0;
        globalJSResources.map((node) => {
            byteTotal += node.bytes;
        });
        return (<div className='block block-js-resources-block'>
            <BlockTitle title="JavaScript Resources" />
            <BlockContent
                blockName="js-resources"
                content={
                    <>
                        <table>
                            <thead><th className='scripts-q'>{globalJSNodes.length} scripts</th><th></th><th className='total-bytes'>{numberWithCommas(byteTotal)}<br />Total JS Bytes</th></thead>
                            <tbody>{globalJSNodes}</tbody>
                        </table>
                    </>
                }
            /></div>);

    }
}

export default JSResources;