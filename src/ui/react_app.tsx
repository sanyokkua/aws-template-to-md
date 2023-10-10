import React             from "react";
import { Layout, theme } from "antd";
import AppContent        from "./components/app_content_component";

const {Content} = Layout;

const ReactApp: React.FC = () => {
    const {token: {colorBgContainer}} = theme.useToken();

    return (
        <Layout>
            <Layout>
                <Content style={{margin: "5px", minHeight: 768, background: colorBgContainer}}>
                    <AppContent/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ReactApp;