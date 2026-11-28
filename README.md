> **AI disclosure:** AI tools assisted with parts of the implementation and documentation. The repository maintainer is responsible for reviewing and maintaining the project.

# Shopping List Bubble Card

[![CI](https://github.com/eltroniq/ha-shopping-list-bubble-card/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/eltroniq/ha-shopping-list-bubble-card/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/eltroniq/ha-shopping-list-bubble-card?display_name=tag)](https://github.com/eltroniq/ha-shopping-list-bubble-card/releases)

A compact Home Assistant Lovelace card for managing a `todo` shopping list. It is designed to fit naturally inside a [Bubble Card](https://github.com/Clooos/Bubble-Card) popup, but it can also be used as a standalone dashboard card.

## Features

- Live suggestions from the selected Home Assistant todo list, including completed entries.
- Add a new product directly from the search field.
- Select an existing entry to edit its name, quantity, unit, or completion state.
- Reopen completed entries by selecting them and saving.
- Decimal quantities and the units `Stück`, `L`, `mL`, `kg`, and `g`.
- Optional best-effort closing of a Bubble Card popup after a successful save.
- Uses Home Assistant theme variables and keeps its styles inside the card's shadow DOM.

## Requirements

- Home Assistant **2024.6.0 or newer**.
- [HACS](https://www.hacs.xyz/) for the recommended installation method.
- A configured Home Assistant `todo` entity, for example `todo.einkaufsliste`.
- [Bubble Card](https://github.com/Clooos/Bubble-Card) is optional. It is only needed if you want to place the card in a Bubble Card popup.

## Installation

### Recommended: HACS

1. Open **HACS** in Home Assistant.
2. Open the menu in the top-right corner and select **Custom repositories**.
3. Add `https://github.com/eltroniq/ha-shopping-list-bubble-card`.
4. Select **Dashboard** as the repository category and add the repository.
5. Find **Shopping List Bubble Card** in HACS and install it.
6. Reload the browser. HACS normally registers the dashboard resource automatically.

If you manage dashboard resources manually (for example, with YAML mode), add the resource path displayed by HACS as a **JavaScript module**. The exact URL can vary with the HACS installation method and Home Assistant version.

### Manual installation

1. Download `shopping-list-card.js` from the [latest GitHub release](https://github.com/eltroniq/ha-shopping-list-bubble-card/releases).
2. Copy it into your Home Assistant `www` directory, for example:

   ```sh
   mkdir -p /config/www
   cp shopping-list-card.js /config/www/shopping-list-card.js
   ```

3. Open **Settings → Dashboards → Resources** and add `/local/shopping-list-card.js` with resource type **JavaScript module**.
4. Reload the browser.

## Configuration

Add the card through the dashboard card picker, or use YAML:

```yaml
type: custom:ha-shopping-list-bubble-card
entity: todo.einkaufsliste
close_popup_on_success: false
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `entity` | string | `todo.einkaufsliste` | Home Assistant todo entity to read and update. |
| `close_popup_on_success` | boolean | `false` | Try to close the active Bubble Card popup after a successful save. |

The visual editor lets you choose a todo entity and toggle popup closing. The entity must exist and support the Home Assistant todo services used by the card.

### Bubble Card popup example

Place the card inside the popup's content. The popup itself is configured by Bubble Card; this card does not create or control the popup.

```yaml
type: vertical-stack
cards:
  - type: custom:bubble-card
    card_type: pop-up
    hash: "#shopping-list"
  - type: custom:ha-shopping-list-bubble-card
    entity: todo.einkaufsliste
    close_popup_on_success: true
```

Popup closing is best-effort and depends on the popup URL/hash behavior in your dashboard. If it does not close as expected, set `close_popup_on_success: false`; the card will still show save feedback.

## Quantity and todo summary format

The quantity and unit are stored in the todo item's `summary` so they remain visible in other todo-list views.

| Card input | Stored todo summary |
| --- | --- |
| Apfel · 1 Stück | `Apfel` |
| Brötchen · 2 Stück | `Brötchen (2x)` |
| Kartoffeln · 2.5 kg | `Kartoffeln (2,5kg)` |
| Milch · 1 L | `Milch (1L)` |

A quantity of one `Stück` is omitted from the summary. Decimal quantities are stored with a comma; existing summaries with either a comma or a dot are understood. The parser also accepts optional spaces (for example `Milch (1 L)`), common unit names/abbreviations (`Stk.`, `Liter`, `ml`, `Kilogramm`, `g`), and trailing quantities without parentheses (for example `Milch 1L`). Product suggestions search both the full summary and the parsed product name, without case or accent sensitivity.

## Troubleshooting

- **The card is not found:** Check that the resource is loaded as a JavaScript module, then hard-refresh the browser.
- **The list does not load:** Verify that the configured entity exists, is a `todo` entity, and that Home Assistant can access it.
- **HACS does not show the repository:** Confirm that the repository URL is correct and that **Dashboard** is selected as its category.
- **The popup does not close:** Disable `close_popup_on_success`. Popup navigation differs between dashboard and Bubble Card versions.

If the problem persists, note that GitHub Issues are intentionally disabled for this personal project. The card is developed primarily for the maintainer's own setup and requirements.

## Development

Requires Node.js 24 (the version used by CI).

```sh
npm install
npm run check
npm run build
```

For watch-mode builds:

```sh
npm run dev
```

The production bundle is generated at `dist/shopping-list-card.js`. GitHub Actions checks source changes and keeps the repository-root bundle up to date. Version tags (`v*`) build the card and attach `shopping-list-card.js` to the corresponding GitHub release. The release workflow can also be run manually to publish or repair the asset for an existing tag.

## Project scope and contributions

This is a personal project, developed primarily for the maintainer's own Home Assistant setup and requirements. GitHub Issues are intentionally disabled; no public issue-based support or feature-request process is offered.

Pull requests are welcome, but acceptance is subject to review and the maintainer's discretion. A pull request may be declined if it does not fit the project's direction, personal requirements, or maintenance capacity. Please describe the proposed change and include testing steps where practical.

