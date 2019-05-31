//创建tabs内容
import React from "react";
const createTabsContent = function({ name, content, style }) {
    switch (name) {
        case "qnnForm":
            return (
                <div>
                    {this.createQnnForm({
                        ...content, 
                    }, style)}
                </div>
            );
        case "qnnTable":
            return (
                <div>
                    {this.createQnnTable({
                        ...content
                    }, style)}
                </div>
            );
        default:
            let Com = content;
            return (
                <div>
                    <Com {...this.props} btnCallbackFn={this.btnfns} />
                </div>
            );
    }
};
export default createTabsContent;
