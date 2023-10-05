import React, { useState }                                      from "react";
import { Button, Layout, Menu, theme }                          from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined } from "@ant-design/icons";
import AppContent                                               from "./components/app_content";

const {Header, Content, Footer, Sider} = Layout;

const ReactApp: React.FC = () => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const [collapsed, setCollapsed] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const onMenuItemClicked = (key: string) => {
        if (key === "1") {
            setModalIsOpen(true);
        }
    };


    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    items={[
                        {
                            key: "1",
                            icon: <UploadOutlined/>,
                            label: "Upload AWS CloudFormation Template JSON",
                        },
                    ]}
                    onClick={(data) => onMenuItemClicked(data.key)}
                />
            </Sider>
            <Layout>
                <Header style={{padding: 0, background: colorBgContainer}}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>

                <Content
                    style={{
                        margin: "5px",
                        padding: 10,
                        minHeight: 768,
                        background: colorBgContainer,
                    }}
                >

                    <AppContent modalIsOpened={modalIsOpen} onModalClosed={() => setModalIsOpen(false)}/>

                </Content>
            </Layout>
        </Layout>
    );
};

export default ReactApp;