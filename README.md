# Notora

A note-taking web app with notebooks, tags, an archive, a trash view and PIN-locked notes. Sign-in is handled by Clerk.

**Live demo:** https://notora-two.vercel.app/

## Features

- Create and edit notes
- Organise with notebooks and tags
- Search notes
- Archive and restore, with a separate trash view
- Lock notes behind a four-digit PIN
- Sign-up, sign-in and protected routes through Clerk

## Limitations

Notes are stored in the browser's `localStorage`, so they stay on one device and aren't synced. The PIN controls access in the interface and isn't encryption.

## Stack

React, Vite, React Router, Clerk, React Context

## Run it locally

```bash
npm install
npm run dev
```

The app needs a Clerk publishable key in `.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_key
```
