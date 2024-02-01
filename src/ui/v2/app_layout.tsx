import React             from "react";
import { Layout, theme } from "antd";
import MainAppView       from "./components/main_app/main_view";

const {Header, Content} = Layout;

const App: React.FC = () => {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    return (
        <Layout>

            <Header style={{display: "flex", alignItems: "center"}}>
                <h3 style={{color: "white"}}>AWS Cloud Formation Template to Markdown Doc parser</h3>
            </Header>

            <Content style={{padding: "0 0"}}>
                <div style={{background: colorBgContainer, padding: 5, borderRadius: borderRadiusLG}}>
                    <MainAppView/>
                </div>
            </Content>

        </Layout>
    );
};

export default App;