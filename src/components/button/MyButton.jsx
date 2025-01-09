import React from "react";
import styles from "./MyButton.module.scss";
const MyButton = (props) => {
    const baseClasses = [
        styles.button,
        props.btnSubmit ? styles.submit : null,
        props.btnForm ? styles.btnForm : null
    ]
    const classNames = baseClasses.filter(Boolean).join(' ');
    return (
        <button type={props.type} onClick={props.onClick} className={classNames}>{props.children}</button>
    )

}
export default MyButton;