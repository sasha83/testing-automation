import React, { useState, useEffect, useLocation } from 'react';
import URLStats from '../Components/URLStats';
import classNames from 'classnames';
import './PageDomain.css';
// import JSResources from '../Components/JSResources';
import { func } from 'prop-types';

function PageDomain(props) {
    // const urlData = props["url-data"];
    const GlobalState = props["GlobalState"];
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
        'side-bar-open': GlobalState.sidebar
    });

        return (<>

            <main className={mainClass}>
                <URLStats

                    active-elements={activeElements}
                    state-setters={setActiveElements}
                    GlobalState={GlobalState}
                    />
            </main>
            <aside className='sidebar'>

            </aside>
        </>
    );
}

export default PageDomain;