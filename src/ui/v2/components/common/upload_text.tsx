import React                       from "react";
import { UploadOutlined }          from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import { RcFile }                  from "antd/lib/upload";

export type UploadResult = {
    fileContent: string;
    fileName: string;
}

export type UploadTextProps = {
    onTextUploaded: (uploadResult: UploadResult) => void;
}

const ALLOWED_FILE_TYPES = [".json", ".txt"];

const UploadText: React.FC<UploadTextProps> = (props: UploadTextProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const isFileTypeAllowed = (file: RcFile) => {
        return ALLOWED_FILE_TYPES.some(type => file.name.endsWith(type));
    };
    const beforeUpload = (file: RcFile): boolean => {
        if (!isFileTypeAllowed(file)) {
            messageApi.error("Only .json and .txt files are allowed!");
            // Prevent the file from being uploaded
            return false;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const fileContent = event?.target?.result;
            // When used reader.readAsText(file) -> string should be passed in event
            if (typeof fileContent === "string") {
                props.onTextUploaded({
                                         fileContent: fileContent,
                                         fileName: file.name,
                                     });
                messageApi.success("Successfully loaded content of the file");
            } else {
                messageApi.error("Error occurred during loading content of the file, check console for details");
                console.error("Type of content is not a string");
            }
        };
        reader.onerror = (event) => {
            messageApi.error("Error occurred during loading content of the file, check console for details");
            console.error(event?.target?.error);
        };

        reader.readAsText(file);
        // Prevent the file from being uploaded
        return false;
    };
    return (
        <>
            {contextHolder}
            <Upload beforeUpload={beforeUpload} showUploadList={false}>
                <Button icon={<UploadOutlined/>}>Click to Upload</Button>
            </Upload>
        </>
    );
};

export default UploadText;