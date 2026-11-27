> **AI disclosure:** Parts of this project, including documentation and implementation, were created with assistance from AI tools and reviewed/maintained by the repository owner.

# Shopping List Bubble Card

A small Home Assistant Lovelace custom card intended to be placed as a **normal card inside a Bubble Card popup**. It uses a configurable Home Assistant `todo` entity (default: `todo.einkaufsliste`) and Home Assistant theme variables so it sits comfortably alongside Bubble Card.

## Features

- Product search with live suggestions from the entire todo list, including completed entries.
- A first suggestion to add the typed product as a new entry (quantity `1`, unit `Stück`, not completed).
- Selecting an existing entry fills the form; selecting a completed entry prepares it to be reopened when saved.
- Quantity stepper, unit selector (`Stück`, `L`, `mL`, `kg`, `g`) and done checkbox.
- Adds new entries or updates the selected todo item; displays success and error feedback.
- Optional best-effort popup close after a successful operation.

## Shopping-list summary format

The card stores the item in the todo item's `summary`, so it can be translated back into the card form:

| Card value | Todo summary |
| --- | --- |
| Apfel, 1 Stück | `Apfel` |
| Brötchen, 2 Stück | `Brötchen (2x)` |
| Kartoffeln, 2.5 kg | `Kartoffeln (2,5kg)` |
| Milch, 1 L | `Milch (1L)` |

For compatibility, the parser accepts a dot or comma decimal separator and optional whitespace before units. The quantity control accepts decimals so values such as `2.5 kg` remain representable. As requested, one Stück is omitted from the stored summary.

## Install

This repository is the source project. Build the browser-ready module with Node.js 20+:

```sh
npm install
npm run check
npm run build
```

Copy the repository-root `shopping-list-card.js` bundle to your Home Assistant `www` directory, for example:

```sh
mkdir -p /config/www
cp shopping-list-card.js /config/www/shopping-list-card.js
```

In **Settings → Dashboards → Resources**, add `/local/shopping-list-card.js` as a JavaScript module. Then add the card inside your Bubble Card popup using the dashboard card picker, or YAML:

```yaml
 type: custom:ha-shopping-list-bubble-card
 entity: todo.einkaufsliste
 close_popup_on_success: false
```

The card editor also lets you select a `todo` entity and enable popup closing. The entity defaults to `todo.einkaufsliste` in the card stub; it remains configurable.

## Popup closing

Automatic close is opt-in. When enabled, after a successful write the card calls browser history back only if the current URL hash contains `bubble`; otherwise it stays open and shows the success message. Bubble Card's popup routing can differ by dashboard/version, so if your popup does not use a Bubble Card hash, leave this option disabled and use the success feedback.

## Development

Node.js 20 or newer is recommended for local builds and CI.


```sh
npm install
npm run dev
```

The project uses Lit and Vite, emits a single ES module, and keeps styles within the card's shadow DOM. CSS uses Home Assistant and Bubble Card theme variables with standard HA theme fallbacks. It does not create or control a popup; popup layout and configuration belong to the dashboard.


## HACS (custom repository)

The repository is public and can be added in HACS as a custom repository:

1. Open **HACS**, open the top-right menu and select **Custom repositories**.
2. Add `https://github.com/eltroniq/ha-shopping-list-bubble-card` and choose the **Dashboard** category.
3. Install the card and refresh the browser. If HACS does not automatically register the resource, add `/hacsfiles/ha-shopping-list-bubble-card/shopping-list-card.js` as a JavaScript module resource.

The `main` branch bundle is rebuilt automatically after source changes. Tagged releases publish the built JavaScript as a release asset.
