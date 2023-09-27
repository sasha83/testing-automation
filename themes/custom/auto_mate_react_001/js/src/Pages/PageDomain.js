import React from 'react';
import URLStats from '../Components/URLStats';
import JSResources from '../Components/JSResources';

function PageDomain(props) {
    const urlData = props["url-data"];
    // console.log('urlData: ', urlData);
    return (
        <>
            <URLStats url-data={urlData}/>
            <JSResources url-data={urlData}/>
        </>);
}

export default PageDomain;