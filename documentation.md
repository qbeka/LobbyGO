# LobbyGO — Full Project Documentation

**Platforms:** iOS and Android
**Client:** React Native + Expo (TypeScript)
**Backend:** Supabase (Postgres, Auth, Realtime, Edge Functions). No separate Node service.
**Push:** Expo Notifications
**Telemetry:** PostHog, Sentry
**Accounts:** Required for actions. Browsing is open. Auth via Apple or Google only.
**Stored user fields:** `trainer_name`, `friend_code`, `team`, `level`.

---

## 1) Scope and rules

* Two raid paths: **Queue** and **Live Raids**.
* One destination: **Party Screen** with chat.
* Lock to Party Screen after hosting or joining.
* On join, show **Host Friend Code** gate first: Copy code, tap **Added Host**. Then enter Party.
* Kick joiners who do not tap **Added Host** within **120 seconds**.
* Host may set **Additional Trainers** count to reflect off-app participants.
* No ETA display for queue.
* No region filter.
* No avatars.
* No user rating system.
* Trading marketplace included. It supports listings, filters, and “can fly” flag.
* Admin will manually maintain raid bosses list with clean JSON and sprites.

---

## 2) IA and navigation

Bottom tabs:

1. **Home**
2. **Parties** (shows current party if any, else disabled state)
3. **My Raids**
4. **Trade**
5. **Profile**

A persistent **Party pill** floats above the tab bar when a party is active. Tapping it routes to the active Party Screen.

---

## 3) Screens and UX

### 3.1 Home

**Segmented header:** Queue | Live Raids. Persist last choice.

#### Queue view

* Boss chips. Filters: Tier, Mega/Max.
* Primary button: **Join Queue**.
* When queued: show a **Ticket Card** with your boss, your place label “In line”, and **Cancel**. No ETA.
* When matched: push notification and in-app banner. Tap takes user to the **Host Friend Code gate**.

#### Live Raids view

* Vertical list of raid cards sorted by time left.
* Card content: boss sprite, boss name, tier, slots “7/10”, countdown.
* Buttons: **Join** and **Host** (top right).
* Filters panel: Tier, Mega/Max only. Search by boss name.

### 3.2 Host flow

Entry points: **Host** button in Queue or Live.

Form:

* Boss selector.
* Mode: Queue or Live (defaults to current segment).
* **Additional Trainers**: number input (0–9).
* Optional notes.

Submit → navigate to **Party Screen**. Host appears as **Member 1**. Roster shows only host until others join. The party is locked and visible.

### 3.3 Join flow

From Queue:

* When matched → show **Friend Code Gate**:

  * Large **friend code** text, **Copy** button, **Added Host** button.
  * Info line: “Tap Added Host after you send a friend request.”
  * 120-second countdown indicator.
  * If timer expires → auto-leave and return user to previous screen with toast “Timed out. Join again.”

From Live Raids:

* Tap **Join** → same **Friend Code Gate** as above.
* After **Added Host**, route to **Party Screen**.

### 3.4 Party Screen

Layout modeled on your screenshot, plus chat below list.

* **Header bar:** boss icon + name. Menu for party actions (Leave party, Report).
* **Roster list:** rows with level badge at left, `trainer_name`, and status at right.

  * Status values: `Host`, `Joined` (blue), `Ready` (green), `Not Ready` (gray).
  * A thin divider separates groups of five for clarity when 10+.
* **Additional Trainers:** line item below roster: “Additional Trainers: N”.
* **Status block** under roster: plain text status (e.g., “Lobby filling” or “Waiting for everyone to add host and get ready.”).
* **Chat panel** below status: message list + input.
* **No dynamic UI states.** No animations needed beyond default transitions.
* **Ready logic:**

  * On Friend Code gate, tapping **Added Host** sets your member state to `Ready`.
  * Users who entered Party without tapping **Added Host** show `Not Ready`.
* **Kicks:** server removes any `Not Ready` member at 120 seconds from their join time. Party list updates in realtime.

### 3.5 My Raids

* Two tabs: **Joined** and **Hosted**.
* Each row: boss, date, outcome tag (`Started`, `Abandoned`).
* Tapping a row opens a read-only summary: members, timestamps, notes.

