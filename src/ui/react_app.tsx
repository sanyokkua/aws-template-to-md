import React             from "react";
import { Layout, theme } from "antd";
import "./github_css.css";
import App               from "./v2/app_layout";

const {Content} = Layout;

const ReactApp: React.FC = () => {
    const {token: {colorBgContainer}} = theme.useToken();

    return (
        <Layout>
            <Layout>
                <Content style={{margin: "1px", minHeight: 768, background: colorBgContainer}}>
                    <App/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ReactApp;