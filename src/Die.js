import React from "react";

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    };

    const dots = Array.from({length: props.value }, (_, index) => (
        <div key={index} className="dot"/>
    ))
    return (
        <div
            onClick={props.holdDice}
            className="die-face"
            style={styles}
        >
            {dots}
        </div>
    )
}