import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

const UNITS = ['Stück', 'L', 'mL', 'kg', 'g'] as const;
type Unit = (typeof UNITS)[number];
type TodoItem = { uid?: string; summary: string; status?: string };
type CardConfig = {
  type: string;
  entity: string;
  close_popup_on_success?: boolean;
};

const UNIT_SUFFIX: Record<Unit, string> = {
  Stück: 'x',
  L: 'L',
  mL: 'mL',
  kg: 'kg',
  g: 'g',
};

function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
}

function parseUnit(value: string): Unit | undefined {
  const unit = normalizeText(value).replace(/[\s._-]/g, '');
  if (unit === 'x' || unit.includes('stuck') || unit.includes('stk') || unit.includes('piece')) return 'Stück';
  if (unit === 'ml' || unit.includes('milliliter') || unit.includes('millilitre')) return 'mL';
  if (unit === 'l' || unit.includes('liter') || unit.includes('litre')) return 'L';
  if (unit === 'kg' || unit.includes('kilogram')) return 'kg';
  if (unit === 'g' || unit.includes('gram')) return 'g';
  return undefined;
}

function parseQuantityBlock(value: string): { count: number; unit: Unit } | undefined {
  // Read the numeric prefix separately; unit spelling and spacing are handled below.
  const quantity = value.trim().match(/^(\d+(?:[.,]\d+)?)/);
  if (!quantity) return undefined;

  const count = Number(quantity[1].replace(',', '.'));
  const unit = parseUnit(value.slice(quantity[0].length));
  if (!Number.isFinite(count) || count <= 0 || !unit) return undefined;
  return { count, unit };
}

function parseSummary(summary: string): { name: string; count: number; unit: Unit } {
  const original = summary.trim();
  if (!original) return { name: '', count: 1, unit: 'Stück' };

  // Preferred format emitted by the card: "Bread (2x)" or "Milk (1L)".
  const openingParenthesis = original.lastIndexOf('(');
  if (openingParenthesis > 0 && original.endsWith(')')) {
    const parsed = parseQuantityBlock(original.slice(openingParenthesis + 1, -1));
    if (parsed) {
      return { name: original.slice(0, openingParenthesis).trim(), ...parsed };
    }
  }

  // Also accept common existing list entries such as "Milk 1 L" or "Potatoes 2.5kg".
  const suffix = original.match(/^(.*\S)\s+(\d+(?:[.,]\d+)?)\s*([^\s]+)$/);
  if (suffix) {
    const parsed = parseQuantityBlock(suffix[2] + suffix[3]);
    if (parsed) return { name: suffix[1].trim(), ...parsed };
  }

  return { name: original, count: 1, unit: 'Stück' };
}

function serializeSummary(name: string, count: number, unit: Unit): string {
  const product = name.trim();
  if (!product) return '';
  if (count === 1 && unit === 'Stück') return product;
  const quantity = Number.isInteger(count) ? String(count) : String(count).replace('.', ',');
  return `${product} (${quantity}${UNIT_SUFFIX[unit]})`;
}

@customElement('hestia-todo-entry-editor')
export class HaShoppingListBubbleCard extends LitElement {
  @property({ attribute: false }) public hass?: any;
  @state() private _config?: CardConfig;
  @state() private _items: TodoItem[] = [];
  @state() private _name = '';
  @state() private _count = 1;
  @state() private _unit: Unit = 'Stück';
  @state() private _unitOpen = false;
  @state() private _done = false;
  @state() private _focused = false;
  @state() private _selectedUid?: string;
  @state() private _loading = false;
  @state() private _feedback = '';
  @state() private _feedbackError = false;
  private _refreshTimer?: number;
  private _onDocumentPointerDown = (event: PointerEvent): void => {
    if (!event.composedPath().includes(this)) this._unitOpen = false;
  };

  public static getStubConfig(): CardConfig {
    return { type: 'custom:hestia-todo-entry-editor', entity: 'todo.einkaufsliste' };
  }

  public setConfig(config: CardConfig): void {
    if (!config.entity) throw new Error('Please configure a todo entity for the todo entry editor.');
    this._config = { close_popup_on_success: false, ...config };
    void this._loadItems();
  }

  public getCardSize(): number { return 4; }

  protected updated(changedProperties: PropertyValues<this>): void {
    // Home Assistant assigns hass after setConfig(); load the list as soon as both exist.
    if (changedProperties.has('hass')) {
      void this._loadItems();
    }
  }

