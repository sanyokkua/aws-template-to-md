import React from "react";

import { Button, Card, Form, Input, message } from "antd";
import { ArtifactDesign, EditorInput }        from "../../../../md/writers/customs/models";
import { getCurrentOrDefault }                from "../../../../utils/utils";
import SubmittedFormValues                    from "../../common/submited_form";

type ArtifactDesignEditorProps = {
    editorInput: EditorInput<ArtifactDesign>;
}
const ArtifactDesignEditor: React.FC<ArtifactDesignEditorProps> = (props: ArtifactDesignEditorProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const onAddButtonClicked = (values?: any) => {
        const linkToTheSolutionDiagram = form.getFieldValue("linkToTheSolutionDiagram");
        const linkToTheDiagramImage = form.getFieldValue("linkToTheDiagramImage");

        const formLinkToTheSolutionDiagram: string = getCurrentOrDefault<string>(linkToTheSolutionDiagram, "");
        const formLinkToTheDiagramImage: string = getCurrentOrDefault<string>(linkToTheDiagramImage, "");

        const result = {
            linkToTheSolutionDiagram: formLinkToTheSolutionDiagram,
            linkToTheDiagramImage: formLinkToTheDiagramImage,
        };
        props.editorInput.onDataChanged(result);
        messageApi.success(`Submitted: ${JSON.stringify(result, null, 0)}`);
    };

    return <Card style={{width: "100%"}} title={"Add Repository Information"}>
        {contextHolder}
        <Form form={form} name="design-info-form" onFinish={() => onAddButtonClicked()} style={{maxWidth: 600}}>
            <Form.Item name="linkToTheSolutionDiagram" label="Link to the solution diagram"
                       initialValue={props.editorInput.data.linkToTheSolutionDiagram}
                       rules={[{required: true}, {type: "url", warningOnly: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="linkToTheDiagramImage" label="Link to the diagram image"
                       initialValue={props.editorInput.data.linkToTheDiagramImage}
                       rules={[{required: true}, {type: "url", warningOnly: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>

        <SubmittedFormValues data={[
            {fieldName: "Link to the solution diagram", fieldValue: props.editorInput.data.linkToTheSolutionDiagram},
            {fieldName: "Link to the diagram image", fieldValue: props.editorInput.data.linkToTheDiagramImage},
        ]} isList={false}/>
    </Card>;
};

export default ArtifactDesignEditor;