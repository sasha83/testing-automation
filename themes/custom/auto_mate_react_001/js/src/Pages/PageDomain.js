import React, { useState, useEffect, useLocation } from 'react';
import URLStats from '../Components/URLStats';
import classNames from 'classnames';
import './PageDomain.css';
// import JSResources from '../Components/JSResources';
import { func } from 'prop-types';
import JSResources from '../Components/JSResources';

function PageDomain(props) {
    // const urlData = props["url-data"];
    const GlobalState = props["GlobalState"];
    const updateGlobalState = props["updateGlobalState"];
    const uiState=props["uiState"];
    const handleResourcesChange=props["handleResourcesChange"];
    const handleJSResourcesSelectedURLs=props['handleJSResourcesSelectedURLs']
    const appContainerClass = classNames({
        'main-content': true,
        'sidebar-open': uiState.sidebar
    });

        return (<div id="page-container" className={appContainerClass}>
            <main>
                <section className='content-top'>

                </section>
                <section className='content-main'>
                    <URLStats GlobalState={GlobalState} updateGlobalState={updateGlobalState} handleResourcesChange={handleResourcesChange} uiState={uiState} handleJSResourcesSelectedURLs={handleJSResourcesSelectedURLs}/>
                </section>
                <section className='content-bottom'></section>
            </main>
            <aside className='sidebar'>
                <JSResources  GlobalState={GlobalState} updateGlobalState={updateGlobalState} uiState={uiState} handleJSResourcesSelectedURLs={handleJSResourcesSelectedURLs}/>
            </aside>

        </div>
    );
}

export default PageDomain;