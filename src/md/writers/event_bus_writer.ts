import { createMdList, makeHeader, MdHeader, MdListType, WriterFunction } from "./common";
import { DocumentResourcesTree }                                          from "../models";

export const writeEventBuses: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
    const eventBusList = resourcesList.mappedEventsEventBus;
    if (eventBusList === undefined || eventBusList.length === 0) {
        return "";
    }
    const eventBusesMapped: string[] = eventBusList.map(eventBus => eventBus.name);

    const header = makeHeader("AWS Event Bus Information", MdHeader.HEADER_LEVEL_2);
    const mdList = createMdList("Event Buses:", eventBusesMapped, MdListType.UNORDERED);

    const resultText: string[] = [];
    resultText.push(header);
    resultText.push(mdList);

    return resultText.join("\n");
};