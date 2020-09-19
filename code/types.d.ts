type CssPropertyResolver = {
    property: string
    resolver: (value: number) => number | string
}
