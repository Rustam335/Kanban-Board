# Flow — Kanban Board

A polished, drag-and-drop Kanban board that feels like a real SaaS product. Organize your work across **To Do**, **In Progress**, and **Done** — entirely in your browser, with everything saved to `localStorage`.

## Screenshots

<!-- add screenshot here -->

## Features

- **Drag & drop** — Move cards between columns and reorder within a column, powered by [`@dnd-kit`](https://dndkit.com/) with a smooth drag overlay.
- **Three default columns** — To Do / In Progress / Done out of the box. Add, rename, and delete columns as you like.
- **Rich cards** — Create, edit, and delete cards with a title, optional description, and a color label.
- **Card count badges** — Each column shows how many cards it holds at a glance.
- **Persistent** — Your board is saved to `localStorage` and restored on reload. No account, no backend.
- **Dark mode** — One-tap theme toggle with your preference remembered (and no flash on load).
- **Premium UI** — Subtle shadows, gradients, smooth animations, polished empty states, and a fully responsive layout.
- **Sensible seed data** — Loads with sample cards so the board looks alive on first visit.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@dnd-kit](https://dndkit.com/) (`core`, `sortable`, `modifiers`)

100% client-side — no database, no API keys, no environment variables.

## Getting Started

```bash
yarn install
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Build

```bash
yarn build
```

To run the production build locally:

```bash
yarn start
```

## Deploy

Deploys to [Vercel](https://vercel.com/) with zero configuration — import the repository and Vercel will detect Next.js and build it automatically. Because the app is fully client-side, it also works on any static-friendly host.

## License

[MIT](./LICENSE)
