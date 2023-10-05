import {
    AwsWriterFunction,
    createContentBlock,
    createMdList,
    MdHeader,
    MdListType,
    WriterOptions,
}                                                from "./common/common_md_functions";
import { DocumentResourcesTree, EventsEventBus } from "../models/models";

function createEventBusContent(eventBusList: EventsEventBus[]): string {
    const eventBusesMapped: string[] = eventBusList.map(eventBus => eventBus.name);

    return createMdList("Event Buses:", eventBusesMapped, MdListType.UNORDERED);
}

export const writeEventBuses: AwsWriterFunction = (resourcesList: DocumentResourcesTree, options?: WriterOptions): string => {
    const eventBusList = resourcesList.mappedEventsEventBus;
    if (eventBusList === undefined || eventBusList.length === 0) {
        return "";
    }

    const content: string = createEventBusContent(eventBusList);
    return createContentBlock("AWS Event Bus Information", MdHeader.HEADER_LEVEL_2, content);
};