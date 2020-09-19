import { ControlType } from "framer"
import { PROP_PREFIX } from "./animation_config"
function camelToFriendly(camelCase: string): string {
    return (
        camelCase[0].toUpperCase() +
        camelCase
            .split(/(?=[A-Z])/)
            .join(" ")
            .slice(1)
    )
}

export function createControl(
    title: string,
    type: ControlType,
    options: object = {}
) {
    return {
        [PROP_PREFIX + title]: {
            type: ControlType.Array,
            title: camelToFriendly(title),
            propertyControl: {
                type,
                ...options,
            },
        },
    }
}
