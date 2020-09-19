import * as React from "react"
import {
    Scroll,
    Frame,
    addPropertyControls,
    ControlType,
    RenderTarget,
    useMotionValue,
} from "framer"

import { createControl } from "./utils"
import { AnimatedScrollContext } from "./AnimatedScrollContext"

function AnimatedScrollPreview(props) {
    const [scrollValues] = React.useState({
        scrollX: useMotionValue(0),
        scrollY: useMotionValue(0),
    })
    return (
        <AnimatedScrollContext.Provider value={scrollValues}>
            <Scroll
                contentOffsetX={scrollValues.scrollX}
                contentOffsetY={scrollValues.scrollY}
                direction={props.direction}
                width="100%"
                height="100%"
            >
                {props.content}
            </Scroll>
        </AnimatedScrollContext.Provider>
    )
}

function AnimatedScrollCanvas(props) {
    const backgroundColor = props.content.length
        ? "transparent"
        : "hsla(203, 87%, 50%, 0.5)"

    return props.content.length ? (
        <Scroll width="100%" height="100%" backgroundColor={backgroundColor}>
            {props.content}
        </Scroll>
    ) : (
        <Frame width="100%" height="100%">
            Select Scroll Content"
        </Frame>
    )
}

export function AnimatedScroll(props) {
    const target = RenderTarget.current()
    return target === RenderTarget.preview ? (
        <AnimatedScrollPreview {...props} />
    ) : (
        <AnimatedScrollCanvas {...props} />
    )
}

addPropertyControls(AnimatedScroll, {
    direction: {
        type: ControlType.Enum,
        options: ["vertical", "horizontal"],
        defaultValue: "vertical",
    },
    content: {
        type: ControlType.ComponentInstance,
    },
})
