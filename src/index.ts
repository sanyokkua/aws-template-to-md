import { parseCloudForgeTemplate } from "./aws/parser";
import { mapAwsResourcesToMd }     from "./md/mapper";

import fs from "fs";


export function loadFile() {
    console.log(__dirname);

    const paths: string[] = [
        "", // TODO: put file in folder and add path here (CloudFormation template in JSON format)
    ];

    paths.forEach(value => {
        const filePath = `${__dirname}/../${value}`;

        const stats = fs.statSync(filePath);
        console.log(stats);

        const data = fs.readFileSync(filePath, "utf8");
        const res = parseCloudForgeTemplate(data);
        const documentResourcesTree = mapAwsResourcesToMd(res);
        console.log(documentResourcesTree);
        console.log("****************");
    });
}

loadFile();