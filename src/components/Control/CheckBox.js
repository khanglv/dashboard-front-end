import React from 'react';
import {css} from 'emotion';

let color = window['colors'];

const rootMain = css`
    display: inline-block;
    .container {
        display: block;
        position: relative;
        padding-left: 25px;
        cursor: pointer;
        font-weight: 500;
        color: ${color._BLACK};
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    /* Hide the browser's default checkbox */
    .container input {
        position: absolute;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    /* Create a custom checkbox */
    .checkmark {
        position: absolute;
        top: 2px;
        left: 0;
        height: 16px;
        width: 16px;
        background-color: ${color._WHITE};
        border-radius: 4px;
        border: 1px solid ${color._STROKE};
    }

    /* On mouse-over, add a grey background color */
    .container:hover input ~ .checkmark {
        border: 1px solid ${color._BLUE_VCSC_LIGHT};
    }

    /* When the checkbox is checked, add a blue background */
    .container input:checked ~ .checkmark {
        border-color: ${color._BLUE_VCSC};
        background-color: ${color._BLUE_VCSC};
    }
    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Show the checkmark when checked */
    .container input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the checkmark/indicator */
    .container .checkmark:after {
        left: 5px;
        top: 1px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }

`

function CheckBox(props){
    const onChange = (e)=>{
        props._onChangeCheckbox(e);
    }
    return(
        <div className={rootMain}>
            <label className="container">{props.value}
                <input 
                    type="checkbox"
                    checked={props.isChecked}
                    onChange={onChange}
                />
                <span className="checkmark"></span>
            </label>
        </div>
    )
}

export default CheckBox;