# BlockWorld Prototype

## Files
- `blockworld_prototype.html` — the game client (open directly in a browser)
- `server.js` + `package.json` — real multiplayer server (Node.js + Socket.io)

## Play offline (no setup)
Just open `blockworld_prototype.html` in a browser. At login, leave
**Server URL** blank and hit Play — you'll get an offline demo with
simulated players (bots) so you can try movement, chat, and the shop.

## Play with real multiplayer
1. Install [Node.js](https://nodejs.org) if you don't have it.
2. In this folder, run:
   ```
   npm install
   npm start
   ```
3. You'll see `BlockWorld server listening on http://localhost:3000`.
4. Open `blockworld_prototype.html` in **two browser tabs** (or two
   devices on the same network, using your computer's local IP instead
   of `localhost`).
5. On the login screen in both tabs, enter `http://localhost:3000` as
   the Server URL and hit Play.
6. Move around in one tab — you'll see the character move live in the
   other tab. Chat messages sync too.

To let friends on the internet join (not just your local network),
deploy `server.js` to a host like Render, Railway, or Fly.io, then use
that public URL as the Server URL instead of localhost.

## What's still missing for a production version
- **Accounts & persistence** — right now names/skins/coins reset on
  refresh, and the server forgets everyone on restart. Add a database
  (Firebase, Supabase, or PlayFab) to save player accounts, inventory,
  and currency permanently.
- **Anti-cheat / server-authoritative movement** — the current server
  trusts whatever position the client sends. A real game validates
  movement server-side.
- **Rooms / world instances** — this server puts everyone in one shared
  space; a full platform would split players into game instances.
- **User-generated games** — Roblox's core feature (players building
  their own games) needs a whole separate creator-studio + scripting
  layer, which is a much bigger project on its own.
