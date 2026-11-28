/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, B = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = Symbol(), J = /* @__PURE__ */ new WeakMap();
let ct = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (B && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = J.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && J.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ft = (s) => new ct(typeof s == "string" ? s : s + "", void 0, q), lt = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, r, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[o + 1], s[0]);
  return new ct(e, s, q);
}, gt = (s, t) => {
  if (B) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = H.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, s.appendChild(i);
  }
}, Q = B ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return ft(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: mt, defineProperty: $t, getOwnPropertyDescriptor: bt, getOwnPropertyNames: yt, getOwnPropertySymbols: vt, getPrototypeOf: wt } = Object, L = globalThis, X = L.trustedTypes, xt = X ? X.emptyScript : "", At = L.reactiveElementPolyfillSupport, C = (s, t) => s, R = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? xt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, F = (s, t) => !mt(s, t), Y = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: F };
Symbol.metadata ??= Symbol("metadata"), L.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let x = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Y) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && $t(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: o } = bt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: r, set(n) {
      const c = r?.call(this);
      o?.call(this, n), this.requestUpdate(t, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = wt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, i = [...yt(e), ...vt(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(Q(r));
    } else t !== void 0 && e.push(Q(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
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
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : R).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = i.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : R;
      this._$Em = r;
      const c = n.fromAttribute(e, o.type);
      this[r] = c ?? this._$Ej?.get(r) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[t]), i ??= n.getPropertyOptions(t), !((i.hasChanged ?? F)(o, e) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: o }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, o] of i) {
        const { wrapped: n } = o, c = this[r];
        n !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, o, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
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
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[C("elementProperties")] = /* @__PURE__ */ new Map(), x[C("finalized")] = /* @__PURE__ */ new Map(), At?.({ ReactiveElement: x }), (L.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, G = (s) => s, D = W.trustedTypes, tt = D ? D.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, ht = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, dt = "?" + b, kt = `<${dt}>`, w = document, P = () => w.createComment(""), U = (s) => s === null || typeof s != "object" && typeof s != "function", V = Array.isArray, Et = (s) => V(s) || typeof s?.[Symbol.iterator] == "function", j = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, et = /-->/g, it = />/g, y = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), st = /'/g, rt = /"/g, ut = /^(?:script|style|textarea|title)$/i, St = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), $ = St(1), k = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), ot = /* @__PURE__ */ new WeakMap(), v = w.createTreeWalker(w, 129);
function pt(s, t) {
  if (!V(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tt !== void 0 ? tt.createHTML(t) : t;
}
const Ct = (s, t) => {
  const e = s.length - 1, i = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = S;
  for (let c = 0; c < e; c++) {
    const a = s[c];
    let d, p, l = -1, g = 0;
    for (; g < a.length && (n.lastIndex = g, p = n.exec(a), p !== null); ) g = n.lastIndex, n === S ? p[1] === "!--" ? n = et : p[1] !== void 0 ? n = it : p[2] !== void 0 ? (ut.test(p[2]) && (r = RegExp("</" + p[2], "g")), n = y) : p[3] !== void 0 && (n = y) : n === y ? p[0] === ">" ? (n = r ?? S, l = -1) : p[1] === void 0 ? l = -2 : (l = n.lastIndex - p[2].length, d = p[1], n = p[3] === void 0 ? y : p[3] === '"' ? rt : st) : n === rt || n === st ? n = y : n === et || n === it ? n = S : (n = y, r = void 0);
    const m = n === y && s[c + 1].startsWith("/>") ? " " : "";
    o += n === S ? a + kt : l >= 0 ? (i.push(d), a.slice(0, l) + ht + a.slice(l) + b + m) : a + b + (l === -2 ? c : m);
  }
  return [pt(s, o + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class O {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const c = t.length - 1, a = this.parts, [d, p] = Ct(t, e);
    if (this.el = O.createElement(d, i), v.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (r = v.nextNode()) !== null && a.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const l of r.getAttributeNames()) if (l.endsWith(ht)) {
          const g = p[n++], m = r.getAttribute(l).split(b), M = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: o, name: M[2], strings: m, ctor: M[1] === "." ? Ut : M[1] === "?" ? Ot : M[1] === "@" ? Tt : I }), r.removeAttribute(l);
        } else l.startsWith(b) && (a.push({ type: 6, index: o }), r.removeAttribute(l));
        if (ut.test(r.tagName)) {
          const l = r.textContent.split(b), g = l.length - 1;
          if (g > 0) {
            r.textContent = D ? D.emptyScript : "";
            for (let m = 0; m < g; m++) r.append(l[m], P()), v.nextNode(), a.push({ type: 2, index: ++o });
            r.append(l[g], P());
          }
        }
      } else if (r.nodeType === 8) if (r.data === dt) a.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = r.data.indexOf(b, l + 1)) !== -1; ) a.push({ type: 7, index: o }), l += b.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = w.createElement("template");
    return i.innerHTML = t, i;
  }
}
function E(s, t, e = s, i) {
  if (t === k) return t;
  let r = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const o = U(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(s), r._$AT(s, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = r : e._$Cl = r), r !== void 0 && (t = E(s, r._$AS(s, t.values), r, i)), t;
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
    const { el: { content: e }, parts: i } = this._$AD, r = (t?.creationScope ?? w).importNode(e, !0);
    v.currentNode = r;
    let o = v.nextNode(), n = 0, c = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let d;
        a.type === 2 ? d = new N(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new Nt(o, this, t)), this._$AV.push(d), a = i[++c];
      }
      n !== a?.index && (o = v.nextNode(), n++);
    }
    return v.currentNode = w, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class N {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = E(this, t, e), U(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== k && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Et(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(w.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = O.createElement(pt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const o = new Pt(r, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ot.get(t.strings);
    return e === void 0 && ot.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    V(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const o of t) r === e.length ? e.push(i = new N(this.O(P()), this.O(P()), this, this.options)) : i = e[r], i._$AI(o), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = G(t).nextSibling;
      G(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class I {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, o) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(t, e = this, i, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = E(this, t, e, 0), n = !U(t) || t !== this._$AH && t !== k, n && (this._$AH = t);
    else {
      const c = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = E(this, c[i + a], e, a), d === k && (d = this._$AH[a]), n ||= !U(d) || d !== this._$AH[a], d === h ? t = h : t !== h && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ut extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Ot extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Tt extends I {
  constructor(t, e, i, r, o) {
    super(t, e, i, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? h) === k) return;
    const i = this._$AH, r = t === h && i !== h || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== h && (i === h || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Nt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const Mt = W.litHtmlPolyfillSupport;
Mt?.(O, N), (W.litHtmlVersions ??= []).push("3.3.3");
const Ht = (s, t, e) => {
  const i = e?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = e?.renderBefore ?? null;
    i._$litPart$ = r = new N(t.insertBefore(P(), o), o, void 0, e ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis;
class A extends x {
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
    return k;
  }
}
A._$litElement$ = !0, A.finalized = !0, K.litElementHydrateSupport?.({ LitElement: A });
const zt = K.litElementPolyfillSupport;
zt?.({ LitElement: A });
(K.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Rt = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: F }, Dt = (s = Rt, t, e) => {
  const { kind: i, metadata: r } = e;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(e.name, s), i === "accessor") {
    const { name: n } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(n, a, s, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, s, c), c;
    } };
  }
  if (i === "setter") {
    const { name: n } = e;
    return function(c) {
      const a = this[n];
      t.call(this, c), this.requestUpdate(n, a, s, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Z(s) {
  return (t, e) => typeof e == "object" ? Dt(s, t, e) : ((i, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(s) {
  return Z({ ...s, state: !0, attribute: !1 });
}
var Lt = Object.defineProperty, It = Object.getOwnPropertyDescriptor, u = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? It(t, e) : t, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && Lt(t, e, r), r;
};
const jt = ["Stück", "L", "mL", "kg", "g"], Bt = {
  Stück: "x",
  L: "L",
  mL: "mL",
  kg: "kg",
  g: "g"
};
function z(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
}
function qt(s) {
  const t = z(s).replace(/[\s._-]/g, "");
  if (t === "x" || t.includes("stuck") || t.includes("stk") || t.includes("piece")) return "Stück";
  if (t === "ml" || t.includes("milliliter") || t.includes("millilitre")) return "mL";
  if (t === "l" || t.includes("liter") || t.includes("litre")) return "L";
  if (t === "kg" || t.includes("kilogram")) return "kg";
  if (t === "g" || t.includes("gram")) return "g";
}
function nt(s) {
  const t = s.trim().match(/^(\d+(?:[.,]\d+)?)/);
  if (!t) return;
  const e = Number(t[1].replace(",", ".")), i = qt(s.slice(t[0].length));
  if (!(!Number.isFinite(e) || e <= 0 || !i))
    return { count: e, unit: i };
}
function at(s) {
  const t = s.trim();
  if (!t) return { name: "", count: 1, unit: "Stück" };
  const e = t.lastIndexOf("(");
  if (e > 0 && t.endsWith(")")) {
    const r = nt(t.slice(e + 1, -1));
    if (r)
      return { name: t.slice(0, e).trim(), ...r };
  }
  const i = t.match(/^(.*\S)\s+(\d+(?:[.,]\d+)?)\s*([^\s]+)$/);
  if (i) {
    const r = nt(i[2] + i[3]);
    if (r) return { name: i[1].trim(), ...r };
  }
  return { name: t, count: 1, unit: "Stück" };
}
function Ft(s, t, e) {
  const i = s.trim();
  if (!i) return "";
  if (t === 1 && e === "Stück") return i;
  const r = Number.isInteger(t) ? String(t) : String(t).replace(".", ",");
  return `${i} (${r}${Bt[e]})`;
}
let _ = class extends A {
  constructor() {
    super(...arguments), this._items = [], this._name = "", this._count = 1, this._unit = "Stück", this._unitOpen = !1, this._done = !1, this._focused = !1, this._loading = !1, this._feedback = "", this._feedbackError = !1, this._onDocumentPointerDown = (s) => {
      s.composedPath().includes(this) || (this._unitOpen = !1);
    };
  }
  static getStubConfig() {
    return { type: "custom:hestia-todo-entry-editor", entity: "todo.einkaufsliste" };
  }
  setConfig(s) {
    if (!s.entity) throw new Error("Please configure a todo entity for the todo entry editor.");
    this._config = { close_popup_on_success: !1, ...s }, this._loadItems();
  }
  getCardSize() {
    return 4;
  }
  updated(s) {
    s.has("hass") && this._loadItems();
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("pointerdown", this._onDocumentPointerDown), this._refreshTimer = window.setInterval(() => void this._loadItems(), 3e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("pointerdown", this._onDocumentPointerDown), this._refreshTimer !== void 0 && window.clearInterval(this._refreshTimer);
  }
  async _callService(s, t) {
    if (!this.hass || !this._config) throw new Error("Home Assistant is not connected.");
    return this.hass.callService("todo", s, { entity_id: this._config.entity, ...t });
  }
  async _loadItems() {
    if (!(!this.hass || !this._config))
      try {
        const s = await this.hass.callWS({
          type: "call_service",
          domain: "todo",
          service: "get_items",
          service_data: { entity_id: this._config.entity },
          return_response: !0
        }), e = (s?.[this._config.entity] ?? s?.response?.[this._config.entity])?.items ?? s?.items ?? s?.response?.items;
        Array.isArray(e) ? this._items = e : this._showFeedback("Die Einkaufsliste lieferte keine Einträge zurück.", !0);
      } catch (s) {
        this._showFeedback(`Einkaufsliste konnte nicht geladen werden: ${this._errorMessage(s)}`, !0);
      }
  }
  get _matches() {
    const s = z(this._name);
    return s ? this._items.filter((t) => {
      const e = String(t.summary ?? ""), i = at(e).name;
      return z(e).includes(s) || z(i).includes(s);
    }) : [];
  }
  _resetForm() {
    this._name = "", this._count = 1, this._unit = "Stück", this._done = !1, this._selectedUid = void 0;
  }
  _selectExisting(s) {
    const t = at(s.summary);
    this._name = t.name, this._count = t.count, this._unit = t.unit, this._done = (s.status === "completed", !1), this._selectedUid = s.uid, this._focused = !1, this._feedback = "";
  }
  _startNew() {
    this._count = 1, this._unit = "Stück", this._done = !1, this._selectedUid = void 0, this._focused = !1, this._feedback = "";
  }
  _changeCount(s) {
    this._count = Math.max(0.1, Math.round((this._count + s) * 10) / 10);
  }
  _showFeedback(s, t = !1) {
    this._feedback = s, this._feedbackError = t;
  }
  _errorMessage(s) {
    return s instanceof Error ? s.message : "Unbekannter Fehler";
  }
  async _submit() {
    const s = Ft(this._name, this._count, this._unit);
    if (!s || !this._config || this._loading) return;
    this._loading = !0, this._showFeedback("");
    const t = !!this._selectedUid;
    try {
      if (this._selectedUid)
        await this._callService("update_item", {
          item: this._selectedUid,
          rename: s,
          status: this._done ? "completed" : "needs_action"
        });
      else {
        const e = new Set(this._items.map((i) => i.uid).filter(Boolean));
        if (await this._callService("add_item", { item: s }), this._done) {
          await this._loadItems();
          const i = this._items.find((r) => r.uid && !e.has(r.uid) && r.summary === s);
          i?.uid && await this._callService("update_item", { item: i.uid, status: "completed" });
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
    this._config?.close_popup_on_success && window.location.hash && (window.location.hash = "");
  }
  _onNameInput(s) {
    this._name = s.currentTarget.value, this._selectedUid = void 0, this._feedback = "";
  }
  render() {
    if (!this._config) return h;
    const s = this._matches, t = this._selectedUid ? "Aktualisieren" : "Hinzufügen";
    return $`
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
            ${this._focused && this._name.trim() ? $`
              <div class="suggestions" role="listbox">
                <button class="suggestion add-suggestion" role="option" @mousedown=${(e) => e.preventDefault()} @click=${this._startNew}>
                  „${this._name.trim()}“ hinzufügen
                </button>
                ${s.map((e) => $`
                  <button class="suggestion" role="option" @mousedown=${(i) => i.preventDefault()} @click=${() => this._selectExisting(e)}>
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
      const i = Number(e.currentTarget.value);
      Number.isFinite(i) && i > 0 && (this._count = i);
    }} />
              <button class="step" aria-label="Menge erhöhen" @click=${() => this._changeCount(1)}>+</button>
            </div>
            <div class="unit-wrap">
              <button class="unit-trigger" type="button" aria-label="Einheit auswählen"
                aria-haspopup="listbox" aria-expanded=${this._unitOpen}
                @click=${() => {
      this._unitOpen = !this._unitOpen;
    }}
                @keydown=${(e) => {
      e.key === "Escape" && (this._unitOpen = !1);
    }}>
                <span>${this._unit}</span><span class="unit-chevron" aria-hidden="true"></span>
              </button>
              ${this._unitOpen ? $`
                <div class="unit-menu" role="listbox" aria-label="Einheit">
                  ${jt.map((e) => $`
                    <button class="unit-option" type="button" role="option"
                      aria-selected=${this._unit === e}
                      @click=${() => {
      this._unit = e, this._unitOpen = !1;
    }}>
                      <span>${e}</span>${this._unit === e ? $`<span class="unit-check" aria-hidden="true">✓</span>` : h}
                    </button>
                  `)}
                </div>` : h}
            </div>
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
          ${this._feedback ? $`<div class="feedback ${this._feedbackError ? "error" : "success"}" role="status">${this._feedback}</div>` : h}
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
u([
  Z({ attribute: !1 })
], _.prototype, "hass", 2);
u([
  f()
], _.prototype, "_config", 2);
u([
  f()
], _.prototype, "_items", 2);
u([
  f()
], _.prototype, "_name", 2);
u([
  f()
], _.prototype, "_count", 2);
u([
  f()
], _.prototype, "_unit", 2);
u([
  f()
], _.prototype, "_unitOpen", 2);
u([
  f()
], _.prototype, "_done", 2);
u([
  f()
], _.prototype, "_focused", 2);
u([
  f()
], _.prototype, "_selectedUid", 2);
u([
  f()
], _.prototype, "_loading", 2);
u([
  f()
], _.prototype, "_feedback", 2);
u([
  f()
], _.prototype, "_feedbackError", 2);
_ = u([
  _t("hestia-todo-entry-editor")
], _);
let T = class extends A {
  constructor() {
    super(...arguments), this._config = {};
  }
  setConfig(s) {
    this._config = { ...s };
  }
  _entityChanged(s) {
    const t = s.detail?.value;
    this._config = { ...this._config, entity: t }, this._emitConfig();
  }
  _closeChanged(s) {
    this._config = { ...this._config, close_popup_on_success: s.currentTarget.checked }, this._emitConfig();
  }
  _emitConfig() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: !0, composed: !0 }));
  }
  render() {
    return $`<div class="editor">
      <label>Todo-Liste
        <ha-entity-picker .hass=${this.hass} .value=${this._config.entity ?? ""} .includeDomains=${["todo"]}
          @value-changed=${this._entityChanged}></ha-entity-picker>
      </label>
      <label class="toggle"><input type="checkbox" .checked=${this._config.close_popup_on_success ?? !1} @change=${this._closeChanged} />
        Popup nach erfolgreichem Speichern schließen</label>
    </div>`;
  }
};
T.styles = lt`
    .editor { display: grid; gap: 16px; }
    label { display: grid; gap: 8px; }
    .toggle { display: flex; align-items: center; gap: 8px; }
  `;
u([
  Z({ attribute: !1 })
], T.prototype, "hass", 2);
u([
  f()
], T.prototype, "_config", 2);
T = u([
  _t("hestia-todo-entry-editor-editor")
], T);
window.customCards = window.customCards || [];
window.customCards.some((s) => s.type === "hestia-todo-entry-editor") || window.customCards.push({
  type: "hestia-todo-entry-editor",
  name: "Hestia – Todo Entry Editor for Shopping Lists",
  description: "A simple Home Assistant UI for adding and updating todo list entries, making it easy to use any todo list as a shopping list.",
  preview: !0
});
export {
  _ as HestiaTodoEntryEditor
};
//# sourceMappingURL=hestia-todo-entry-editor.js.map