### 3.6 Trade

**Segmented header:** Listings | Create.

#### Listings

* Default sort: most recent first.
* Search bar with two scoped pickers: **Offering**, **Looking For**.

  * Either can be blank.
  * Example: set `Offering=Mewtwo`, `Looking For=Kyogre` to find direct swaps.
  * Example: set `Looking For=Mewtwo` only to find users who want Mewtwo.
* Filters:

  * **Can Fly** (Yes/No/Any)
  * **Friendship Level target** (None, Good, Great, Ultra, Best)
  * **Registered** (Registered or Unregistered)
* Listing card:

  * Poster `trainer_name`
  * Offering list
  * Looking For list
  * Badges: Can Fly, Registered/Unregistered, Friendship target
  * Buttons: **Message** and **Propose Trade**
* Trade details screen: shows full terms and a simple message thread between the two users.

#### Create Listing

Fields:

* **Offering**: 1–6 Pokémon names.
* **Looking For**: 1–6 Pokémon names.
* **Can Fly**: toggle.
* **Registered**: Registered or Unregistered.
* **Friendship plan**: None or target level (Good, Great, Ultra, Best).
* **Notes**: optional.

Submit → listing appears at top of Listings.

**Notes:** The app does not change player location. “Can Fly” is self-declared. The app stores and displays the flag only.

### 3.7 Profile

* Fields: `trainer_name` (edit), `friend_code` (edit), `level` (edit), `team` (locked after creation).
* Toggles: notifications for queue match, party mentions.
* Legal and support.
* Sign out and delete account.

---

## 4) Data, configuration, and admin

### 4.1 Boss catalog (manual)

Simple JSON in `assets/raid_bosses.json`. Example:

```json
[
  {
    "id": "eternatus_max",
    "name": "Eternamax Eternatus",
    "tier": "Max",
    "raid_type": "Max",
    "catch_cp_100_no_weather": 2435,
    "catch_cp_100_weather": 2530,
    "sprite": "assets/sprites/eternamax.png",
    "aliases": ["Eternamax", "Eternatus Max"]
  },
  {
    "id": "charizard_gmax",
    "name": "G-max Charizard",
    "tier": "5",
    "raid_type": "G-max",
    "catch_cp_100_no_weather": 1651,
    "catch_cp_100_weather": 2064,
    "sprite": "assets/sprites/charizard_gmax.png",
    "aliases": ["Gmax Charizard"]
  }
]
```

Expose a small in-app Admin screen (dev build only) that reloads this JSON without a client rebuild. Future: host JSON at a signed URL and cache it on device.

### 4.2 Data model (Postgres)

```sql
-- users
id uuid pk
auth_id text unique
trainer_name text not null
friend_code text not null
team text not null check (team in ('Mystic','Valor','Instinct'))
level int not null check (level between 1 and 50)
created_at timestamptz default now()

-- parties
id uuid pk
mode text not null check (mode in ('queue','live'))
boss_id text not null
host_user_id uuid not null references users(id)
max_size int not null check (max_size between 1 and 20)
additional_trainers int not null default 0
status text not null check (status in ('open','active','closed'))
created_at timestamptz default now()
closed_at timestamptz

-- party_members
party_id uuid references parties(id) on delete cascade
user_id uuid references users(id)
role text not null check (role in ('host','guest'))
state text not null check (state in ('joined','ready','kicked','left'))
joined_at timestamptz default now()
primary key (party_id, user_id)

-- messages (party chat)
id uuid pk
party_id uuid references parties(id) on delete cascade
user_id uuid references users(id)
text text not null
sent_at timestamptz default now()

-- queue tickets
id uuid pk
user_id uuid references users(id)
boss_id text not null
status text not null check (status in ('waiting','matched','consumed','cancelled','expired'))
created_at timestamptz default now()
matched_at timestamptz

-- trades
id uuid pk
poster_id uuid references users(id)
offering jsonb not null          -- array of pokemon names
looking_for jsonb not null       -- array of pokemon names
can_fly boolean not null default false
registered text not null check (registered in ('Registered','Unregistered'))
friendship_target text not null check (friendship_target in ('None','Good','Great','Ultra','Best'))
notes text
status text not null default 'open' check (status in ('open','active','closed'))
created_at timestamptz default now()

-- trade_messages (thread per listing)
id uuid pk
trade_id uuid references trades(id) on delete cascade
user_id uuid references users(id)
text text not null
sent_at timestamptz default now()
```

