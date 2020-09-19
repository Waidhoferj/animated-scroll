import * as React from "react"
import {
    Frame,
    addPropertyControls,
    ControlType,
    transform,
    RenderTarget,
} from "framer"

import { createControl } from "./utils"
import { PROP_PREFIX } from "./animation_config"
import { AnimatedScrollContext } from "./AnimatedScrollContext"

const unitlessPropNames = ["opacity", "scale", "scaleX", "scaleY"]
const pixelPropNames = ["translateX", "translateY", "blur"]
const percentPropNames = ["invert", "grayscale", "contrast"]
const degreePropNames = [
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY",
    "hueRotate",
]
const colorValues = ["backgroundColor", "borderColor", "color"]
const emValues = ["lineHeight"]

const animatablePropNames = [
    ...unitlessPropNames,
    ...pixelPropNames,
    ...degreePropNames,
]

function createAnimationControls(): object {
    const animatableList = [
        ...pixelPropNames.map((title) =>
            createControl(title, ControlType.Number, { unit: "px" })
        ),
        ...percentPropNames.map((title) =>
            createControl(title, ControlType.Number, { unit: "%" })
        ),
        ...unitlessPropNames.map((title) =>
            createControl(title, ControlType.Number)
        ),
        ...degreePropNames.map((title) =>
            createControl(title, ControlType.Number, {
                unit: "deg",
                min: 0,
                max: 360,
            })
        ),
    ]
    return animatableList.reduce((props, prop) => {
        Object.assign(props, prop)
        return props
    }, {})
}

const propertyResolver: { [cssFunction: string]: CssPropertyResolver } = {
    opacity: {
        property: "opacity",
        resolver: (val) => val,
    },
    translateX: {
        property: "transform",
        resolver: (val) => `translateX(${val}px)`,
    },
    translateY: {
        property: "transform",
        resolver: (val) => `translateY(${val}px)`,
    },
    scale: { property: "transform", resolver: (val) => `scale(${val})` },
    scaleX: { property: "transform", resolver: (val) => `scaleX(${val})` },
    scaleY: { property: "transform", resolver: (val) => `scaleY(${val})` },
    rotate: { property: "transform", resolver: (val) => `rotate(${val}deg)` },
    rotateX: { property: "transform", resolver: (val) => `rotateX(${val}deg)` },
    rotateY: { property: "transform", resolver: (val) => `rotateY(${val}deg)` },
    rotateZ: { property: "transform", resolver: (val) => `rotateZ(${val}deg)` },
    skew: { property: "transform", resolver: (val) => `skew(${val}deg)` },
    skewX: { property: "transform", resolver: (val) => `skewX(${val}deg)` },
    skewY: { property: "transform", resolver: (val) => `skewY(${val}deg)` },
    blur: { property: "filter", resolver: (val) => `blur(${val}px)` },
    contrast: { property: "filter", resolver: (val) => `contrast(${val}%)` },
    grayscale: { property: "filter", resolver: (val) => `grayscale(${val}%)` },
    hueRotate: {
        property: "filter",
        resolver: (val) => `hue-rotate(${val}deg)`,
    },
    invert: { property: "filter", resolver: (val) => `invert(${val}%)` },
}

const getAnimatedProps: (props: object) => object = (props) =>
    Object.keys(props)
        .filter((prop) => prop.startsWith(PROP_PREFIX))
        .reduce(
            (
                animProps: { [name: string]: Array<number | string> },
                title: string
            ) => {
                const parsedTitle = title.slice(PROP_PREFIX.length)
                const propMap = propertyResolver[parsedTitle]
                const values = props[title].map(propMap.resolver)
                if (values.length > 0) {
                    if (animProps[propMap.property]) {
                        let smaller =
                            animProps[propMap.property] > values
                                ? values
                                : animProps[propMap.property]
                        let larger =
                            animProps[propMap.property] < values
                                ? values
                                : animProps[propMap.property]
                        animProps[propMap.property] = larger.map(
                            (val, i) =>
                                val +
                                " " +
                                smaller[Math.min(smaller.length - 1, i)]
                        )
                    } else {
                        animProps[propMap.property] = values
                    }
                }

                return animProps
            },
            {}
        )

