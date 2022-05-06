import React from 'react';
import './Popup.css';

// mui components
import CloseIcon from '@mui/icons-material/Close';

function Popup(props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <CloseIcon onClick={() => props.setTrigger(false)} sx={{ cursor: "pointer", float: "right", fontSize: 26 }} />
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup
