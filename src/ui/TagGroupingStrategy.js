import { GroupingStrategy } from "./GroupingStrategy";

export class TagGroupingStrategy
    extends GroupingStrategy {

    getGroupKey(node) {
        return node.tag;
    }
}