function ScrollAnimatedLayerPreview(props) {
    const { children, scrollAxis, ...rest } = props
    const el = React.useRef<HTMLElement>()
    const [animation, setAnimation] = React.useState<Animation>()
    const [offset, setOffset] = React.useState(0)
    React.useEffect(() => {
        if (!el.current) return
        const animatedProps = getAnimatedProps(
            props
        ) as PropertyIndexedKeyframes
        console.log("animatedProps", animatedProps)
        const anim = el.current.animate(animatedProps, 1001)
        anim.pause()
        setOffset(el.current.getBoundingClientRect().y)
        setAnimation(anim)
        return () => el.current.getAnimations().forEach((anim) => anim.cancel())
    }, [el])

    const containerScroll = React.useContext(AnimatedScrollContext)
    const scroll =
        scrollAxis === "x" ? containerScroll.scrollX : containerScroll.scrollY
    console.log({ scroll })

    React.useEffect(
        () =>
            scroll.onChange((val) => {
                //Scroll y offset is currently negative
                val = -val
                const p = transform(
                    val,
                    [props.from + offset, props.to + offset],
                    [0, 1000]
                )
                animation.currentTime = p
            }),
        [animation, offset]
    )

    return (
        <>
            <Frame ref={el} backgroundColor={"transparent"} {...rest}>
                {children}
            </Frame>
        </>
    )
}

function AnimationBorder(props) {
    const { children, top, left, ...rest } = props
    const sizing = {
        [top ? "width" : "height"]: "100%",
        [top ? "height" : "width"]: 2,
    }
    return (
        <Frame
            left={left || 0}
            top={top || 0}
            height={2}
            borderRadius={6}
            opacity={0.7}
            backgroundColor={"gray"}
            {...sizing}
            {...rest}
        >
            {children}
        </Frame>
    )
}

function ScrollAnimatedLayerCanvas(props) {
    const {
        children,
        animationBorders: showBorders,
        from,
        to,
        scrollAxis,
        ...rest
    } = props
    const backgroundColor = children.length
        ? "transparent"
        : "hsla(203, 87%, 50%, 0.5)"
    const borderDirection = scrollAxis === "x" ? "left" : "top"
    const fromProps = { [borderDirection]: from }
    const toProps = { [borderDirection]: to }
    const animationBorders = (
        <>
            <AnimationBorder {...fromProps} />
            <AnimationBorder {...toProps} />
        </>
    )
    return (
        <>
            {showBorders && animationBorders}
            <Frame {...rest} backgroundColor={backgroundColor}>
                {!children.length && "Link a Layer to Parallax"}
                {children}
            </Frame>
        </>
    )
}

export function ScrollAnimatedLayer(props) {
    const { children, ...rest } = props
    const target = RenderTarget.current()

    return target === RenderTarget.preview ? (
        <ScrollAnimatedLayerPreview {...rest}>
            {children}
        </ScrollAnimatedLayerPreview>
    ) : (
        <ScrollAnimatedLayerCanvas {...rest}>
            {children}
        </ScrollAnimatedLayerCanvas>
    )
}

ScrollAnimatedLayer.defaultProps = {
    from: -100,
    to: -50,
    axis: "x",
    easing: "linear",
    animationBorders: true,
}

// Learn more: https://framer.com/api/property-controls/
addPropertyControls(ScrollAnimatedLayer, {
    children: {
        type: ControlType.ComponentInstance,
    },
    scrollAxis: {
        title: "Axis",
        type: ControlType.Enum,
        options: ["x", "y"],
        defaultValue: "y",
    },
    from: {
        type: ControlType.Number,
        defaultValue: -100,
        min: -750,
        max: 500,
        unit: "px",
        step: 0.1,
    },

    to: {
        type: ControlType.Number,
        defaultValue: -50,
        min: -750,
        max: 500,
        unit: "px",
        step: 0.1,
    },
    animationBorders: {
        type: ControlType.Boolean,
        title: "Bounds",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    ...createAnimationControls(),
})
