import { createImageLink, NEW_LINE } from "./common/common_md_functions";
import { Tag }                       from "./customs/models";

export const writeTags = (tags: Tag[]): string => {
    if (tags === undefined || tags.length === 0) {
        return "";
    }

    const content = tags.map(tag => createImageLink(tag.text, tag.imgLink));
    return content.join(NEW_LINE);
};