import React from "react";
import { QnnTable } from "../lib";
const createQnnTable = function (content,style = {}) {
    const { isInQnnTable } = this.props;
    let _content = {
        tabs:[],
        ...content,
    } 
    return (
        <div name="QnnTable" style={isInQnnTable ? { padding: "0px 12px" } : null}>
            <QnnTable
                {...this.props}
                fetch={this.props.myFetch || this.props.fetch}
                headers={this.props.headers ? { ...this.props.headers } : {}}
                {..._content}
            />
        </div>
    );
};
export default createQnnTable;
