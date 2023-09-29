import React, { useState, useEffect, useLocation } from 'react';
import URLStats from '../Components/URLStats';
import './PageDomain.css';
// import JSResources from '../Components/JSResources';
import { func } from 'prop-types';

function PageDomain(props) {
    const urlData = props["url-data"];
    const [activeElements, setActiveElements] = useState({
        "activeParentURL": "",
        "activeChildURLs": [],
        "activeParentResource": "",
        "activeChildResources": []
    });
    // const [activeParentURL, setActiveParentURL] = useState('asdf');
    // const [activeChildURLs, setActiveChildURLs] = useState('asdf');
    // const [activeParentResource, setActiveParentResource] = useState('asdf');
    // const [activeChildResources, setActiveChildResources] = useState('asdf');
    return (<>
    
            <main className='main-content'>
                <URLStats
                    url-data={urlData}
                    active-elements={activeElements}
                    state-setters={setActiveElements}/>
            </main>
            <aside className='sidebar'>
                
            </aside>
        </>
    );
}

export default PageDomain;