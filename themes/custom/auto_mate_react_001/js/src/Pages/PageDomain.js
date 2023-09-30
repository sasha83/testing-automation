import React, { useState, useEffect, useLocation } from 'react';
import URLStats from '../Components/URLStats';
import classNames from 'classnames';
import './PageDomain.css';
// import JSResources from '../Components/JSResources';
import { func } from 'prop-types';

function PageDomain(props) {
    const urlData = props["url-data"];
    const setURLData = props["set-url-data"];
    const LHRData = props["lhr-data"];
    const setLHRData = props["set-lhr-data"];
    const [sidebar, setSidebar] = useState();
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
    const mainClass = classNames({
        'main-content': true,
        'side-bar-open': sidebar
    });

        return (<>

            <main className={mainClass}>
                <URLStats
                    url-data={urlData}
                    active-elements={activeElements}
                    state-setters={setActiveElements}
                    set-sidebar={setSidebar}
                    set-url-data={setURLData}
                    lhr-data={LHRData}
                    set-lhr-data={setLHRData}
                    />
            </main>
            <aside className='sidebar'>

            </aside>
        </>
    );
}

export default PageDomain;