  public connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('pointerdown', this._onDocumentPointerDown);
    this._refreshTimer = window.setInterval(() => void this._loadItems(), 30_000);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('pointerdown', this._onDocumentPointerDown);
    if (this._refreshTimer !== undefined) window.clearInterval(this._refreshTimer);
  }

  private async _callService(service: string, data: Record<string, unknown>): Promise<any> {
    if (!this.hass || !this._config) throw new Error('Home Assistant is not connected.');
    return this.hass.callService('todo', service, { entity_id: this._config.entity, ...data });
  }

  private async _loadItems(): Promise<void> {
    if (!this.hass || !this._config) return;
    try {
      const response = await this.hass.callWS({
        type: 'call_service', domain: 'todo', service: 'get_items',
        service_data: { entity_id: this._config.entity }, return_response: true,
      });
      const entityResult = response?.[this._config.entity]
        ?? response?.response?.[this._config.entity];
      const items = entityResult?.items
        ?? response?.items
        ?? response?.response?.items;
      if (Array.isArray(items)) this._items = items;
      else this._showFeedback('Die Einkaufsliste lieferte keine Einträge zurück.', true);
    } catch (error) {
      this._showFeedback(`Einkaufsliste konnte nicht geladen werden: ${this._errorMessage(error)}`, true);
    }
  }

  private get _matches(): TodoItem[] {
    const term = normalizeText(this._name);
    if (!term) return [];
    return this._items.filter((item) => {
      const summary = String(item.summary ?? '');
      const productName = parseSummary(summary).name;
      return normalizeText(summary).includes(term) || normalizeText(productName).includes(term);
    });
  }

  private _resetForm(): void {
    this._name = '';
    this._count = 1;
    this._unit = 'Stück';
    this._done = false;
    this._selectedUid = undefined;
  }

  private _selectExisting(item: TodoItem): void {
    const parsed = parseSummary(item.summary);
    this._name = parsed.name;
    this._count = parsed.count;
    this._unit = parsed.unit;
    this._done = item.status === 'completed' ? false : false;
    this._selectedUid = item.uid;
    this._focused = false;
    this._feedback = '';
  }

  private _startNew(): void {
    this._count = 1;
    this._unit = 'Stück';
    this._done = false;
    this._selectedUid = undefined;
    this._focused = false;
    this._feedback = '';
  }

  private _changeCount(delta: number): void {
    this._count = Math.max(0.1, Math.round((this._count + delta) * 10) / 10);
  }

  private _showFeedback(message: string, isError = false): void {
    this._feedback = message;
    this._feedbackError = isError;
  }

  private _errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unbekannter Fehler';
  }

  private async _submit(): Promise<void> {
    const summary = serializeSummary(this._name, this._count, this._unit);
    if (!summary || !this._config || this._loading) return;
    this._loading = true;
    this._showFeedback('');
    const updating = Boolean(this._selectedUid);
    try {
      if (this._selectedUid) {
        await this._callService('update_item', {
          item: this._selectedUid,
          rename: summary,
          status: this._done ? 'completed' : 'needs_action',
        });
      } else {
        const before = new Set(this._items.map((item) => item.uid).filter(Boolean));
        await this._callService('add_item', { item: summary });
        if (this._done) {
          await this._loadItems();
          const added = this._items.find((item) => item.uid && !before.has(item.uid) && item.summary === summary);
          if (added?.uid) await this._callService('update_item', { item: added.uid, status: 'completed' });
        }
      }
      await this._loadItems();
      this._resetForm();
      this._showFeedback(updating ? 'Eintrag aktualisiert.' : 'Eintrag hinzugefügt.');
      this._tryClosePopup();
    } catch (error) {
      this._showFeedback(`Aktion fehlgeschlagen: ${this._errorMessage(error)}`, true);
    } finally {
      this._loading = false;
    }
  }

  private _tryClosePopup(): void {
    if (!this._config?.close_popup_on_success) return;
    // Bubble Card closes the active popup when its URL hash is removed.
    if (window.location.hash) window.location.hash = '';
  }

  private _onNameInput(event: Event): void {
    this._name = (event.currentTarget as HTMLInputElement).value;
    this._selectedUid = undefined;
    this._feedback = '';
  }

  protected render() {
    if (!this._config) return nothing;
    const matches = this._matches;
    const actionLabel = this._selectedUid ? 'Aktualisieren' : 'Hinzufügen';
    return html`
      <ha-card>
        <div class="content">
          <div class="search-wrap">
            <label class="visually-hidden" for="product">Produkt</label>
            <input id="product" class="product" type="text" autocomplete="off"
              placeholder="Produkt" .value=${this._name}
              @input=${this._onNameInput} @focus=${() => { this._focused = true; }}
              @blur=${() => window.setTimeout(() => { this._focused = false; }, 140)}
              @keydown=${(event: KeyboardEvent) => { if (event.key === 'Enter' && this._name.trim()) { event.preventDefault(); this.shadowRoot?.querySelector<HTMLButtonElement>('.submit')?.click(); } }} />
            ${this._focused && this._name.trim() ? html`
              <div class="suggestions" role="listbox">
                <button class="suggestion add-suggestion" role="option" @mousedown=${(event: Event) => event.preventDefault()} @click=${this._startNew}>
                  „${this._name.trim()}“ hinzufügen
                </button>
                ${matches.map((item) => html`
                  <button class="suggestion" role="option" @mousedown=${(event: Event) => event.preventDefault()} @click=${() => this._selectExisting(item)}>
                    <span>${item.summary}</span><small>${item.status === 'completed' ? 'Erledigt' : 'Offen'}</small>
                  </button>
                `)}
              </div>` : nothing}
          </div>

          <div class="quantity-row">
            <div class="stepper" aria-label="Menge">
              <button class="step" aria-label="Menge verringern" ?disabled=${this._count <= 0.1} @click=${() => this._changeCount(-1)}>−</button>
              <input class="count" type="number" min="0.1" step="0.1" aria-label="Anzahl"
                .value=${String(this._count)} @input=${(event: Event) => {
                  const value = Number((event.currentTarget as HTMLInputElement).value);
                  if (Number.isFinite(value) && value > 0) this._count = value;
                }} />
              <button class="step" aria-label="Menge erhöhen" @click=${() => this._changeCount(1)}>+</button>
            </div>
            <div class="unit-wrap">
              <button class="unit-trigger" type="button" aria-label="Einheit auswählen"
                aria-haspopup="listbox" aria-expanded=${this._unitOpen}
                @click=${() => { this._unitOpen = !this._unitOpen; }}
                @keydown=${(event: KeyboardEvent) => { if (event.key === 'Escape') this._unitOpen = false; }}>
                <span>${this._unit}</span><span class="unit-chevron" aria-hidden="true"></span>
              </button>
              ${this._unitOpen ? html`
                <div class="unit-menu" role="listbox" aria-label="Einheit">
                  ${UNITS.map((unit) => html`
                    <button class="unit-option" type="button" role="option"
                      aria-selected=${this._unit === unit}
                      @click=${() => { this._unit = unit; this._unitOpen = false; }}>
                      <span>${unit}</span>${this._unit === unit ? html`<span class="unit-check" aria-hidden="true">✓</span>` : nothing}
                    </button>
                  `)}
                </div>` : nothing}
            </div>
          </div>

          <label class="done-row">
            <input type="checkbox" .checked=${this._done}
              @change=${(event: Event) => { this._done = (event.currentTarget as HTMLInputElement).checked; }} />
            <span>Erledigt</span>
          </label>
          <button class="submit" ?disabled=${this._loading || !this._name.trim()} @click=${this._submit}>
            ${this._loading ? 'Wird gespeichert…' : actionLabel}
          </button>
          ${this._feedback ? html`<div class="feedback ${this._feedbackError ? 'error' : 'success'}" role="status">${this._feedback}</div>` : nothing}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
      --shopping-card-radius: var(--bubble-button-border-radius, var(--ha-card-border-radius, 24px));
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, inherit);
    }
    ha-card {
      border: 0;
      border-radius: var(--shopping-card-radius);
      background: var(--bubble-card-background-color, var(--ha-card-background, var(--card-background-color, var(--primary-background-color))));
      box-shadow: var(--bubble-card-box-shadow, var(--ha-card-box-shadow, none));
      overflow: visible;
    }
    .content { display: grid; gap: 14px; padding: 16px; }
    /* Keep the autocomplete above the quantity controls and their dropdown. */
    .search-wrap { position: relative; z-index: 3; }
    input, select, button { font: inherit; color: inherit; }
    .product, .count, .unit-trigger {
      box-sizing: border-box; min-height: 44px; border: 1px solid var(--divider-color);
      border-radius: var(--shopping-card-radius); background: var(--input-fill-color, var(--secondary-background-color));
      padding: 0 14px; outline: none;
    }
    .product { width: 100%; }
    .product:focus, .count:focus, .unit-trigger:focus-visible { border-color: var(--primary-color); }
    .quantity-row { position: relative; z-index: 1; }
    .unit-wrap { position: relative; min-width: 0; z-index: 1; }
    .unit-trigger { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; text-align: left; }
    .unit-chevron { width: 8px; height: 8px; flex: 0 0 auto; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: translateY(-2px) rotate(45deg); opacity: .7; }
    .unit-menu { position: absolute; z-index: 2; top: calc(100% + 6px); left: 0; right: 0; box-sizing: border-box; overflow: hidden; padding: 4px 0; border: 1px solid var(--divider-color); border-radius: 14px; background: var(--card-background-color, var(--primary-background-color)); box-shadow: var(--ha-card-box-shadow, 0 4px 16px #0003); }
    .unit-option { display: flex; box-sizing: border-box; width: 100%; min-height: 42px; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 14px; border: 0; border-radius: 0; background: transparent; text-align: left; cursor: pointer; }
    .unit-option + .unit-option { border-top: 1px solid var(--divider-color); }
    .unit-option:hover, .unit-option[aria-selected="true"] { background: var(--secondary-background-color); }
    .unit-check { color: var(--primary-color); font-weight: 700; }
    .quantity-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(100px, 0.8fr); gap: 10px; }
    .stepper { display: grid; grid-template-columns: 44px minmax(40px, 1fr) 44px; align-items: center; border: 1px solid var(--divider-color); border-radius: var(--shopping-card-radius); overflow: hidden; background: var(--input-fill-color, var(--secondary-background-color)); }
    .count { width: 100%; min-width: 0; border: 0; border-radius: 0; text-align: center; padding: 0 4px; background: transparent; appearance: textfield; }
    .count::-webkit-inner-spin-button, .count::-webkit-outer-spin-button { appearance: none; margin: 0; }
    .step { height: 44px; border: 0; background: transparent; cursor: pointer; color: var(--primary-color); font-size: 22px; }
    .step:hover, .suggestion:hover { background: var(--secondary-background-color); }
    .step:disabled { opacity: .4; cursor: default; }
    .done-row { display: flex; align-items: center; gap: 10px; min-height: 32px; cursor: pointer; }
    .done-row input { width: 18px; height: 18px; accent-color: var(--primary-color); }
    .submit { min-height: 46px; border: 0; border-radius: var(--shopping-card-radius); background: var(--bubble-button-main-background-color, var(--primary-color)); color: var(--bubble-button-main-text-color, var(--text-primary-color, white)); font-weight: 600; cursor: pointer; }
    .submit:disabled { opacity: .55; cursor: wait; }
    .suggestions { position: absolute; top: calc(100% + 6px); left: 0; right: 0; max-height: 260px; overflow-y: auto; border-radius: 16px; background: var(--card-background-color, var(--primary-background-color)); box-shadow: var(--ha-card-box-shadow, 0 4px 16px #0003); padding: 6px; }
    .suggestion { display: flex; width: 100%; justify-content: space-between; align-items: center; gap: 12px; min-height: 42px; border: 0; border-radius: 12px; background: transparent; padding: 8px 12px; text-align: left; cursor: pointer; }
    .suggestion small { color: var(--secondary-text-color); white-space: nowrap; }
    .add-suggestion { font-weight: 600; color: var(--primary-color); }
    .feedback { font-size: .9em; }
    .success { color: var(--success-color, var(--primary-color)); }
    .error { color: var(--error-color, #db4437); }
    .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
  `;
}

