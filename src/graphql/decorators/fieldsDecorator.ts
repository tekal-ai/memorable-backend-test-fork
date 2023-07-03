import {fieldsMap} from "graphql-fields-list";
import {createParamDecorator} from "type-graphql";

/* Converts Graphql Info into a map with requested Fields */
export function Fields(): ParameterDecorator {
    return createParamDecorator(({info}) => {
        /* Returned dict has false for leafs, and we need it to be true */
        type MapResultKey = boolean | MapResult;
        type MapResult = {[key: string]: MapResultKey};
        const transform = (dict: MapResult) => {
            for (const key in dict) {
                if (dict[key] === false) {
                    dict[key] = true;
                } else {
                    transform(dict[key] as MapResult);
                }
            }
            return dict;
        };

        return transform(fieldsMap(info));
    });
}
