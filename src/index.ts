import { parseCloudForgeTemplate } from "./aws/parser";
import { mapAwsResourcesToMd }     from "./md/mapper";

import fs                           from "fs";
import { writeDescriptionForStack } from "./md/aws_md_writer";


export function loadFile() {
    console.log(__dirname);

    const paths: string[] = [
    ];

    paths.forEach(value => {
        const filePath = `${__dirname}/../${value}`;

        const stats = fs.statSync(filePath);
        console.log(stats);

        const data = fs.readFileSync(filePath, "utf8");
        const res = parseCloudForgeTemplate(data, true, "", "");
        const documentResourcesTree = mapAwsResourcesToMd(res);
        const resultMd = writeDescriptionForStack(documentResourcesTree);
        console.log(resultMd);
        console.log("****************");
    });
}

loadFile();