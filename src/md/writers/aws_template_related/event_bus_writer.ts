import {
    createContentBlock,
    createMdList,
    MdHeader,
    MdListType,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                                                from "../common/common_md_functions";
import { DocumentResourcesTree, EventsEventBus } from "../../models/models";

function createEventBusContent(eventBusList: EventsEventBus[]): string {
    const eventBusesMapped: string[] = eventBusList.map(eventBus => eventBus.name);

    return createMdList("Event Buses:", eventBusesMapped, MdListType.UNORDERED);
}

export const writeEventBuses: WriterFunc<DocumentResourcesTree> = (params: WriterParams<DocumentResourcesTree>, options?: WriterOptions): string => {
    const eventBusList = params.value.mappedEventsEventBus;
    if (eventBusList === undefined || eventBusList.length === 0) {
        return "";
    }

    const content: string = createEventBusContent(eventBusList);
    return createContentBlock("AWS Event Bus Information", MdHeader.HEADER_LEVEL_2, content);
};