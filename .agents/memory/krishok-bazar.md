---
name: Krishok Bazar App
description: Bengali agricultural e-commerce Expo PWA — architecture decisions, product IDs, admin, design constraints.
---

## Product ID Ranges
- INITIAL_PRODUCTS: IDs 1–26 (in `constants/data.ts`)
- APP2_PRODUCTS: IDs 101–109 (চাল ও মধু, in `constants/data.ts`)
- GITHUB_PRODUCTS: IDs 200–364 (165 products, in `constants/github-products.ts`)
- All merged in AppContext: `[...INITIAL_PRODUCTS, ...APP2_PRODUCTS, ...GITHUB_PRODUCTS]`

## Admin Credentials
- Username: `@Ajzakir2020` / Password: `Ajzakir@2020`
- Secret access: 7-tap on brand logo in MenuDrawer → navigates to `/admin`
- CMS site settings stored in AsyncStorage key `krishok_site_settings_v1`

## Order Statuses (7-step)
`pending | confirmed | processing | packed | shipped | out_for_delivery | delivered`
Admin can update each order status from the Orders tab (tap order to expand → status buttons).

## Categories (12 total)
`all | vege | leafy | fish | fruit | meat | dairy | spice | rice | honey | ready | organic`

## Tab Navigation (5 tabs)
Home → Categories → Cart → Orders → Account

## HeroCarousel Fix
**Why:** FlatList.scrollToIndex causes Invariant Violation on web when scrolling before layout. Fixed by replacing FlatList with overlay approach (position:absolute, opacity switch between slides).

## SplashOverlay Behavior
Shows for 3 seconds then fades out — screenshots captured during splash look blank. This is correct behavior. The overlay is in `components/SplashOverlay.tsx`.

## Key Files
- `constants/data.ts` — source of truth for types/categories/farmers/products
- `constants/github-products.ts` — 165 App-2 products (gallery arrays with 5 Unsplash images)
- `context/AppContext.tsx` — app state (products, cart, orders, farmers, customers)
- `app/admin.tsx` — admin dashboard (orders/farmers/products/settings tabs)
- `components/MenuDrawer.tsx` — right-side drawer (hamburger menu in header)
- `app/product/[id].tsx` — product detail with 5-image gallery
- `components/HeroCarousel.tsx` — auto-sliding carousel (overlay approach, NOT FlatList)

## Delivery Charges
Default: Dhaka=₹60, Outside=₹120, extra ₹30/kg over 5kg. Editable via admin CMS settings tab.

## Farmer Demo Account
Phone: `01700000001` / Password: `1234`

## Design Rule
Keep current design unchanged — the user explicitly said to keep the existing green brand design.