@customElement('hestia-todo-entry-editor-editor')
class HaShoppingListBubbleCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: any;
  @state() private _config: Partial<CardConfig> = {};

  public setConfig(config: Partial<CardConfig>): void { this._config = { ...config }; }

  private _entityChanged(event: Event): void {
    const value = (event as CustomEvent).detail?.value;
    this._config = { ...this._config, entity: value };
    this._emitConfig();
  }

  private _closeChanged(event: Event): void {
    this._config = { ...this._config, close_popup_on_success: (event.currentTarget as HTMLInputElement).checked };
    this._emitConfig();
  }

  private _emitConfig(): void {
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true }));
  }

  protected render() {
    return html`<div class="editor">
      <label>Todo-Liste
        <ha-entity-picker .hass=${this.hass} .value=${this._config.entity ?? ''} .includeDomains=${['todo']}
          @value-changed=${this._entityChanged}></ha-entity-picker>
      </label>
      <label class="toggle"><input type="checkbox" .checked=${this._config.close_popup_on_success ?? false} @change=${this._closeChanged} />
        Popup nach erfolgreichem Speichern schließen</label>
    </div>`;
  }

  static styles = css`
    .editor { display: grid; gap: 16px; }
    label { display: grid; gap: 8px; }
    .toggle { display: flex; align-items: center; gap: 8px; }
  `;
}

declare global {
  interface Window { customCards?: Array<Record<string, unknown>>; }
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === 'hestia-todo-entry-editor')) {
  window.customCards.push({
    type: 'hestia-todo-entry-editor',
    name: 'Hestia – Todo Entry Editor',
    description: 'A simple Home Assistant UI for adding and updating todo list entries, making it easy to use any todo list as a shopping list.',
    preview: true,
  });
}
