import React, { useState, useEffect, useLocation } from 'react';
import URLStats from '../Components/URLStats';
// import JSResources from '../Components/JSResources';
import { func } from 'prop-types';

function PageDomain(props) {
    const urlData = props["url-data"];
    const [activeParentURL, setActiveParentURL] = useState('asdf');
    const [activeChildURLs, setActiveChildURLs] = useState('asdf');
    const [activeParentResource, setActiveParentResource] = useState('asdf');
    const [activeChildResources, setActiveChildResources] = useState('asdf');
    const stateSetters = {
        "setActiveParentURL": setActiveParentURL,
        "setActiveChildURLs": setActiveChildURLs,
        "setActiveParentResource": setActiveParentResource,
        "setActiveChildResources": setActiveChildResources
    };
    return (
        <>
            <URLStats
                url-data={urlData}
                active-parent-url={activeParentURL}
                active-child-urls={activeChildURLs}
                active-parent-resource={activeParentResource}
                active-child-resources={activeChildResources}
                state-setters={stateSetters}/>
            {/* <MainContent/> */}
            {/* <Sidebar active-blocks={['JSResources']}/> */}
            {/* <JSResources url-data={urlData}/> */}
        </>);
}

export default PageDomain;