Indexes:

* `idx_parties_boss_status` on `(boss_id, status)`
* `idx_queue_user_status` on `(user_id, status)`
* `idx_trades_status_created` on `(status, created_at desc)`
* GIN on `trades.offering` and `trades.looking_for` for array search.

RLS:

* Public read for party lists and boss catalog views.
* Auth required for party membership, messages, trades create and message.

---

## 5) API surface

All responses JSON. JWT required on writes. Implement as **Supabase Edge Functions**. Client calls `/functions/v1/{name}` with the same semantics.

**Auth**

* `POST /auth/link` → upsert user with `trainer_name`, `friend_code`, `level`, `team`.

**Bosses**

* `GET /bosses` → serve cached `raid_bosses.json`.

**Queue**

* `POST /queue/join` `{ boss_id }` → create ticket.
* `POST /queue/cancel` `{ ticket_id }`
* `GET /queue/me` → list active tickets for user (no ETA).
* Server side matcher pairs tickets with hosts in queue mode.

**Parties**

* `POST /party` `{ mode, boss_id, max_size, additional_trainers }` → create party and add host.
* `POST /party/:id/join` → create `party_members` row with `state='joined'` and start 120s timer.
* `POST /party/:id/added-host` → set `state='ready'` for caller.
* `POST /party/:id/leave`
* `POST /party/:id/close` (host only)
* `GET /parties` query: `boss`, `mode`, `status=open`, `limit`, `offset`
* `GET /party/:id` → roster and summary.

**Messages**

* `POST /party/:id/message` `{ text }`
* Realtime channel: `party:{id}` for new members, state updates, and messages.

**Trades**

* `GET /trades` query: `offering[]=..`, `looking_for[]=..`, `can_fly`, `friendship_target`, `registered`, `status=open`
* `POST /trades` create listing
* `POST /trades/:id/message`
* `POST /trades/:id/close` (poster only)

**Kicker**

* Scheduler checks `party_members` with `state='joined'` older than 120s and removes them. Emits event.

---

## 6) Realtime channels

* `list:parties` → compact deltas when a party opens, closes, or member counts change.
* `party:{party_id}` → membership changes, messages, kicks.
* `trade:{trade_id}` → messages thread.

Payloads are minimal: ids and changed fields.

---

## 7) Client architecture

* State: Zustand or Redux Toolkit.
* Query layer: React Query for edge calls and optimistic updates.
* Realtime: Supabase Realtime subscriptions per active party and list.
* Navigation: React Navigation 7 with deep links:

  * `raidlink://party/{id}`
  * `raidlink://trade/{id}`

Offline:

* Cache bosses JSON and last seen lists.
* Queue chat sends when back online.

---

## 8) UI specs and acceptance criteria

### Party Screen

* Shows host as first row labeled **Host**.
* Displays members in join order.
* Shows **Additional Trainers: N** below roster.
* Status block text present at all times.
* Chat below roster. Input always visible.
* If user was just joined and has not tapped **Added Host** at gate, they must not reach Party.
* Kick after 120 seconds if user is not `ready`. Removal appears in roster within 300 ms.
* No avatars. Only level badge, name, and status.

### Friend Code Gate

* Displays host code large.
* **Copy** copies code to clipboard with toast “Copied”.
* **Added Host** sets user `ready` and routes to Party.
* 120-second visible timer. When it hits zero, show “Timed out. Try again.”

### Queue

* No ETA anywhere.
* Cancel works instantly.
* When matched, tapping push opens Friend Code Gate.

### Live Raids

* Pressing **Join** opens Friend Code Gate.
* If party filled before gate loads, show “Party full” and stay on list.

### Trades

* Search bar supports:

  * Offering list search
  * Looking For list search
* Filters apply together.
* Listing card badges visible for **Can Fly**, **Registered**, **Friendship**.
* Create form validates at least one entry in Offering or Looking For.

