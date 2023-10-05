import React, { useState } from "react";
import { Modal }           from "antd";
import JsonEditor          from "./json_editor";

type JsonInputModalProps = {
    isOpen: boolean;
    onConfirm: (data: string) => void;
    onCancel: () => void;
}

const JsonInputModal: React.FunctionComponent<JsonInputModalProps> = (props: JsonInputModalProps) => {
    const [jsonData, setJsonData] = useState("");
    const handleOk = (data: string) => props.onConfirm(data);
    const handleCancel = () => props.onCancel();


    return <div>
        <Modal title="Paste JSON template"
               open={props.isOpen}
               onOk={() => handleOk(jsonData)}
               onCancel={() => handleCancel()}
        >
            <JsonEditor onChange={(data) => setJsonData(data)}/>
        </Modal>
    </div>;
};
export default JsonInputModal;