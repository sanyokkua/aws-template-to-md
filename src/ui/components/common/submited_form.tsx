import React from "react";

export type FieldMapping = {
    fieldName: string;
    fieldValue: boolean | string | React.JSX.Element;
}
export type SubmittedFormValuesProps = {
    data: FieldMapping[];
    isList?: boolean;
}

const SubmittedFormValues: React.FC<SubmittedFormValuesProps> = (props: SubmittedFormValuesProps) => {
    let content;

    if (props.isList) {
        content = <ul>
            {props.data.map(item => {
                return <li key={item.fieldValue as string}>{item.fieldValue}</li>;
            })}
        </ul>;
    } else {
        content = <table>
            <thead>
            <tr>
                <th>Field</th>
                <th>Value</th>
            </tr>
            </thead>
            <tbody>
            {props.data.map(item => {
                return <tr>
                    <td>{item.fieldName}</td>
                    <td>{item.fieldValue.toString()}</td>
                </tr>;
            })}
            </tbody>
        </table>;
    }
    return <>
        <h3>Submitted values:</h3>
        <div>
            {content}
        </div>
    </>;
};

export default SubmittedFormValues;