### My Raids

* Show Hosted and Joined lists.
* Each item has a minimal summary.
* No edit. Read-only history.

---

## 9) Notifications

* Queue matched → deep links to Friend Code Gate.
* Mention in party chat → deep links to Party.
* Trade message on your listing → deep links to listing thread.

Users can toggle each in Profile.

---

## 10) Moderation and safety

* Chat filter removes slurs and obvious abuse.
* Users can mute or block others.
* Report flow on Party and Trade detail.
* Rate limits:

  * Party create: 10 per hour, only 1 party active at a time.
  * Messages: 10 per minute per party.
  * Trade create: 1 per day.

The app does not alter user location and does not integrate with Pokémon GO. “Can Fly” is a self-declared flag only.

---

## 11) Performance targets

* Party membership update broadcast within 300 ms p95.
* Chat send to echo under 200 ms p95.
* Home list first paint under 500 ms on mid-range Android.
* Boss catalog load under 100 ms from cache.

---

## 12) Testing matrix

* Unit: queue join, party join, 120-sec kick, added-host transition, trade filters.
* E2E (Detox): Host, two joiners, one fails “Added Host” and gets removed.
* Realtime: subscribe, receive member adds, kicks, messages.
* Auth: Apple on iOS, Google on both.
* Push: deep links open the right gate or party.

---

## 13) Analytics

* Events: `view_home`, `queue_join`, `queue_match`, `friend_gate_open`, `added_host_tap`, `kick_120s`, `party_message`, `party_start`, `trade_create`, `trade_filter`, `trade_message`.
* Funnels:

  * Browse → Join → Friend Gate → Added Host → Party
  * Listings filter → Message seller → Close trade

---

## 14) Build and deploy

* Single Expo app plus Supabase project. No Node service.
* Env via `.env` and Expo config plugin.
* CI: GitHub Actions. Lint, typecheck, unit tests, Detox on PR.
* Supabase Edge Functions deploy via CLI. Use **Supabase Scheduler** for match and kick.
* Expo EAS builds for iOS and Android.

---

## 15) Copy deck

* Friend Gate title: “Add the host in Pokémon GO”
* Copy button toast: “Copied”
* Added Host button: “Added Host”
* Kick toast: “Timed out. Try again.”
* Party status lines:

  * “Lobby filling.”
  * “Waiting for everyone to add host and get ready.”

---

## 16) Privacy

* Store only the four trainer fields.
* Delete account removes user, tickets, memberships, messages, trades.
* Log IPs only for abuse mitigation. Retain 14 days.

---

## 17) Developer notes

* Keep bosses JSON flat and human-editable.
* Keep client components dumb. All kick logic runs server-side.
* Do not render avatars. Keep rows simple to match the screenshot.
* Use plain colors: black text, green `Ready`, blue `Joined`, gray `Not Ready`, green `Host`.

---

## 18) Example payloads

**Create party**

```json
{
  "mode": "live",
  "boss_id": "eternatus_max",
  "max_size": 10,
  "additional_trainers": 1
}
```

**Join party response (to show Friend Gate)**

```json
{
  "party_id": "f5e9...",
  "host_friend_code": "4362 7692 2723",
  "deadline_epoch": 1724467200
}
```

**Added host**

```json
{ "state": "ready" }
```

**Trade listing**

```json
{
  "offering": ["Kyogre", "Groudon"],
  "looking_for": ["Mewtwo"],
  "can_fly": true,
  "registered": "Unregistered",
  "friendship_target": "Ultra",
  "notes": "Flexible on IVs"
}
```

**Trades search query**

```
GET /trades?offering=Mewtwo&looking_for=Kyogre&can_fly=true&registered=Unregistered&friendship_target=Ultra
```

---

## 19) Done criteria

* You can browse raids without signing in.
* Any action prompts Apple or Google sign in.
* Hosting locks you to Party as Member 1.
* Joining shows Friend Code Gate. **Added Host** moves you to Party.
* 120-second kick of non-ready joiners works.
* Additional Trainers displays on Party.
* My Raids lists hosted and joined history.
* Trading supports create, search, filters, and messaging.
* Bosses list is driven entirely by the JSON and sprites you supply.
