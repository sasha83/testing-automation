import React from 'react';
import { useState } from 'react';
import BlockTitle from '../UIElements/BlockTitle';
import BlockContent from '../UIElements/BlockContent';

function JSResources(props) {
    if(props["url-data"]&&props["url-data"]!=null) {
        console.log('props: ', props["url-data"]);
        let urls = props["url-data"];
        const urlList = urls.map((url, index) => {
            console.log('url:', url);
            return <tr key={url.nid}><td>{url.title[0].value}</td></tr>;
        });
    
        return <div className='block block-js-resources-block'>
            <BlockTitle title="JavaScript Resources"/>
            <BlockContent
                blockName="js-resources"
                content={
                    <table><tbody>{urlList}</tbody></table>
                }
            />
        </div>;    
    } else {
        return <div></div>
    }
}

export default JSResources;