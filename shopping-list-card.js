/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, B = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, F = Symbol(), K = /* @__PURE__ */ new WeakMap();
let ct = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== F) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (B && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = K.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && K.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ft = (i) => new ct(typeof i == "string" ? i : i + "", void 0, F), lt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[o + 1], i[0]);
  return new ct(e, i, F);
}, gt = (i, t) => {
  if (B) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = H.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, Q = B ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ft(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: mt, defineProperty: $t, getOwnPropertyDescriptor: bt, getOwnPropertyNames: yt, getOwnPropertySymbols: vt, getPrototypeOf: At } = Object, I = globalThis, X = I.trustedTypes, wt = X ? X.emptyScript : "", xt = I.reactiveElementPolyfillSupport, C = (i, t) => i, L = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? wt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, q = (i, t) => !mt(i, t), G = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: q };
Symbol.metadata ??= Symbol("metadata"), I.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = G) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && $t(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: o } = bt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: r, set(n) {
      const c = r?.call(this);
      o?.call(this, n), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? G;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = At(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, s = [...yt(e), ...vt(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(Q(r));
    } else t !== void 0 && e.push(Q(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return gt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : L).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : L;
      this._$Em = r;
      const c = n.fromAttribute(e, o.type);
      this[r] = c ?? this._$Ej?.get(r) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? q)(o, e) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: n } = o, c = this[r];
        n !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, o, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[C("elementProperties")] = /* @__PURE__ */ new Map(), A[C("finalized")] = /* @__PURE__ */ new Map(), xt?.({ ReactiveElement: A }), (I.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, Y = (i) => i, z = W.trustedTypes, tt = z ? z.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, ht = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, dt = "?" + $, St = `<${dt}>`, v = document, P = () => v.createComment(""), U = (i) => i === null || typeof i != "object" && typeof i != "function", V = Array.isArray, Et = (i) => V(i) || typeof i?.[Symbol.iterator] == "function", j = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, et = /-->/g, st = />/g, b = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), it = /'/g, rt = /"/g, ut = /^(?:script|style|textarea|title)$/i, kt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), w = kt(1), S = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), ot = /* @__PURE__ */ new WeakMap(), y = v.createTreeWalker(v, 129);
function pt(i, t) {
  if (!V(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tt !== void 0 ? tt.createHTML(t) : t;
}
const Ct = (i, t) => {
  const e = i.length - 1, s = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = k;
  for (let c = 0; c < e; c++) {
    const a = i[c];
    let d, u, l = -1, g = 0;
    for (; g < a.length && (n.lastIndex = g, u = n.exec(a), u !== null); ) g = n.lastIndex, n === k ? u[1] === "!--" ? n = et : u[1] !== void 0 ? n = st : u[2] !== void 0 ? (ut.test(u[2]) && (r = RegExp("</" + u[2], "g")), n = b) : u[3] !== void 0 && (n = b) : n === b ? u[0] === ">" ? (n = r ?? k, l = -1) : u[1] === void 0 ? l = -2 : (l = n.lastIndex - u[2].length, d = u[1], n = u[3] === void 0 ? b : u[3] === '"' ? rt : it) : n === rt || n === it ? n = b : n === et || n === st ? n = k : (n = b, r = void 0);
    const m = n === b && i[c + 1].startsWith("/>") ? " " : "";
    o += n === k ? a + St : l >= 0 ? (s.push(d), a.slice(0, l) + ht + a.slice(l) + $ + m) : a + $ + (l === -2 ? c : m);
  }
  return [pt(i, o + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class T {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const c = t.length - 1, a = this.parts, [d, u] = Ct(t, e);
    if (this.el = T.createElement(d, s), y.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (r = y.nextNode()) !== null && a.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const l of r.getAttributeNames()) if (l.endsWith(ht)) {
          const g = u[n++], m = r.getAttribute(l).split($), M = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: o, name: M[2], strings: m, ctor: M[1] === "." ? Ut : M[1] === "?" ? Tt : M[1] === "@" ? Ot : D }), r.removeAttribute(l);
        } else l.startsWith($) && (a.push({ type: 6, index: o }), r.removeAttribute(l));
        if (ut.test(r.tagName)) {
          const l = r.textContent.split($), g = l.length - 1;
          if (g > 0) {
            r.textContent = z ? z.emptyScript : "";
            for (let m = 0; m < g; m++) r.append(l[m], P()), y.nextNode(), a.push({ type: 2, index: ++o });
            r.append(l[g], P());
          }
        }
      } else if (r.nodeType === 8) if (r.data === dt) a.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = r.data.indexOf($, l + 1)) !== -1; ) a.push({ type: 7, index: o }), l += $.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = v.createElement("template");
    return s.innerHTML = t, s;
  }
}
function E(i, t, e = i, s) {
  if (t === S) return t;
  let r = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const o = U(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = r : e._$Cl = r), r !== void 0 && (t = E(i, r._$AS(i, t.values), r, s)), t;
}
class Pt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, r = (t?.creationScope ?? v).importNode(e, !0);
    y.currentNode = r;
    let o = y.nextNode(), n = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let d;
        a.type === 2 ? d = new N(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new Nt(o, this, t)), this._$AV.push(d), a = s[++c];
      }
      n !== a?.index && (o = y.nextNode(), n++);
    }
    return y.currentNode = v, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class N {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = E(this, t, e), U(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Et(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = T.createElement(pt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const o = new Pt(r, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ot.get(t.strings);
    return e === void 0 && ot.set(t.strings, e = new T(t)), e;
  }
  k(t) {
    V(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const o of t) r === e.length ? e.push(s = new N(this.O(P()), this.O(P()), this, this.options)) : s = e[r], s._$AI(o), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = Y(t).nextSibling;
      Y(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class D {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, o) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = h;
  }
  _$AI(t, e = this, s, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = E(this, t, e, 0), n = !U(t) || t !== this._$AH && t !== S, n && (this._$AH = t);
    else {
      const c = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = E(this, c[s + a], e, a), d === S && (d = this._$AH[a]), n ||= !U(d) || d !== this._$AH[a], d === h ? t = h : t !== h && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ut extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Tt extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Ot extends D {
  constructor(t, e, s, r, o) {
    super(t, e, s, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? h) === S) return;
    const s = this._$AH, r = t === h && s !== h || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== h && (s === h || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Nt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const Mt = W.litHtmlPolyfillSupport;
Mt?.(T, N), (W.litHtmlVersions ??= []).push("3.3.3");
const Ht = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = e?.renderBefore ?? null;
    s._$litPart$ = r = new N(t.insertBefore(P(), o), o, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis;
class x extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ht(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return S;
  }
}
x._$litElement$ = !0, x.finalized = !0, Z.litElementHydrateSupport?.({ LitElement: x });
const Rt = Z.litElementPolyfillSupport;
Rt?.({ LitElement: x });
(Z.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lt = { attribute: !0, type: String, converter: L, reflect: !1, hasChanged: q }, zt = (i = Lt, t, e) => {
  const { kind: s, metadata: r } = e;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), o.set(e.name, i), s === "accessor") {
    const { name: n } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(n, a, i, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, i, c), c;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(c) {
      const a = this[n];
      t.call(this, c), this.requestUpdate(n, a, i, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function J(i) {
  return (t, e) => typeof e == "object" ? zt(i, t, e) : ((s, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(i) {
  return J({ ...i, state: !0, attribute: !1 });
}
var It = Object.defineProperty, Dt = Object.getOwnPropertyDescriptor, p = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? Dt(t, e) : t, o = i.length - 1, n; o >= 0; o--)
    (n = i[o]) && (r = (s ? n(t, e, r) : n(r)) || r);
  return s && r && It(t, e, r), r;
};
const jt = ["Stück", "L", "mL", "kg", "g"], Bt = {
  Stück: "x",
  L: "L",
  mL: "mL",
  kg: "kg",
  g: "g"
};
function R(i) {
  return i.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLocaleLowerCase().trim();
}
function Ft(i) {
  const t = R(i).replace(/[\\s._-]/g, "");
  if (t === "x" || t.includes("stuck") || t.includes("stk") || t.includes("piece")) return "Stück";
  if (t === "ml" || t.includes("milliliter") || t.includes("millilitre")) return "mL";
  if (t === "l" || t.includes("liter") || t.includes("litre")) return "L";
  if (t === "kg" || t.includes("kilogram")) return "kg";
  if (t === "g" || t.includes("gram")) return "g";
}
function nt(i) {
  const t = i.trim().match(/^(\\d+(?:[.,]\\d+)?)/);
  if (!t) return;
  const e = Number(t[1].replace(",", ".")), s = Ft(i.slice(t[0].length));
  if (!(!Number.isFinite(e) || e <= 0 || !s))
    return { count: e, unit: s };
}
function at(i) {
  const t = i.trim();
  if (!t) return { name: "", count: 1, unit: "Stück" };
  const e = t.lastIndexOf("(");
  if (e > 0 && t.endsWith(")")) {
    const r = nt(t.slice(e + 1, -1));
    if (r)
      return { name: t.slice(0, e).trim(), ...r };
  }
  const s = t.match(/^(.*\\S)\\s+(\\d+(?:[.,]\\d+)?)\\s*([^\\s]+)$/);
  if (s) {
    const r = nt(s[2] + s[3]);
    if (r) return { name: s[1].trim(), ...r };
  }
  return { name: t, count: 1, unit: "Stück" };
}
function qt(i, t, e) {
  const s = i.trim();
  if (!s) return "";
  if (t === 1 && e === "Stück") return s;
  const r = Number.isInteger(t) ? String(t) : String(t).replace(".", ",");
  return `${s} (${r}${Bt[e]})`;
}
let _ = class extends x {
  constructor() {
    super(...arguments), this._items = [], this._name = "", this._count = 1, this._unit = "Stück", this._done = !1, this._focused = !1, this._loading = !1, this._feedback = "", this._feedbackError = !1;
  }
  static getStubConfig() {
    return { type: "custom:ha-shopping-list-bubble-card", entity: "todo.einkaufsliste" };
  }
  setConfig(i) {
    if (!i.entity) throw new Error("Please configure a todo entity for the shopping list card.");
    this._config = { close_popup_on_success: !1, ...i }, this._loadItems();
  }
  getCardSize() {
    return 4;
  }
  connectedCallback() {
    super.connectedCallback(), this._refreshTimer = window.setInterval(() => void this._loadItems(), 3e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._refreshTimer !== void 0 && window.clearInterval(this._refreshTimer);
  }
  async _callService(i, t) {
    if (!this.hass || !this._config) throw new Error("Home Assistant is not connected.");
    return this.hass.callService("todo", i, { entity_id: this._config.entity, ...t });
  }
  async _loadItems() {
    if (!(!this.hass || !this._config))
      try {
        const i = await this.hass.callWS({
          type: "call_service",
          domain: "todo",
          service: "get_items",
          service_data: { entity_id: this._config.entity },
          return_response: !0
        }), t = i?.[this._config.entity];
        t && Array.isArray(t.items) ? this._items = t.items : Array.isArray(i?.items) && (this._items = i.items);
      } catch (i) {
        this._showFeedback(`Einkaufsliste konnte nicht geladen werden: ${this._errorMessage(i)}`, !0);
      }
  }
  get _matches() {
    const i = R(this._name);
    return i ? this._items.filter((t) => {
      const e = String(t.summary ?? ""), s = at(e).name;
      return R(e).includes(i) || R(s).includes(i);
    }) : [];
  }
  _resetForm() {
    this._name = "", this._count = 1, this._unit = "Stück", this._done = !1, this._selectedUid = void 0;
  }
  _selectExisting(i) {
    const t = at(i.summary);
    this._name = t.name, this._count = t.count, this._unit = t.unit, this._done = (i.status === "completed", !1), this._selectedUid = i.uid, this._focused = !1, this._feedback = "";
  }
  _startNew() {
    this._count = 1, this._unit = "Stück", this._done = !1, this._selectedUid = void 0, this._focused = !1, this._feedback = "";
  }
  _changeCount(i) {
    this._count = Math.max(0.1, Math.round((this._count + i) * 10) / 10);
  }
  _showFeedback(i, t = !1) {
    this._feedback = i, this._feedbackError = t;
  }
  _errorMessage(i) {
    return i instanceof Error ? i.message : "Unbekannter Fehler";
  }
  async _submit() {
    const i = qt(this._name, this._count, this._unit);
    if (!i || !this._config || this._loading) return;
    this._loading = !0, this._showFeedback("");
    const t = !!this._selectedUid;
    try {
      if (this._selectedUid)
        await this._callService("update_item", {
          item: this._selectedUid,
          rename: i,
          status: this._done ? "completed" : "needs_action"
        });
      else {
        const e = new Set(this._items.map((s) => s.uid).filter(Boolean));
        if (await this._callService("add_item", { item: i }), this._done) {
          await this._loadItems();
          const s = this._items.find((r) => r.uid && !e.has(r.uid) && r.summary === i);
          s?.uid && await this._callService("update_item", { item: s.uid, status: "completed" });
        }
      }
      await this._loadItems(), this._resetForm(), this._showFeedback(t ? "Eintrag aktualisiert." : "Eintrag hinzugefügt."), this._tryClosePopup();
    } catch (e) {
      this._showFeedback(`Aktion fehlgeschlagen: ${this._errorMessage(e)}`, !0);
    } finally {
      this._loading = !1;
    }
  }
  _tryClosePopup() {
    this._config?.close_popup_on_success && window.location.hash.toLowerCase().includes("bubble") && window.history.back();
  }
  _onNameInput(i) {
    this._name = i.currentTarget.value, this._selectedUid = void 0, this._feedback = "";
  }
  render() {
    if (!this._config) return h;
    const i = this._matches, t = this._selectedUid ? "Aktualisieren" : "Hinzufügen";
    return w`
      <ha-card>
        <div class="content">
          <div class="search-wrap">
            <label class="visually-hidden" for="product">Produkt</label>
            <input id="product" class="product" type="text" autocomplete="off"
              placeholder="Produkt" .value=${this._name}
              @input=${this._onNameInput} @focus=${() => {
      this._focused = !0;
    }}
              @blur=${() => window.setTimeout(() => {
      this._focused = !1;
    }, 140)}
              @keydown=${(e) => {
      e.key === "Enter" && this._name.trim() && (e.preventDefault(), this.shadowRoot?.querySelector(".submit")?.click());
    }} />
            ${this._focused && this._name.trim() ? w`
              <div class="suggestions" role="listbox">
                <button class="suggestion add-suggestion" role="option" @mousedown=${(e) => e.preventDefault()} @click=${this._startNew}>
                  „${this._name.trim()}“ hinzufügen
                </button>
                ${i.map((e) => w`
                  <button class="suggestion" role="option" @mousedown=${(s) => s.preventDefault()} @click=${() => this._selectExisting(e)}>
                    <span>${e.summary}</span><small>${e.status === "completed" ? "Erledigt" : "Offen"}</small>
                  </button>
                `)}
              </div>` : h}
          </div>

          <div class="quantity-row">
            <div class="stepper" aria-label="Menge">
              <button class="step" aria-label="Menge verringern" ?disabled=${this._count <= 0.1} @click=${() => this._changeCount(-1)}>−</button>
              <input class="count" type="number" min="0.1" step="0.1" aria-label="Anzahl"
                .value=${String(this._count)} @input=${(e) => {
      const s = Number(e.currentTarget.value);
      Number.isFinite(s) && s > 0 && (this._count = s);
    }} />
              <button class="step" aria-label="Menge erhöhen" @click=${() => this._changeCount(1)}>+</button>
            </div>
            <select class="unit" aria-label="Einheit" .value=${this._unit}
              @change=${(e) => {
      this._unit = e.currentTarget.value;
    }}>
              ${jt.map((e) => w`<option value=${e}>${e}</option>`)}
            </select>
          </div>

          <label class="done-row">
            <input type="checkbox" .checked=${this._done}
              @change=${(e) => {
      this._done = e.currentTarget.checked;
    }} />
            <span>Erledigt</span>
          </label>
          <button class="submit" ?disabled=${this._loading || !this._name.trim()} @click=${this._submit}>
            ${this._loading ? "Wird gespeichert…" : t}
          </button>
          ${this._feedback ? w`<div class="feedback ${this._feedbackError ? "error" : "success"}" role="status">${this._feedback}</div>` : h}
        </div>
      </ha-card>
    `;
  }
};
_.styles = lt`
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
    .search-wrap { position: relative; z-index: 1; }
    input, select, button { font: inherit; color: inherit; }
    .product, .count, .unit {
      box-sizing: border-box; min-height: 44px; border: 1px solid var(--divider-color);
      border-radius: var(--shopping-card-radius); background: var(--input-fill-color, var(--secondary-background-color));
      padding: 0 14px; outline: none;
    }
    .product { width: 100%; }
    .product:focus, .count:focus, .unit:focus { border-color: var(--primary-color); }
    .quantity-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(100px, 0.8fr); gap: 10px; }
    .stepper { display: grid; grid-template-columns: 44px minmax(40px, 1fr) 44px; align-items: center; border: 1px solid var(--divider-color); border-radius: var(--shopping-card-radius); overflow: hidden; background: var(--input-fill-color, var(--secondary-background-color)); }
    .count { width: 100%; min-width: 0; border: 0; border-radius: 0; text-align: center; padding: 0 4px; background: transparent; appearance: textfield; }
    .count::-webkit-inner-spin-button, .count::-webkit-outer-spin-button { appearance: none; margin: 0; }
    .step { height: 44px; border: 0; background: transparent; cursor: pointer; color: var(--primary-color); font-size: 22px; }
    .step:hover, .suggestion:hover { background: var(--secondary-background-color); }
    .step:disabled { opacity: .4; cursor: default; }
    .unit { width: 100%; cursor: pointer; }
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
p([
  J({ attribute: !1 })
], _.prototype, "hass", 2);
p([
  f()
], _.prototype, "_config", 2);
p([
  f()
], _.prototype, "_items", 2);
p([
  f()
], _.prototype, "_name", 2);
p([
  f()
], _.prototype, "_count", 2);
p([
  f()
], _.prototype, "_unit", 2);
p([
  f()
], _.prototype, "_done", 2);
p([
  f()
], _.prototype, "_focused", 2);
p([
  f()
], _.prototype, "_selectedUid", 2);
p([
  f()
], _.prototype, "_loading", 2);
p([
  f()
], _.prototype, "_feedback", 2);
p([
  f()
], _.prototype, "_feedbackError", 2);
_ = p([
  _t("ha-shopping-list-bubble-card")
], _);
let O = class extends x {
  constructor() {
    super(...arguments), this._config = {};
  }
  setConfig(i) {
    this._config = { ...i };
  }
  _entityChanged(i) {
    const t = i.detail?.value;
    this._config = { ...this._config, entity: t }, this._emitConfig();
  }
  _closeChanged(i) {
    this._config = { ...this._config, close_popup_on_success: i.currentTarget.checked }, this._emitConfig();
  }
  _emitConfig() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: !0, composed: !0 }));
  }
  render() {
    return w`<div class="editor">
      <label>Todo-Liste
        <ha-entity-picker .hass=${this.hass} .value=${this._config.entity ?? ""} .includeDomains=${["todo"]}
          @value-changed=${this._entityChanged}></ha-entity-picker>
      </label>
      <label class="toggle"><input type="checkbox" .checked=${this._config.close_popup_on_success ?? !1} @change=${this._closeChanged} />
        Popup nach erfolgreichem Speichern schließen</label>
    </div>`;
  }
};
O.styles = lt`
    .editor { display: grid; gap: 16px; }
    label { display: grid; gap: 8px; }
    .toggle { display: flex; align-items: center; gap: 8px; }
  `;
p([
  J({ attribute: !1 })
], O.prototype, "hass", 2);
p([
  f()
], O.prototype, "_config", 2);
O = p([
  _t("ha-shopping-list-bubble-card-editor")
], O);
window.customCards = window.customCards || [];
window.customCards.some((i) => i.type === "ha-shopping-list-bubble-card") || window.customCards.push({
  type: "ha-shopping-list-bubble-card",
  name: "Shopping list (Bubble Card popup)",
  description: "Shopping-list input card for a Home Assistant todo list.",
  preview: !0
});
export {
  _ as HaShoppingListBubbleCard
};
//# sourceMappingURL=shopping-list-card.js.map
