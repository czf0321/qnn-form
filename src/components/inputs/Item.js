import React from "react";
import Item from "../inputs/item/index";
const ItemComponent = (props) => {
    const { inputProps } = props;

    return <Item {...props} {...inputProps}/>;
}


export default ItemComponent;