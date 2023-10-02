import React, { useState, useEffect, useLocation } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';


function ViewFilters(props) {
    const setSidebar = props['set-sidebar'];
    const [checked1, setChecked1] = React.useState(true);
    const [checked2, setChecked2] = React.useState(true);
    // const [included, setIncluded] = React.useState(true);
    // setSidebar(checked1);
    
    return (
        <div>
        <Checkbox
            checked={checked1}
            onChange={(e) => setChecked1(e.target.checked)}
        />
        <Checkbox
            checked={checked2}
            onChange={(e) => setChecked2(e.target.checked)}
        />
        </div>);
}

export default ViewFilters;