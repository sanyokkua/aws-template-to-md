import { createContentBlock, createMdList, MdHeader, MdListType, WriterFunction } from "./common/common";
import { DocumentResourcesTree, EventsEventBus }                                  from "../models";

function createEventBusContent(eventBusList: EventsEventBus[]): string {
    const eventBusesMapped: string[] = eventBusList.map(eventBus => eventBus.name);

    return createMdList("Event Buses:", eventBusesMapped, MdListType.UNORDERED);
}

export const writeEventBuses: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
    const eventBusList = resourcesList.mappedEventsEventBus;
    if (eventBusList === undefined || eventBusList.length === 0) {
        return "";
    }

    const content: string = createEventBusContent(eventBusList);
    return createContentBlock("AWS Event Bus Information", MdHeader.HEADER_LEVEL_2, content);
};