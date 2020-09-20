# Animated Scroll

A Framer package for tieing complex css animations to scroll position. Features include:

- Applying multiple properties and keyframes to a single layer.
- Tween transform and filter properties to create cool effects.
- Helpful animation guides that visually indicate where the animation will begin and end.
- Chaining scroll animations for enter/exit transitions.

## Getting Started

**Hook everything up**

1. Add a AnimatedScroll component to your canvas and size it to your desired viewport.
2. Link AnimatedScroll to the full length page you are designing.
3. On your page, place a ScrollAnimatedLayer component at the location of each animated element.
4. Link each ScrollAnimatedLayer to its corresponding element. Each linked element should be placed in its own separate Frame.

**Now its time to create an awesome animation**

1. Click on the ScrollAnimatedLayer to open the component menu.
2. Specify the start (From) and end (To) of the animation. The animation borders will update when you change these values, allowing you to position animations without opening preview.
3. Click on any of the listed properties to add a keyframe.
   - A single keyframe will create a tween from the current property value to the specified keyframe value.
   - With two or more keyframes, the values of the first keyframe will be immediately applied.
4. Preview the AnimatedScroll component to see your animations in action.

## Component Options

### AnimatedScroll

| Property  | Definition                                                                                                            |
| --------- | --------------------------------------------------------------------------------------------------------------------- |
| Direction | Scroll direction of the layer. This property should match the `axis` specified on the ScrollAnimatedLayer.            |
| Content   | The target page to scroll. The page should contain ScrollAnimatedLayers which will control the individual animations. |

### ScrollAnimatedLayer

| Property             | Definition                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| Children             | Contents of the animation layer.                                                                              |
| Axis                 | The scroll direction reference for playing the animation.                                                     |
| From                 | The point where the animation begins. Measured as an offset from the top of the layer in pixels.              |
| To                   | The point where the animation begins. Measured as an offset from the top of the layer in pixels.              |
| Bounds               | Toggles visibility of the animation borders.                                                                  |
| Animation Properties | Each of the properties can contain several keyframes. Keyframes play in order from top to bottom of the list. |
