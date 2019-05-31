//创建tabs表单的方法
import React from "react";
import { Tabs, Spin } from "antd";
const TabPane = Tabs.TabPane;

const createTabsForm = function({ style, tabs }) {
    const { tabsActiveKey, loading, loadingByForm } = this.state;
    return (
        <div className={style.tabsContainer} name="tabsContainer">
            <Tabs activeKey={tabsActiveKey} onChange={this.tabsClick}>
                {tabs.map(({ name, title, content, disabled, ...otherArgs }, index) => {
                    if (typeof disabled === "function") {
                        disabled = disabled({
                            ...this.props,
                            fetch: this.fetch,
                            btnCallbackFn: this.btnCallbackFn,
                            state: this.state
                        });
                    }

                    return (
                        <TabPane
                            forceRender={true}
                            tab={title}
                            key={index.toString()}
                            disabled={disabled}
                            {...otherArgs}
                        >
                            <Spin spinning={(loading ? loading : loadingByForm)}>
                                {this.createTabsContent({
                                    name,
                                    title,
                                    content,
                                    style
                                })}
                            </Spin>
                        </TabPane>
                    );
                })}
            </Tabs>
        </div>
    );
};
export default createTabsForm;
