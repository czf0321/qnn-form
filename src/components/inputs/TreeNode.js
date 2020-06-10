import React,{ memo } from "react";
import { Tree as TreeNode } from "../../lib";
const TreeNodeComponent = (props) => {
    const { fns: { fetch },inputProps,qnnformData: { style } } = props;
    return <div className={`${style.qnnFormPullPersonMobile} qnnFormTreeNode`}>
        <TreeNode
            fns={props.fns}
            myFetch={fetch}
            selectModal="1"
            setNodeProps={nodeInfo => {
                return { disableCheckbox: false };
            }}
            {...inputProps.treeNodeOption}
            {...inputProps}
        />
    </div>
}

export default memo(TreeNodeComponent);