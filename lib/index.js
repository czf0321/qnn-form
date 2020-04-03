import React from "react"
//所有外部依赖全部放这
export { fromJS,is } from "immutable"

export { withRouter } from "react-router-dom";
export { default as moment } from "moment";

//其他组件
// export { default as PullPerson } from "apih5/modules/pullPersion"
// export { default as PullPersonMobile } from "apih5/modules/pullPersionMobile"
// export { default as Tree } from "apih5/modules/tree" 
const PullPerson = () => {
    return <div>PullPerson组件暂未开源 请使用自定义组件替换</div>
}
const PullPersonMobile = () => {
    return <div>PullPersonMobile组件暂未开源 请使用自定义组件替换</div>
}
const Tree = () => {
    return <div>Tree组件暂未开源 请使用自定义组件替换</div>
}

export { PullPerson,PullPersonMobile,Tree }