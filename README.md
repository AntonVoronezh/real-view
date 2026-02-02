# Real View 👁️

[![npm version](https://img.shields.io/npm/v/real-view.svg?style=flat-square)](https://www.npmjs.com/package/real-view)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/real-view?style=flat-square)](https://bundlephobia.com/package/real-view)
[![license](https://img.shields.io/npm/l/real-view?style=flat-square)](LICENSE)
[![Boosty](https://img.shields.io/badge/Support-Boosty-orange?style=flat-square&logo=boosty)](https://boosty.to/antonvoronezh/donate)
[![Crypto](https://img.shields.io/badge/Donate-Crypto-2CA5E0?style=flat-square&logo=telegram&logoColor=white)](https://t.me/AntonVoronezhh/5)

> **Stop guessing. Start knowing.**
> The only visibility tracker that knows if your user *actually* sees the element.

## Why? 🤔

You use `IntersectionObserver` to track impressions. **You are lying to your analytics.**

Native observers fail in these common scenarios:
- ❌ **Occlusion:** A sticky header, modal, or dropdown covers the element.
- ❌ **Opacity:** The element is transparent (`opacity: 0`) or `visibility: hidden`.
- ❌ **Background Tabs:** The user switched tabs or minimized the browser.
- ❌ **Zero Size:** The element collapsed to 0x0 pixels.

**Real View** solves this. It combines `IntersectionObserver` with **DOM Raycasting**, **Computed Styles**, and **Page Visibility API** to guarantee physical visibility.

- **Universal:** First-class support for React, Vue, Svelte, Solid, Angular, and Vanilla.
- **Tiny:** ~1KB gzipped.
- **Smart:** Uses `requestIdleCallback` to prevent main-thread blocking.

---

## Installation 📦

```bash
npm install real-view
# or
pnpm add real-view
# or
yarn add real-view
```

---

## Usage 🚀

### React

Use the `useRealView` hook.

```jsx
import { useEffect } from 'react'
import { useRealView } from 'real-view/react'

const AdBanner = () => {
    const [ref, isVisible] = useRealView({ pollInterval: 1000 })

    useEffect(() => {
        if (isVisible) console.log("User is ACTUALLY looking at this!")
    }, [isVisible])

    return <div ref={ref}>Buy Now</div>
}

```

### Vue 3

Use the `useRealView` composable.

```html
<script setup>
    import { ref } from 'vue'
    import { useRealView } from 'real-view/vue'

    const el = ref(null)
    const isVisible = useRealView(el)
</script>

<template>
    <div ref="el">
        Status: {{ isVisible ? 'SEEN' : 'HIDDEN' }}
    </div>
</template>

```

### Svelte

Use the `realView` action.

```svelte
<script>
  import { realView } from 'real-view/svelte'
  let visible = false;
</script>

<div use:realView={{ onUpdate: (v) => visible = v }}>
  I am {visible ? 'visible' : 'hidden'}
</div>
```

### SolidJS

Use the `realView` directive.

```tsx
iimport { createSignal } from 'solid-js';
import { realView } from 'real-view/solid';

// Typescript: declare module 'solid-js' { namespace JSX { interface Directives { realView: any; } } }

function App() {
    const [visible, setVisible] = createSignal(false);

    return (
        <div use:realView={{ onUpdate: setVisible }}>
            {visible() ? "I see you!" : "Where are you?"}
        </div>
    );
}

```

### Angular (14+)

Use the standalone `RealViewDirective`.

```typescript
import { Component } from '@angular/core';
import { RealViewDirective } from 'real-view/angular';

@Component({
    selector: 'app-tracker',
    standalone: true,
    imports: [RealViewDirective],
    template: `
    <div (realView)="onVisibilityChange($event)">
      Track Me
    </div>
  `
})
export class TrackerComponent {
    onVisibilityChange(isVisible: boolean) {
        console.log('Visibility:', isVisible);
    }
}
```

### Vanilla JS

```js
import { RealView } from 'real-view'

const el = document.querySelector('#banner')

const cleanup = RealView.observe(el, (isVisible) => {
    console.log(isVisible ? 'Visible' : 'Hidden')
})

// Later
// cleanup()
```

---

## Configuration ⚙️

You can customize the strictness of the detection.

```js
// React example
useRealView({
    threshold: 0.5,
    pollInterval: 500,
    trackTab: true
})
```
| Option | Type | Default | Description |
|---|---|---|---|
| `threshold` | `number` | `0` | How much of the element must be in viewport (0.0 - 1.0). |
| `pollInterval` | `number` | `1000` | How often (in ms) to check for occlusion (z-index). |
| `trackTab` | `boolean` | `true` | If `true`, reports `false` when user switches browser tabs. |

---

## How it works 🧊

Real View uses a **"Lazy Raycasting"** architecture to keep performance high:

1. **Gatekeeper:** It uses `IntersectionObserver` first. If the element is off-screen, the CPU usage is **0%**.
2. **Raycasting:** Once on-screen, it fires a ray (`document.elementFromPoint`) at the center of your element. If the ray hits a modal, a sticky header, or a dropdown menu instead of your element, visibility is `false`.
3. **Style Audit:** It recursively checks `opacity`, `visibility`, and `display` up the DOM tree.
4. **Tab Hygiene:** It listens to the Page Visibility API to pause tracking when the tab is backgrounded.

## Support the project ❤️
> "We eliminated the lying `IntersectionObserver` reports, saved your analytics from counting impressions hidden behind sticky headers, and absorbed the manual DOM raycasting nightmare. You saved dozens of hours not writing complex visibility logic that would have killed your main thread anyway. **Your donation** is a fair trade for honest data and weekends free from debugging occlusion."

If this library saved you time, please consider supporting the development:

1.  **Fiat (Cards/PayPal):** via **[Boosty](https://boosty.to/antonvoronezh/donate)** (one-time or monthly).
2.  **Crypto (USDT/TON/BTC/ETH):** view wallet addresses on **[Telegram](https://t.me/AntonVoronezhh/5)**.

<div style="display: flex; gap: 10px;">
  <a href="https://boosty.to/antonvoronezh/donate">
    <img src="https://img.shields.io/badge/Support_on-Boosty-orange?style=for-the-badge&logo=boosty" alt="Support on Boosty">
  </a>
  <a href="https://t.me/AntonVoronezhh/5">
    <img src="https://img.shields.io/badge/Crypto_via-Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Crypto via Telegram">
  </a>
</div>


## License

MIT

## Keywords
`visibility` `viewport` `intersection` `occlusion` `tracking` `analytics` `impression` `react` `vue` `svelte` `angular` `solid` `dom` `monitor` `viewability`

