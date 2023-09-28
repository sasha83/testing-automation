import React, { useState, useEffect, useLocation } from 'react';
import URLStats from '../Components/URLStats';
function MainContent(props) {
    return <main>
            <URLStats
                url-data={urlData}
                active-parent-url={activeParentURL}
                active-child-urls={activeChildURLs}
                active-parent-resource={activeParentResource}
                active-child-resources={activeChildResources}
                state-setters={stateSetters}/>

    </main>;
}

export default MainContent;