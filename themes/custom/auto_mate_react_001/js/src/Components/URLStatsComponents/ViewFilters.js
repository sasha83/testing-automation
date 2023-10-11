import React, { useState, useEffect, useLocation } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';





function ViewFilters(props) {
    const GlobalState=props["GlobalState"];
    const updateGlobalState=props["updateGlobalState"];
    const handleResourcesChange=props["handleResourcesChange"];
    const uiState=props["uiState"];

    const checkboxes = uiState.dashboardDataTypes.map((dashboardDataType, index) => {
        if(dashboardDataType.filter_exposed==true) {
            return (<FormControlLabel
                key={index}
                label={dashboardDataType.title}
                control={
                    <Checkbox
                        checked={dashboardDataType.enabled}
                        onChange={()=>{
                            handleResourcesChange(index, !dashboardDataType.enabled);

                        }}/>
                }
            />);
        }

    });
    // console.log('checkboxes: ', checkboxes);
    return (
        <div class="url-stats-view-filters">
            {checkboxes}
        </div>);
}

export default ViewFilters;