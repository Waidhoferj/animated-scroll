import { createContext } from "react"

import { motionValue } from "framer"

export const AnimatedScrollContext = createContext({
    scrollX: motionValue(0),
    scrollY: motionValue(0),
})
