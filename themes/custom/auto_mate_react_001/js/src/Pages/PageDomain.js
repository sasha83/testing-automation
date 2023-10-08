import React, { useState, useEffect, useLocation } from 'react';
import URLStats from '../Components/URLStats';
import classNames from 'classnames';
import './PageDomain.css';
// import JSResources from '../Components/JSResources';
import { func } from 'prop-types';

function PageDomain(props) {
    // const urlData = props["url-data"];
    const GlobalState = props["GlobalState"];
    const updateGlobalState = props["updateGlobalState"];
    const handleResourcesChange=props["handleResourcesChange"];
    const mainClass = classNames({
        'main-content': true,
        'side-bar-open': GlobalState.sidebar
    });

        return (<>
            <main className={mainClass}>
                <section className='content-top'>

                </section>
                {/* (GlobalState.LHRData&&GlobalState.LHRData.length>0) && {<URLStats GlobalState={GlobalState}/>)} */}
                <URLStats GlobalState={GlobalState} updateGlobalState={updateGlobalState} handleResourcesChange={handleResourcesChange}/>
                
                <section className='content-bottom'></section>
            </main>
            <aside className='sidebar'>
            </aside>

        </>
    );
}

export default PageDomain;