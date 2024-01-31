import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { DocumentResourcesTree }                 from "../../../mapping/models/mapped_tree";
import { isEmptyArray }                          from "../../../common_utils";
import { MappedEventsEventBus }                  from "../../../mapping/models/mapped_aws_events";
import { mdMakeContentBlock, mdMakeList }        from "../../utils";

export const createAwsEventBusSectionText: MarkdownWriterFunc<DocumentResourcesTree> = (dataValue: DocumentResourcesTree, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        return "";
    }

    const mappedEventsEventBuses = dataValue.getMappedEventsEventBus();
    if (isEmptyArray(mappedEventsEventBuses)) {
        return "";
    }

    return createMarkdownContent(mappedEventsEventBuses);
};

function createMarkdownContent(mappedEventsEventBuses: MappedEventsEventBus[]): string {
    const eventBusNames: string[] = mappedEventsEventBuses.map(eventBus => eventBus.name);
    const eventBusList: string = mdMakeList(eventBusNames);

    return mdMakeContentBlock(eventBusList, "Event Buses");
}
