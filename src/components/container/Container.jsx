import React from "react";
import styles from "./Container.module.scss";
const Container = (props) => {
    const baseClasses = [
        styles.container,
        props.containerLangue ? styles.containerLangue : null,
        props.containerPages ? styles.containerPages : null
    ]
    const classNames = baseClasses.filter(Boolean).join(' ');
    return (
        <div className={classNames}>{props.children}</div>
    )

}
export default Container;