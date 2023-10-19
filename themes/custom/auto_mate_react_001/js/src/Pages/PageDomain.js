import React, { useState, useEffect, useLocation } from 'react';
import URLStats from '../Components/URLStats';
import classNames from 'classnames';
import './PageDomain.css';
// import JSResources from '../Components/JSResources';
import { func } from 'prop-types';
import JSResources from '../Components/JSResources';
import DomainTimeline from '../Components/DomainTimeline';
import InstanceListing from '../Components/InstanceListing';

function PageDomain(props) {
    // const urlData = props["url-data"];
    const GlobalState = props["GlobalState"];
    const updateGlobalState = props["updateGlobalState"];
    const uiState = props["uiState"];
    const handleJSResource = props["handleJSResource"];
    const handleResourcesChange = props["handleResourcesChange"];
    const handleJSResourcesSelectedURLs = props['handleJSResourcesSelectedURLs']
    const appContainerClass = classNames({
        'main-content': true,
        'sidebar-open': uiState.sidebar
    });
    // console.log('GlobalState:', GlobalState);
    return (<div id="page-container" className={appContainerClass}>
        <main>
            <section className='content-top'>

            </section>
            <section className='content-main'>
                <DomainTimeline GlobalState={GlobalState} />
                <InstanceListing GlobalState={GlobalState} />
                <URLStats GlobalState={GlobalState} updateGlobalState={updateGlobalState} handleResourcesChange={handleResourcesChange} uiState={uiState} handleJSResourcesSelectedURLs={handleJSResourcesSelectedURLs} handleJSResource={handleJSResource} />
            </section>
            <section className='content-bottom'></section>
        </main>
        <aside className='sidebar'>

            <JSResources GlobalState={GlobalState} updateGlobalState={updateGlobalState} uiState={uiState} handleJSResource={handleJSResource} />
        </aside>

    </div>
    );
}

export default PageDomain;