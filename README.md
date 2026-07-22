# vd

Next.js frontend for **vd** — a real-time chat app built to practice core WebSocket patterns: chat rooms, typing indicators, and online presence. Pairs with the [vd-backend](https://github.com/mostchakkrit/vd-backend) NestJS API.

## Stack

- Next.js 16 (App Router) + React 19 + Tailwind CSS
- [socket.io-client](https://socket.io/docs/v4/client-api/) for the real-time connection
- `proxy.ts` (Next.js 16's renamed `middleware.ts`) as a route guard for authenticated pages

## Features

- Register / login / logout, JWT stored in an httpOnly cookie
- `proxy.ts` redirects unauthenticated visitors away from `/` and `/chat`
- Chat page: message history on join, real-time messages, typing indicator, online presence — all backed by the NestJS WebSocket gateway
- The WS handshake never touches the httpOnly cookie directly: a same-origin route handler (`/api/socket-token`) reads the cookie server-side and hands the token to the socket client for the connection's `auth` payload

## Setup

```bash
npm install
```

Create a `.env` file:

```
API_URL="http://localhost:4001"
NEXT_PUBLIC_SOCKET_URL="http://localhost:4001"
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
