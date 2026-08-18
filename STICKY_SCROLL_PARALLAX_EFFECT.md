# Sticky Scroll Parallax Effect

This document outlines the architecture and implementation of the "Sticky Scroll Parallax" effect used in the `Achievement.tsx` component.

## Overview

The Sticky Scroll Parallax effect creates a dynamic layout where one side of a split view (usually a title or description) remains pinned to the screen while the other side (usually a list of items or cards) scrolls vertically. Once all items have scrolled past, the entire section unpins and resumes normal page scrolling.

## Core Dependencies

- **React**: For component structure and refs.
- **Framer Motion**: Specifically `motion`, `useScroll`, and `useTransform` hooks to track page scroll and animate the sliding column without triggering browser repaints.
- **Tailwind CSS**: For layout utilities, specifically `sticky`, `top-0`, `h-screen`, and `overflow-hidden`.

## Architecture

To achieve this effect, the component is structured in several layers:

### 1. The Scroll Container (Track)
The outermost wrapper defines the total scrollable distance. Its height is artificially extended based on the number of items to scroll.
```tsx
<section
  ref={sectionRef}
  style={{ "--section-height": `${items.length * 100}vh` }}
  className="relative h-[var(--section-height)]"
>
```

### 2. The Sticky Viewport
Inside the track, a `sticky` container locks into the viewport. It spans exactly `100vh` to fill the screen and uses `overflow-hidden` to hide the cards that are out of bounds.
```tsx
<div className="sticky top-0 h-screen overflow-hidden">
```

### 3. The Split Grid
Inside the viewport, a grid layout divides the fixed content from the scrolling content.
```tsx
<div className="grid lg:grid-cols-[1fr_1fr] h-full items-center">
  {/* Left: Fixed Sidebar */}
  <aside className="h-full flex flex-col justify-center">
    ...
  </aside>

  {/* Right: Scrolling Track */}
  <div className="relative h-screen overflow-hidden">
    <motion.div style={{ y: scrollTransformY }}>
       {/* Cards go here */}
    </motion.div>
  </div>
</div>
```

### 4. Framer Motion Scroll Binding
We link the vertical scroll progress of the outermost section (`sectionRef`) to the vertical position (`y`) of the cards wrapper.
```tsx
const sectionRef = useRef<HTMLElement>(null);
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start start", "end end"],
});

// Map scroll progress (0 to 1) to vertical translation (0vh to -N vh)
const scrollTransformY = useTransform(
  scrollYProgress,
  [0, 1],
  ["0vh", `-${(items.length - 1) * 100}vh`]
);
```

## Common Pitfalls & Solutions

1. **Broken Sticky Positioning**: The CSS `sticky` property will fail if any parent container up to the root has `overflow-x: hidden` applied. To fix this, use `overflow-x: clip` globally instead of `hidden`, or remove it entirely from global wrappers like `<main>` and `<body>` if possible.
2. **Mobile Viewports**: True sticky parallax is often disruptive on mobile screens due to varying `100vh` behavior (browser URL bar collapsing/expanding). A responsive fallback that stacks the elements in a normal document flow on screens smaller than `lg` is highly recommended.

## Visual Enhancements

- **Progress Bar**: The `scrollYProgress` value from Framer Motion can be reused to scale a horizontal progress bar in the fixed column to visually indicate to the user how far along the scroll track they are.
```tsx
<motion.div 
  style={{ scaleX: scrollYProgress, transformOrigin: "left" }} 
  className="h-1 bg-black" 
/>
```