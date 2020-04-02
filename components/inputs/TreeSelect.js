import React from "react";
import { PullPerson,PullPersonMobile } from "../../lib";
const TreeSelectComponent = (props) => {
    const {
        fieldConfig: { treeSelectOption },
        fns: { fetch,isMobile },
        inputProps,
        inputProps: { disabled },
        qnnformData: { style }
    } = props;  
    if (isMobile()) { 
        return <div className={`${style.qnnFormPullPersonMobile} qnnFormPullPersonMobile`}>
            <PullPersonMobile
                edit={!disabled}
                myFetch={fetch}
                {...treeSelectOption}
                {...inputProps}
                label=""
                help={false}
            />
        </div>
    } else {
        return (
            <PullPerson
                edit={!disabled}
                myFetch={fetch}
                {...treeSelectOption}
                {...inputProps}
                label=""
            />
        );
    }
}

export default TreeSelectComponent;