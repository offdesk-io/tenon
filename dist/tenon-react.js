import { Fragment as e, createContext as t, forwardRef as n, useCallback as r, useContext as i, useEffect as a, useId as o, useLayoutEffect as s, useRef as c, useState as l, useSyncExternalStore as u } from "react";
import { Fragment as d, jsx as f, jsxs as p } from "react/jsx-runtime";
import { createPortal as m } from "react-dom";
import { ThinkingOrb as h } from "thinking-orbs";
//#region src/utils.ts
var g = (...e) => e.filter((e) => typeof e == "string" && e.length > 0).join(" "), _ = n(function({ variant: e = "secondary", size: t = "md", iconOnly: n = !1, pressed: r, block: i = !1, startIcon: a, endIcon: o, className: s, children: c, type: l = "button", ...u }, d) {
	return /* @__PURE__ */ p("button", {
		ref: d,
		type: l,
		className: g("tenon-button", `tenon-button--${e}`, `tenon-button--${t}`, n && "tenon-button--icon-only", r && "tenon-button--pressed", i && "tenon-button--block", s),
		"aria-pressed": r,
		...u,
		children: [
			a,
			c,
			o
		]
	});
}), v = n(function({ variant: e = "secondary", size: t = "md", startIcon: n, endIcon: r, className: i, children: a, ...o }, s) {
	return /* @__PURE__ */ p("a", {
		ref: s,
		className: g("tenon-button", `tenon-button--${e}`, `tenon-button--${t}`, i),
		...o,
		children: [
			n,
			a,
			r
		]
	});
});
//#endregion
//#region src/components/Card/Card.tsx
function y(e, t) {
	return t ? typeof t == "object" && t && "__html" in t ? /* @__PURE__ */ f("div", {
		className: e,
		dangerouslySetInnerHTML: t
	}) : /* @__PURE__ */ f("div", {
		className: e,
		children: t
	}) : null;
}
function b({ title: e, eyebrow: t, eyebrowEnd: n, lead: r, action: i, tags: a, meta: o, summary: s, body: c, footer: l, accent: u, elevation: d = "flat", draggable: m, dragging: h, interactive: _, selected: v, as: b = "article", titleAs: x = "div", className: S, style: C, children: w, ...T }) {
	let E = u ? {
		"--tenon-card-accent": u,
		...C
	} : C;
	return /* @__PURE__ */ p(b, {
		className: g("tenon-card", `tenon-card--${d}`, u && "tenon-card--accent", m && "tenon-card--draggable", h && "tenon-card--dragging", _ && "tenon-card--interactive", v && "tenon-card--selected", S),
		style: E,
		draggable: m,
		...T,
		children: [
			(t || n) && /* @__PURE__ */ p("div", {
				className: "tenon-card__eyebrow",
				children: [t && typeof t == "object" && "__html" in t ? /* @__PURE__ */ f("span", { dangerouslySetInnerHTML: t }) : t, n ? /* @__PURE__ */ f("span", {
					className: "tenon-card__eyebrow-end",
					children: n
				}) : null]
			}),
			(r || e || i) && /* @__PURE__ */ p("div", {
				className: "tenon-card__head",
				children: [
					r ? /* @__PURE__ */ f("span", {
						className: "tenon-card__lead",
						children: r
					}) : null,
					e ? /* @__PURE__ */ f(x, {
						className: "tenon-card__title",
						children: e
					}) : null,
					i ? /* @__PURE__ */ f("span", {
						className: "tenon-card__action",
						children: i
					}) : null
				]
			}),
			y("tenon-card__summary", s),
			y("tenon-card__tags", a),
			y("tenon-card__meta", o),
			c ? /* @__PURE__ */ f("div", {
				className: "tenon-card__body",
				children: c
			}) : null,
			y("tenon-card__footer", l),
			w
		]
	});
}
//#endregion
//#region src/components/Badge/Badge.tsx
function x({ count: e, label: t, max: n = 99, tone: r = "accent", className: i, ...a }) {
	let o = Math.floor(Number(e) || 0);
	if (o < 1) return null;
	let s = o > n ? `${n}+` : String(o), c = t ? `${o} ${t}` : void 0;
	return /* @__PURE__ */ f("span", {
		className: g("tenon-badge", `tenon-badge--${r}`, i),
		title: c,
		"aria-label": c,
		...a,
		children: s
	});
}
//#endregion
//#region src/components/Tag/Tag.tsx
function S({ tone: e = "neutral", chart: t, dot: n = !1, className: r, children: i, style: a, ...o }) {
	let s = t ? {
		"--tenon-tag-colour": `var(--tenon-chart-${t})`,
		...a
	} : a;
	return /* @__PURE__ */ p("span", {
		className: g("tenon-tag", t ? "tenon-tag--chart" : `tenon-tag--${e}`, r),
		style: s,
		...o,
		children: [n && /* @__PURE__ */ f("span", {
			className: "tenon-tag__dot",
			"aria-hidden": "true"
		}), i]
	});
}
//#endregion
//#region src/components/Column/Column.tsx
function C({ title: e, titleAs: t = "h2", titleAfter: n, hint: r, sort: i, count: a, action: o, filters: s, desc: c, footer: l, layout: u = "stack", tone: m = "default", muted: h, dashed: _, dropState: v, collapsible: y, open: b, collapseKey: x, className: S, bodyClassName: C, bodyProps: w, children: T, ...E }) {
	let D = g("tenon-column", m !== "default" && `tenon-column--${m}`, u !== "stack" && `tenon-column--${u}`, h && "tenon-column--muted", _ && "tenon-column--dashed", v && `tenon-column--drop-${v}`, S), O = /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ p("div", {
		className: "tenon-column__head-row",
		children: [/* @__PURE__ */ p("div", {
			className: "tenon-column__head-start",
			children: [
				y ? /* @__PURE__ */ f("span", {
					className: "tenon-column__chevron",
					"aria-hidden": "true"
				}) : null,
				/* @__PURE__ */ f(t, {
					className: "tenon-column__title",
					children: e
				}),
				n,
				r ? /* @__PURE__ */ f("span", {
					className: "tenon-column__hint",
					children: r
				}) : null
			]
		}), /* @__PURE__ */ p("div", {
			className: "tenon-column__head-end",
			children: [
				i,
				a == null ? null : /* @__PURE__ */ f("span", {
					className: "tenon-column__count",
					children: a
				}),
				o,
				s
			]
		})]
	}), c ? /* @__PURE__ */ f("p", {
		className: "tenon-column__desc",
		children: c
	}) : null] }), k = /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("div", {
		...w,
		className: g("tenon-column__body", C, w?.className),
		children: T
	}), l ? /* @__PURE__ */ f("div", {
		className: "tenon-column__footer",
		children: l
	}) : null] });
	return y ? /* @__PURE__ */ p("details", {
		className: D,
		"data-column-collapse": x,
		open: b !== !1,
		...E,
		children: [/* @__PURE__ */ f("summary", {
			className: "tenon-column__head",
			children: O
		}), k]
	}) : /* @__PURE__ */ p("section", {
		className: D,
		...E,
		children: [/* @__PURE__ */ f("div", {
			className: "tenon-column__head",
			children: O
		}), k]
	});
}
function w({ boxed: e, className: t, children: n, ...r }) {
	return /* @__PURE__ */ f("div", {
		className: g("tenon-column-empty", e && "tenon-column-empty--boxed", t),
		...r,
		children: n
	});
}
//#endregion
//#region src/components/Stat/Stat.tsx
function T({ eyebrow: e, value: t, caption: n, tone: r = "default", size: i = "default", className: a, ...o }) {
	return /* @__PURE__ */ p("div", {
		className: g("tenon-stat", r !== "default" && `tenon-stat--${r}`, i !== "default" && `tenon-stat--${i}`, a),
		...o,
		children: [
			e ? /* @__PURE__ */ f("span", {
				className: "tenon-stat__eyebrow",
				children: e
			}) : null,
			/* @__PURE__ */ f("span", {
				className: "tenon-stat__value",
				children: t
			}),
			n ? /* @__PURE__ */ f("span", {
				className: "tenon-stat__caption",
				children: n
			}) : null
		]
	});
}
//#endregion
//#region src/components/Select/Select.tsx
function E() {
	return /* @__PURE__ */ f("svg", {
		className: "tenon-select__chevron",
		viewBox: "0 0 12 12",
		fill: "none",
		"aria-hidden": "true",
		children: /* @__PURE__ */ f("path", {
			d: "M3 4.5 6 7.5 9 4.5",
			stroke: "currentColor",
			strokeWidth: "1.5",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
var D = n(function({ invalid: e, className: t, children: n, ...r }, i) {
	return /* @__PURE__ */ p("span", {
		className: g("tenon-select", e && "tenon-select--invalid", t),
		children: [/* @__PURE__ */ f("select", {
			ref: i,
			"aria-invalid": e ? !0 : void 0,
			className: "tenon-select__control",
			...r,
			children: n
		}), /* @__PURE__ */ f(E, {})]
	});
});
//#endregion
//#region src/components/Field/Field.tsx
function O({ label: e, hint: t, error: n, required: r, className: i, ...a }) {
	let s = o(), c = `${s}-note`, { multiline: l, select: u, ...d } = a, m = n ?? t, h = {
		id: s,
		className: "tenon-field__control",
		"aria-invalid": n ? !0 : void 0,
		"aria-describedby": m ? c : void 0,
		required: r,
		...d
	};
	return /* @__PURE__ */ p("div", {
		className: g("tenon-field", n && "tenon-field--invalid", i),
		children: [
			/* @__PURE__ */ p("label", {
				className: "tenon-field__label",
				htmlFor: s,
				children: [e, r && /* @__PURE__ */ f("span", {
					className: "tenon-field__required",
					"aria-hidden": "true",
					children: "*"
				})]
			}),
			u ? /* @__PURE__ */ p("span", {
				className: "tenon-field__select",
				children: [/* @__PURE__ */ f("select", { ...h }), /* @__PURE__ */ f(E, {})]
			}) : f(l ? "textarea" : "input", { ...h }),
			m && /* @__PURE__ */ f("span", {
				id: c,
				className: g("tenon-field__note", n && "tenon-field__note--error"),
				children: m
			})
		]
	});
}
//#endregion
//#region src/components/Modal/Modal.tsx
var k = "a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex=\"-1\"])", A = [
	"text",
	"search",
	"url",
	"email",
	"tel",
	"password",
	"number",
	"date"
];
function j(e) {
	return e instanceof HTMLElement ? e instanceof HTMLTextAreaElement || e.isContentEditable ? !0 : e instanceof HTMLInputElement && A.includes((e.type || "text").toLowerCase()) : !1;
}
function ee(e) {
	try {
		let t = JSON.parse(localStorage.getItem(e) || "null");
		if (t && t.w > 0 && t.h > 0) return t;
	} catch {}
	return null;
}
function M({ open: e, onClose: t, title: n, subtitle: r, headEnd: i, footer: s, size: l = "md", layout: u = "stack", resizable: d = !1, resizeKey: h, closeButton: v = !0, bare: y = !1, initialFocus: b = "box", onSubmit: x, className: S, children: C }) {
	let w = c(null), T = o(), E = c(t);
	E.current = t;
	let D = c(x);
	return D.current = x, a(() => {
		if (!e) return;
		let t = document.activeElement, n = w.current, r = b === "footer" ? n.querySelector(".tenon-modal__footer button:not([disabled])") : null;
		n.contains(document.activeElement) || (r ?? n.querySelector("[autofocus]") ?? n).focus();
		let i = (e) => {
			if (e.key === "Escape") {
				e.stopPropagation(), E.current();
				return;
			}
			if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
				D.current && n.contains(e.target) && j(e.target) && (e.preventDefault(), D.current());
				return;
			}
			if (e.key !== "Tab") return;
			let t = Array.from(n.querySelectorAll(k));
			if (!t.length) {
				e.preventDefault();
				return;
			}
			let r = t[0], i = t[t.length - 1];
			e.shiftKey && (document.activeElement === r || document.activeElement === n) ? (e.preventDefault(), i.focus()) : !e.shiftKey && document.activeElement === i && (e.preventDefault(), r.focus());
		};
		return document.addEventListener("keydown", i, !0), () => {
			document.removeEventListener("keydown", i, !0), t?.focus?.();
		};
	}, [e, b]), a(() => {
		if (!e || !d || !h || typeof ResizeObserver != "function") return;
		let t = w.current, n = ee(h);
		n && (t.style.width = `${n.w}px`, t.style.height = `${n.h}px`);
		let r = () => ({
			w: t.offsetWidth,
			h: t.offsetHeight
		}), i = r(), a = new ResizeObserver(() => {
			if (!t.isConnected) return;
			let e = r();
			if (!(Math.abs(e.w - i.w) < 2 && Math.abs(e.h - i.h) < 2)) try {
				localStorage.setItem(h, JSON.stringify(e));
			} catch {}
		});
		return a.observe(t), () => a.disconnect();
	}, [
		e,
		d,
		h
	]), e ? m(/* @__PURE__ */ p("div", {
		className: "tenon-modal",
		children: [/* @__PURE__ */ f("div", {
			className: "tenon-modal__scrim",
			onClick: () => E.current()
		}), /* @__PURE__ */ p("div", {
			ref: w,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": T,
			tabIndex: -1,
			className: g("tenon-modal__box", `tenon-modal__box--${l}`, d && "tenon-modal__box--resizable", S),
			children: [
				/* @__PURE__ */ p("div", {
					className: "tenon-modal__head",
					children: [
						/* @__PURE__ */ p("div", {
							className: "tenon-modal__titles",
							children: [/* @__PURE__ */ f("h2", {
								id: T,
								className: "tenon-modal__title",
								children: n
							}), r && /* @__PURE__ */ f("div", {
								className: "tenon-modal__subtitle",
								children: r
							})]
						}),
						i,
						v && /* @__PURE__ */ f(_, {
							variant: "ghost",
							size: "sm",
							iconOnly: !0,
							"aria-label": "Close",
							onClick: () => E.current(),
							children: "×"
						})
					]
				}),
				/* @__PURE__ */ f("div", {
					className: g("tenon-modal__body", u === "split" && "tenon-modal__body--split", y && "tenon-modal__body--bare"),
					children: C
				}),
				s && /* @__PURE__ */ f("div", {
					className: g("tenon-modal__footer", y && "tenon-modal__footer--bare"),
					children: s
				})
			]
		})]
	}), document.body) : null;
}
function te({ aside: e = !1, className: t, children: n }) {
	return /* @__PURE__ */ f("div", {
		className: g("tenon-modal__pane", e && "tenon-modal__pane--aside", t),
		children: n
	});
}
//#endregion
//#region src/components/Textarea/Textarea.tsx
var ne = n(function({ autoGrow: e = !1, invalid: t, className: n, onChange: i, value: a, rows: o = 1, ...l }, u) {
	let d = c(null), p = r(() => {
		let t = d.current;
		t && e && (t.style.height = "auto", t.style.height = `${t.scrollHeight + (t.offsetHeight - t.clientHeight)}px`);
	}, [e]);
	return s(p, [p, a]), /* @__PURE__ */ f("textarea", {
		ref: (e) => {
			d.current = e, typeof u == "function" ? u(e) : u && (u.current = e);
		},
		rows: o,
		value: a,
		"aria-invalid": t ? !0 : void 0,
		className: g("tenon-textarea", e && "tenon-textarea--auto", t && "tenon-textarea--invalid", n),
		onChange: (e) => {
			p(), i?.(e);
		},
		...l
	});
}), N = n(function({ type: e = "text", invalid: t, size: n = "md", className: r, ...i }, a) {
	return /* @__PURE__ */ f("input", {
		ref: a,
		type: e,
		"aria-invalid": t ? !0 : void 0,
		className: g("tenon-input", n === "sm" && "tenon-input--sm", t && "tenon-input--invalid", r),
		...i
	});
}), P = [
	"·",
	"✢",
	"✳",
	"∗",
	"✻",
	"✽",
	"✻",
	"∗",
	"✳",
	"✢"
], F = 110, I = {
	sm: 20,
	md: 20,
	lg: 64
};
function re() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function L(e) {
	let t = e.trim().match(/^#([0-9a-f]{6})$/i);
	if (!t) return null;
	let n = parseInt(t[1], 16);
	return (.2126 * (n >> 16 & 255) + .7152 * (n >> 8 & 255) + .0722 * (n & 255)) / 255;
}
function ie(e, t) {
	let [n, r] = l({ theme: "auto" });
	return a(() => {
		let n = e.current;
		if (!t || !n || typeof getComputedStyle != "function") return;
		let i = () => {
			let e = getComputedStyle(n), t = L(e.getPropertyValue("--tenon-background-default")), i = t === null ? "auto" : t < .5 ? "dark" : "light", a = t === null ? void 0 : e.color;
			r((e) => e.color === a && e.theme === i ? e : {
				color: a,
				theme: i
			});
		};
		i();
		let a = typeof MutationObserver == "function" ? new MutationObserver(i) : null;
		a?.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-theme"],
			subtree: !0
		});
		let o = typeof matchMedia == "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
		return o?.addEventListener("change", i), () => {
			a?.disconnect(), o?.removeEventListener("change", i);
		};
	}, [e, t]), n;
}
function R({ size: e = "md", label: t = "Working", variant: n = "orb", state: r = "solving", className: i, ...o }) {
	let s = c(null), u = ie(s, n === "orb"), [d, m] = l(0);
	return a(() => {
		if (n !== "glyph" || re()) return;
		let e = setInterval(() => m((e) => (e + 1) % P.length), F);
		return () => clearInterval(e);
	}, [n]), /* @__PURE__ */ p("span", {
		ref: s,
		role: "status",
		"aria-label": t,
		className: g("tenon-spinner", `tenon-spinner--${e}`, n !== "ring" && `tenon-spinner--${n}`, i),
		...o,
		children: [n === "glyph" && /* @__PURE__ */ f("span", {
			"aria-hidden": "true",
			children: P[d]
		}), n === "orb" && /* @__PURE__ */ f(h, {
			state: r,
			size: I[e],
			theme: u.theme,
			color: u.color,
			className: "tenon-spinner__orb",
			style: {
				width: void 0,
				height: void 0
			},
			"aria-hidden": "true"
		})]
	});
}
//#endregion
//#region src/components/Pill/Pill.tsx
function ae({ tone: e = "neutral", dot: t = !1, caps: n = !1, className: r, children: i, ...a }) {
	return /* @__PURE__ */ p("span", {
		className: g("tenon-pill", `tenon-pill--${e}`, n && "tenon-pill--caps", r),
		...a,
		children: [t && /* @__PURE__ */ f("span", {
			className: "tenon-pill__dot",
			"aria-hidden": "true"
		}), i]
	});
}
//#endregion
//#region src/components/Alert/Alert.tsx
var oe = {
	neutral: "status",
	info: "status",
	success: "status",
	warning: "alert",
	error: "alert"
};
function se({ tone: e = "neutral", title: t, actions: n, className: r, children: i, ...a }) {
	return /* @__PURE__ */ p("div", {
		role: oe[e],
		className: g("tenon-alert", `tenon-alert--${e}`, r),
		...a,
		children: [
			t && /* @__PURE__ */ f("div", {
				className: "tenon-alert__title",
				children: t
			}),
			i && /* @__PURE__ */ f("div", {
				className: "tenon-alert__body",
				children: i
			}),
			n && /* @__PURE__ */ f("div", {
				className: "tenon-alert__actions",
				children: n
			})
		]
	});
}
//#endregion
//#region src/components/Switch/Switch.tsx
var ce = n(function({ checked: e, onChange: t, className: n, onClick: r, type: i = "button", ...a }, o) {
	return /* @__PURE__ */ f("button", {
		ref: o,
		type: i,
		role: "switch",
		"aria-checked": e,
		className: g("tenon-switch", e && "tenon-switch--on", n),
		onClick: (n) => {
			r?.(n), n.defaultPrevented || t?.(!e);
		},
		...a
	});
});
//#endregion
//#region src/components/SegmentedControl/SegmentedControl.tsx
function le({ options: e, value: t, onChange: n, className: r, ...i }) {
	let a = c(null), o = (t, r) => {
		let i = t.key === "ArrowRight" || t.key === "ArrowDown" ? 1 : t.key === "ArrowLeft" || t.key === "ArrowUp" ? -1 : 0;
		if (i) {
			t.preventDefault();
			for (let t = 1; t <= e.length; t++) {
				let o = e[(r + i * t + e.length * t) % e.length];
				if (!o.disabled) {
					n(o.value), a.current?.querySelector(`[data-value="${CSS.escape(o.value)}"]`)?.focus();
					return;
				}
			}
		}
	};
	return /* @__PURE__ */ f("div", {
		ref: a,
		role: "radiogroup",
		className: g("tenon-segmented", r),
		...i,
		children: e.map((e, r) => {
			let i = e.value === t;
			return /* @__PURE__ */ f("button", {
				type: "button",
				role: "radio",
				"aria-checked": i,
				"data-value": e.value,
				disabled: e.disabled,
				tabIndex: i ? 0 : -1,
				className: g("tenon-segmented__option", i && "tenon-segmented__option--on", e.separatorBefore && "tenon-segmented__option--sep"),
				onClick: () => n(e.value),
				onKeyDown: (e) => o(e, r),
				children: e.label
			}, e.value);
		})
	});
}
//#endregion
//#region src/components/ToggleGroup/ToggleGroup.tsx
function z({ options: e, value: t, onToggle: n, className: r, ...i }) {
	return /* @__PURE__ */ f("div", {
		role: "group",
		className: g("tenon-toggle-group", r),
		...i,
		children: e.map((e) => {
			let r = t.includes(e.value);
			return /* @__PURE__ */ p("button", {
				type: "button",
				"aria-pressed": r,
				"data-value": e.value,
				title: e.title,
				disabled: e.disabled,
				className: g("tenon-toggle-group__option", r && "tenon-toggle-group__option--on", e.className),
				style: e.colour ? { "--tenon-toggle-colour": e.colour } : void 0,
				onClick: () => n(e.value),
				children: [
					e.colour && /* @__PURE__ */ f("i", {
						className: "tenon-toggle-group__dot",
						"aria-hidden": "true"
					}),
					e.label,
					e.count !== void 0 && /* @__PURE__ */ f("span", {
						className: "tenon-toggle-group__count",
						children: e.count
					})
				]
			}, e.value);
		})
	});
}
//#endregion
//#region src/components/ToggleChip/ToggleChip.tsx
function ue({ pressed: e, className: t, type: n = "button", ...r }) {
	return /* @__PURE__ */ f("button", {
		type: n,
		"aria-pressed": e,
		className: g("tenon-toggle-chip", e && "tenon-toggle-chip--on", t),
		...r
	});
}
//#endregion
//#region src/components/StepSlider/StepSlider.tsx
var B = (e, t) => t < 2 ? "50%" : e === 0 ? "var(--step-inset)" : e === t - 1 ? "calc(100% - var(--step-inset))" : `${e / (t - 1) * 100}%`, V = (e, t) => t < 2 ? "50%" : `${e / (t - 1) * 100}%`;
function H({ steps: e, value: t, onChange: n, disabled: r = !1, selectOnNarrow: i = !1, className: a, ...o }) {
	let s = e.length, u = e.findIndex((e) => e.value === t), d = u < 0 ? 0 : u, [m, h] = l(null), _ = c(null), v = (e) => {
		_.current = e, h(e);
	}, y = m ?? d, b = c(null), x = c(null), S = o["aria-label"], C = e[y]?.colour, w = C ? { "--step-color": C } : void 0, T = (t) => {
		t !== d && n(e[t].value);
	}, E = (e) => {
		let t = b.current.getBoundingClientRect();
		return Math.round(Math.min(1, Math.max(0, (e - t.left) / t.width)) * (s - 1));
	}, D = (e) => {
		let t = e.key === "ArrowRight" || e.key === "ArrowUp" ? Math.min(d + 1, s - 1) : e.key === "ArrowLeft" || e.key === "ArrowDown" ? Math.max(d - 1, 0) : e.key === "Home" ? 0 : e.key === "End" ? s - 1 : null;
		t !== null && (e.preventDefault(), T(t));
	}, O = (e) => {
		x.current?.focus(), b.current.setPointerCapture(e.pointerId), v(E(e.clientX));
	}, k = (e) => {
		_.current !== null && v(E(e.clientX));
	}, A = () => {
		let e = _.current;
		e !== null && (v(null), T(e));
	}, j = /* @__PURE__ */ p("div", {
		ref: x,
		role: "slider",
		tabIndex: r ? void 0 : 0,
		"aria-valuemin": 0,
		"aria-valuemax": s - 1,
		"aria-valuenow": y,
		"aria-valuetext": e[y]?.label,
		"aria-disabled": r || void 0,
		className: g("tenon-step-slider", r && "tenon-step-slider--disabled", m !== null && "tenon-step-slider--dragging", !i && a),
		onKeyDown: r ? void 0 : D,
		...i ? { "aria-label": S } : o,
		children: [/* @__PURE__ */ p("div", {
			ref: b,
			className: "tenon-step-slider__track",
			onPointerDown: r ? void 0 : O,
			onPointerMove: k,
			onPointerUp: A,
			onPointerCancel: A,
			children: [
				/* @__PURE__ */ f("div", {
					className: "tenon-step-slider__fill",
					style: {
						...w,
						width: y === 0 ? "0%" : `calc(${B(y, s)} + var(--step-cap))`
					}
				}),
				e.map((e, t) => /* @__PURE__ */ f("span", {
					className: "tenon-step-slider__tick",
					style: { left: V(t, s) }
				}, e.value)),
				/* @__PURE__ */ f("div", {
					className: "tenon-step-slider__handle",
					style: {
						...w,
						left: B(y, s)
					}
				})
			]
		}), /* @__PURE__ */ f("div", {
			className: "tenon-step-slider__stops",
			children: e.map((e, t) => /* @__PURE__ */ f("span", {
				"data-i": t,
				className: g("tenon-step-slider__stop", t === y && "tenon-step-slider__stop--on"),
				style: {
					left: V(t, s),
					maxWidth: `${(100 / s).toFixed(3)}%`
				},
				onClick: r ? void 0 : () => T(t),
				children: e.label
			}, e.value))
		})]
	});
	return i ? /* @__PURE__ */ p("div", {
		className: g("tenon-step-slider-pick", a),
		...o,
		"aria-label": void 0,
		children: [j, /* @__PURE__ */ f("select", {
			className: "tenon-step-slider__select",
			"aria-label": S,
			disabled: r,
			value: d,
			onChange: (e) => T(Number(e.target.value)),
			children: e.map((e, t) => /* @__PURE__ */ f("option", {
				value: t,
				children: e.label
			}, e.value))
		})]
	}) : j;
}
//#endregion
//#region src/components/TagChip/TagChip.tsx
function U({ label: e, value: t = "", tone: n = "neutral", readOnly: r = !1, onCommit: i, className: o }) {
	let [s, u] = l(!1), d = c(null), m = c(!1);
	a(() => {
		s && (d.current?.focus(), d.current?.select());
	}, [s]);
	let h = g("tenon-tag-chip", n === "warning" && "tenon-tag-chip--warning", r && "tenon-tag-chip--readonly", o);
	if (!s) return /* @__PURE__ */ f("button", {
		type: "button",
		className: h,
		disabled: r,
		onClick: () => {
			m.current = !1, u(!0);
		},
		children: t ? `${e}: ${t}` : e
	});
	let _ = (e) => {
		u(!1), e && d.current && i(d.current.value.trim());
	};
	return /* @__PURE__ */ p("span", {
		className: h,
		children: [
			e,
			":",
			" ",
			/* @__PURE__ */ f("input", {
				ref: d,
				type: "text",
				defaultValue: t,
				"aria-label": e,
				className: "tenon-tag-chip__input",
				onBlur: () => {
					m.current || _(!0);
				},
				onKeyDown: (e) => {
					e.key === "Enter" ? (e.preventDefault(), _(!0)) : e.key === "Escape" && (e.preventDefault(), m.current = !0, _(!1));
				}
			})
		]
	});
}
function de({ onAdd: e, onRefuse: t, className: n }) {
	let [r, i] = l(!1), o = c(null), s = c(null), u = c(!1);
	a(() => {
		r && o.current?.focus();
	}, [r]);
	let d = g("tenon-tag-chip", "tenon-tag-chip--add", n);
	if (!r) return /* @__PURE__ */ f("button", {
		type: "button",
		className: d,
		onClick: () => {
			u.current = !1, i(!0);
		},
		children: "+ Add tag"
	});
	let m = () => {
		u.current = !0, i(!1);
	}, h = () => {
		if (u.current) return;
		let n = o.current.value.trim(), r = s.current.value.trim();
		if (!n && !r) {
			m();
			return;
		}
		if (!n || !r) {
			t?.("A tag needs both a key and a value."), o.current.focus();
			return;
		}
		let a = e(n, r);
		if (typeof a == "string") {
			t?.(a), o.current.focus();
			return;
		}
		u.current = !0, i(!1);
	}, _ = (e) => {
		e.key === "Enter" ? (e.preventDefault(), h()) : e.key === "Escape" && (e.preventDefault(), m());
	}, v = () => setTimeout(() => {
		document.activeElement !== o.current && document.activeElement !== s.current && h();
	}, 0);
	return /* @__PURE__ */ p("span", {
		className: d,
		children: [
			/* @__PURE__ */ f("input", {
				ref: o,
				type: "text",
				placeholder: "key",
				"aria-label": "New tag key",
				className: "tenon-tag-chip__input",
				onKeyDown: _,
				onBlur: v
			}),
			": ",
			/* @__PURE__ */ f("input", {
				ref: s,
				type: "text",
				placeholder: "value",
				"aria-label": "New tag value",
				className: "tenon-tag-chip__input",
				onKeyDown: _,
				onBlur: v
			})
		]
	});
}
//#endregion
//#region src/components/Calendar/Calendar.tsx
var fe = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
], W = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
function G(e) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
function K(e) {
	let t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
	return t ? new Date(Number(t[1]), Number(t[2]) - 1, Number(t[3])) : null;
}
function pe({ value: e, onChange: t, today: n, bare: r = !1, className: i, ...a }) {
	let o = n ?? G(/* @__PURE__ */ new Date()), s = K(e) ?? K(o) ?? /* @__PURE__ */ new Date(), [c, u] = l(new Date(s.getFullYear(), s.getMonth(), 1)), d = c.getFullYear(), m = c.getMonth(), h = (new Date(d, m, 1).getDay() + 6) % 7, _ = new Date(d, m + 1, 0).getDate(), v = (e) => u(new Date(d, m + e, 1));
	return /* @__PURE__ */ p("div", {
		className: g("tenon-calendar", i),
		...a,
		children: [
			/* @__PURE__ */ p("div", {
				className: "tenon-calendar__head",
				children: [
					/* @__PURE__ */ f("button", {
						type: "button",
						className: "tenon-calendar__nav",
						title: "Previous month",
						"aria-label": "Previous month",
						onClick: () => v(-1),
						children: "‹"
					}),
					/* @__PURE__ */ p("strong", { children: [
						W[m],
						" ",
						d
					] }),
					/* @__PURE__ */ f("button", {
						type: "button",
						className: "tenon-calendar__nav",
						title: "Next month",
						"aria-label": "Next month",
						onClick: () => v(1),
						children: "›"
					})
				]
			}),
			/* @__PURE__ */ p("div", {
				className: "tenon-calendar__grid",
				children: [
					fe.map((e) => /* @__PURE__ */ f("span", {
						className: "tenon-calendar__weekday",
						title: e,
						children: e[0]
					}, e)),
					Array.from({ length: h }, (e, t) => /* @__PURE__ */ f("span", { className: "tenon-calendar__day tenon-calendar__day--pad" }, `p${t}`)),
					Array.from({ length: _ }, (n, r) => {
						let i = G(new Date(d, m, r + 1));
						return /* @__PURE__ */ f("button", {
							type: "button",
							"data-day": i,
							"aria-pressed": i === e,
							className: g("tenon-calendar__day", i === e && "tenon-calendar__day--on", i === o && "tenon-calendar__day--today"),
							onClick: () => t(i),
							children: r + 1
						}, i);
					})
				]
			}),
			!r && /* @__PURE__ */ p("div", {
				className: "tenon-calendar__foot",
				children: [/* @__PURE__ */ f("button", {
					type: "button",
					className: "tenon-calendar__small",
					"data-day": o,
					onClick: () => t(o),
					children: "Today"
				}), /* @__PURE__ */ f("button", {
					type: "button",
					className: "tenon-calendar__small",
					"data-day": "",
					onClick: () => t(""),
					children: "Clear"
				})]
			})
		]
	});
}
//#endregion
//#region src/components/Calendar/DateButton.tsx
function me({ empty: e = !1, open: t = !1, className: n, type: r = "button", ...i }) {
	return /* @__PURE__ */ f("button", {
		type: r,
		"aria-expanded": t,
		className: g("tenon-date-button", e && "tenon-date-button--empty", n),
		...i
	});
}
//#endregion
//#region src/components/Dropdown/Dropdown.tsx
function he({ options: e, value: t, onChange: n, disabled: r = !1, className: i, "aria-label": o, ...s }) {
	let [u, d] = l(!1), m = c(null), h = e.find((e) => e.value === t);
	a(() => {
		if (!u) return;
		let e = (e) => {
			m.current?.contains(e.target) || d(!1);
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [u]);
	let _ = () => Array.from(m.current?.querySelectorAll("[role=menuitemradio]") ?? []), v = (e) => {
		if (e.key === "Escape") {
			e.preventDefault(), d(!1), m.current?.querySelector("button")?.focus();
			return;
		}
		let t = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
		if (!t) return;
		if (e.preventDefault(), !u) {
			d(!0);
			return;
		}
		let n = _();
		n[(n.indexOf(document.activeElement) + t + n.length) % n.length]?.focus();
	}, y;
	return /* @__PURE__ */ p("div", {
		ref: m,
		className: g("tenon-dropdown", u && "tenon-dropdown--open", i),
		onKeyDown: v,
		...s,
		children: [/* @__PURE__ */ p("button", {
			type: "button",
			className: "tenon-dropdown__button",
			"aria-haspopup": "menu",
			"aria-expanded": u,
			"aria-label": o,
			disabled: r,
			onClick: () => d(!u),
			children: [h?.icon, /* @__PURE__ */ f("span", { children: h?.label ?? "" })]
		}), u && !r && /* @__PURE__ */ f("div", {
			className: "tenon-dropdown__panel",
			role: "menu",
			"aria-label": o,
			children: e.map((e) => {
				let r = e.group !== void 0 && e.group !== y ? e.group : null;
				return y = e.group, /* @__PURE__ */ p("div", {
					className: "tenon-dropdown__entry",
					children: [r && /* @__PURE__ */ f("div", {
						className: "tenon-dropdown__heading",
						children: r
					}), /* @__PURE__ */ p("button", {
						type: "button",
						role: "menuitemradio",
						"aria-checked": e.value === t,
						"data-value": e.value,
						className: g("tenon-dropdown__item", e.value === t && "tenon-dropdown__item--on"),
						onClick: () => {
							d(!1), e.value !== t && n(e.value);
						},
						children: [e.icon, /* @__PURE__ */ f("span", { children: e.label })]
					})]
				}, e.value);
			})
		})]
	});
}
//#endregion
//#region src/components/Menu/Menu.tsx
var ge = t(() => {});
function _e({ trigger: e, triggerLabel: t, triggerVariant: n = "secondary", triggerSize: r = "md", align: i = "start", disabled: o = !1, className: s, children: u, ...d }) {
	let [m, h] = l(!1), v = c(null), y = () => Array.from(v.current?.querySelectorAll("[role=menuitem]:not(:disabled)") ?? []), b = () => {
		h(!1), v.current?.querySelector("button")?.focus();
	};
	return a(() => {
		if (!m) return;
		let e = (e) => {
			v.current?.contains(e.target) || h(!1);
		};
		return document.addEventListener("mousedown", e), y()[0]?.focus(), () => document.removeEventListener("mousedown", e);
	}, [m]), /* @__PURE__ */ p("div", {
		ref: v,
		className: g("tenon-menu", s),
		onKeyDown: (e) => {
			if (e.key === "Escape" && m) {
				e.preventDefault(), b();
				return;
			}
			let t = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
			if (!t) return;
			if (e.preventDefault(), !m) {
				h(!0);
				return;
			}
			let n = y();
			n[(n.indexOf(document.activeElement) + t + n.length) % n.length]?.focus();
		},
		...d,
		children: [/* @__PURE__ */ f(_, {
			variant: n,
			size: r,
			"aria-haspopup": "menu",
			"aria-expanded": m,
			"aria-label": t,
			disabled: o,
			onClick: () => h(!m),
			children: e
		}), m && !o && /* @__PURE__ */ f(ge.Provider, {
			value: b,
			children: /* @__PURE__ */ f("div", {
				className: g("tenon-menu__panel", i === "end" && "tenon-menu__panel--end"),
				role: "menu",
				"aria-label": t,
				children: u
			})
		})]
	});
}
function ve({ onSelect: e, onClick: t, className: n, children: r, ...a }) {
	let o = i(ge);
	return /* @__PURE__ */ f("button", {
		type: "button",
		role: "menuitem",
		className: g("tenon-menu__item", n),
		onClick: (n) => {
			t?.(n), !n.defaultPrevented && (o(), e?.());
		},
		...a,
		children: r
	});
}
function ye({ label: e, className: t, ...n }) {
	return /* @__PURE__ */ f("div", {
		role: "separator",
		className: g("tenon-menu__divider", t),
		...n,
		children: e ? /* @__PURE__ */ f("span", {
			className: "tenon-menu__label",
			children: e
		}) : null
	});
}
_e.Item = ve, _e.Divider = ye;
//#endregion
//#region src/components/Toast/Toast.tsx
var q = [], be = 1, xe = /* @__PURE__ */ new Set(), Se = () => {
	for (let e of xe) e();
}, Ce = (e) => {
	q = e, Se();
};
function we(e, { tone: t = "default", duration: n = 4e3 } = {}) {
	let r = be++;
	Ce([...q, {
		id: r,
		text: e,
		tone: t,
		leaving: !1
	}]);
	let i = () => {
		q.some((e) => e.id === r && !e.leaving) && (Ce(q.map((e) => e.id === r ? {
			...e,
			leaving: !0
		} : e)), setTimeout(() => Ce(q.filter((e) => e.id !== r)), 150));
	};
	return setTimeout(i, n), i;
}
var Te = (e) => (xe.add(e), () => {
	xe.delete(e);
}), Ee = () => q;
function De({ className: e, ...t }) {
	let n = u(Te, Ee, Ee);
	return /* @__PURE__ */ f("div", {
		className: g("tenon-toaster", e),
		...t,
		children: n.map((e) => /* @__PURE__ */ f("div", {
			role: e.tone === "error" ? "alert" : "status",
			className: g("tenon-toast", e.tone !== "default" && `tenon-toast--${e.tone}`, e.leaving && "tenon-toast--leaving"),
			children: e.text
		}, e.id))
	});
}
//#endregion
//#region src/components/AppHeader/AppHeader.tsx
var Oe = ({ tab: e, className: t, current: n, children: r }) => /* @__PURE__ */ f("a", {
	href: e.to,
	className: t,
	"aria-current": n ? "page" : void 0,
	children: r
});
function ke({ brand: e, tabs: t, renderLink: n = Oe, search: r, actions: i, className: a }) {
	return /* @__PURE__ */ p("header", {
		className: g("tenon-app-header", a),
		children: [
			e && /* @__PURE__ */ f("div", {
				className: "tenon-app-header__brand",
				children: e
			}),
			t && t.length > 0 && /* @__PURE__ */ f("nav", {
				"aria-label": "Main",
				children: /* @__PURE__ */ f("ul", {
					className: "tenon-app-header__tabs",
					children: t.map((e) => /* @__PURE__ */ f("li", { children: n({
						tab: e,
						className: "tenon-app-header__tab",
						current: !!e.current,
						children: e.label
					}) }, e.to))
				})
			}),
			/* @__PURE__ */ f("div", { className: "tenon-app-header__gap" }),
			r && /* @__PURE__ */ f("div", {
				className: "tenon-app-header__search",
				children: r
			}),
			i && /* @__PURE__ */ f("div", {
				className: "tenon-app-header__actions",
				children: i
			})
		]
	});
}
//#endregion
//#region src/components/Drawer/Drawer.tsx
var Ae = t(void 0), je = () => i(Ae), Me = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex=\"-1\"])";
function Ne({ open: e, title: t, onClose: n, actions: r, children: i, returnFocus: s, className: u }) {
	let h = c(null), v = c(null), y = o(), [b, x] = l(null), S = c(n);
	S.current = n;
	let C = c(s);
	return C.current = s, a(() => {
		if (!e) return;
		v.current = document.activeElement;
		let t = document.documentElement, n = t.style.overflow;
		t.style.overflow = "hidden", h.current?.focus();
		let r = () => {
			let e = Array.from(h.current?.querySelectorAll(Me) ?? []).filter((e) => !e.closest("[inert]")), t = e.filter((e) => e.getClientRects().length > 0);
			return t.length > 0 ? t : e;
		}, i = (e) => {
			if (e.defaultPrevented || e.isComposing || document.querySelector(".tenon-modal")) return;
			if (e.key === "Escape") {
				e.preventDefault(), S.current();
				return;
			}
			if (e.key !== "Tab" || !h.current) return;
			let t = r();
			if (t.length === 0) {
				e.preventDefault(), h.current.focus();
				return;
			}
			let n = t[0], i = t[t.length - 1], a = document.activeElement, o = h.current.contains(a);
			e.shiftKey && (!o || a === h.current || a === n) ? (e.preventDefault(), i.focus()) : !e.shiftKey && (!o || a === i) && (e.preventDefault(), n.focus());
		};
		return document.addEventListener("keydown", i), () => {
			document.removeEventListener("keydown", i), t.style.overflow = n, [C.current?.(), v.current].find((e) => e?.isConnected)?.focus();
		};
	}, [e]), e ? m(/* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("div", {
		className: "tenon-drawer__scrim",
		"data-testid": "drawer-scrim",
		"aria-hidden": "true",
		onClick: () => S.current()
	}), /* @__PURE__ */ p("div", {
		ref: h,
		className: g("tenon-drawer", u),
		"data-drawer": !0,
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": y,
		tabIndex: -1,
		children: [/* @__PURE__ */ p("div", {
			className: "tenon-drawer__head",
			children: [
				/* @__PURE__ */ f("h2", {
					id: y,
					className: "tenon-drawer__title",
					children: t
				}),
				/* @__PURE__ */ f("div", {
					className: "tenon-drawer__tools",
					ref: x
				}),
				/* @__PURE__ */ p("div", {
					className: "tenon-drawer__actions",
					children: [r, /* @__PURE__ */ f(_, {
						size: "sm",
						variant: "ghost",
						onClick: () => S.current(),
						children: "Close"
					})]
				})
			]
		}), /* @__PURE__ */ f(Ae.Provider, {
			value: b,
			children: /* @__PURE__ */ f("div", {
				className: "tenon-drawer__body",
				children: i
			})
		})]
	})] }), document.body) : null;
}
//#endregion
//#region src/components/Window/Window.tsx
var Pe = 24, Fe = 260, Ie = "cubic-bezier(0.4, 0, 0.2, 1)", Le = [
	"left",
	"top",
	"width",
	"height"
].map((e) => `${e} ${Fe}ms ${Ie}`).join(", "), Re = [
	"n",
	"s",
	"e",
	"w",
	"ne",
	"nw",
	"se",
	"sw"
], ze = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
function J(e) {
	let t = c(e);
	return t.current = e, t;
}
function Be({ open: e, onClose: t, title: n, subtitle: i, headEnd: u, footer: d, rect: h, onRectLive: v, onRectChange: y, growFrom: b, zIndex: x, active: S = !0, peeked: C = !1, onFocus: w, closeButton: T = !0, bare: E = !1, minWidth: D = 420, maxWidth: O = 800, minHeight: k = 320, className: A, children: j, ...ee }) {
	let M = c(null), te = o(), [ne, N] = l(null), [P, F] = l(!1), [I, re] = l(!1), [L, ie] = l(!1), R = c(null), ae = J(t), oe = J(v), se = J(y), ce = J(w), le = J(S), z = J(b), ue = J(I), B = c({
		title: n,
		subtitle: i,
		headEnd: u,
		footer: d,
		children: j,
		rect: h ?? null,
		bare: E,
		className: A,
		rest: ee
	});
	e && (B.current = {
		title: n,
		subtitle: i,
		headEnd: u,
		footer: d,
		children: j,
		rect: h ?? null,
		bare: E,
		className: A,
		rest: ee
	});
	let V = B.current, H = c({
		minWidth: D,
		maxWidth: O,
		minHeight: k
	});
	H.current = {
		minWidth: D,
		maxWidth: O,
		minHeight: k
	};
	let U = r((e) => {
		let t = H.current, n = Math.max(t.minWidth, Math.min(t.maxWidth, e.width)), r = Math.max(t.minHeight, e.height);
		return {
			width: n,
			height: Math.min(r, window.innerHeight - Pe),
			x: Math.max(-n + 120, Math.min(e.x, window.innerWidth - 120)),
			y: Math.max(38, Math.min(e.y, window.innerHeight - 60))
		};
	}, []);
	if (a(() => {
		ue.current || N(null);
	}, [h]), e && !R.current) {
		let e = Math.min(O, window.innerWidth - 48), t = Math.min(680, window.innerHeight - 48 - 40);
		R.current = {
			x: Math.round((window.innerWidth - e) / 2),
			y: Math.round((window.innerHeight - t) / 2) + 12,
			width: e,
			height: t
		};
	}
	a(() => {
		if (!e) {
			F(!1);
			return;
		}
		let t = requestAnimationFrame(() => F(!0));
		return () => cancelAnimationFrame(t);
	}, [e]), s(() => {
		let t = M.current, n = z.current;
		if (!e || !t || !n || ze()) return;
		let r = t.getBoundingClientRect();
		r.width && r.height && t.animate([{
			transform: `translate(${n.left - r.left}px,${n.top - r.top}px) scale(${n.width / r.width},${n.height / r.height})`,
			opacity: .5
		}, {
			transform: "translate(0,0) scale(1,1)",
			opacity: 1
		}], {
			duration: Fe,
			easing: Ie,
			fill: "both"
		});
	}, [e]);
	let [de, fe] = l(e);
	e !== de && (fe(e), ie(!e && !!z.current && !ze())), s(() => {
		let e = M.current, t = z.current;
		if (!L || !e || !t) return;
		let n = e.getBoundingClientRect(), r = !1, i = () => {
			r || (r = !0, ie(!1));
		}, a = e.animate([{
			transform: "translate(0,0) scale(1,1)",
			opacity: 1
		}, {
			transform: `translate(${t.left - n.left}px,${t.top - n.top}px) scale(${t.width / n.width},${t.height / n.height})`,
			opacity: .5
		}], {
			duration: Fe,
			easing: Ie,
			fill: "both"
		});
		a.onfinish = i, a.oncancel = i;
		let o = setTimeout(i, 410);
		return () => clearTimeout(o);
	}, [L]), a(() => {
		!e && !L && (R.current = null);
	}, [e, L]), a(() => {
		if (!e) return;
		let t = (e) => {
			e.key === "Escape" && le.current && (e.target?.closest?.("[data-tenon-editing]") || (e.stopPropagation(), ae.current()));
		};
		return window.addEventListener("keydown", t, !0), () => window.removeEventListener("keydown", t, !0);
	}, [e]), a(() => {
		let t = M.current;
		e && t && !t.contains(document.activeElement) && t.focus({ preventScroll: !0 });
	}, [e]);
	let W = ne ?? V.rect ?? R.current ?? {
		x: 0,
		y: 0,
		width: D,
		height: k
	}, G = J(W), K = (e, t) => {
		t.preventDefault();
		let n = {
			x: t.clientX,
			y: t.clientY,
			rect: { ...G.current }
		};
		re(!0);
		let r = n.rect, i = H.current, a = (t) => {
			let a = t.clientX - n.x, o = t.clientY - n.y, s = n.rect, c;
			if (e === "move") c = U({
				x: s.x + a,
				y: s.y + o,
				width: s.width,
				height: s.height
			});
			else {
				if (c = { ...s }, e.includes("e") && (c.width = s.width + a), e.includes("s") && (c.height = s.height + o), e.includes("w")) {
					let e = Math.max(i.minWidth, Math.min(i.maxWidth, s.width - a));
					c.x = s.x + (s.width - e), c.width = e;
				}
				if (e.includes("n")) {
					let e = Math.max(i.minHeight, s.height - o);
					c.y = s.y + (s.height - e), c.height = e;
				}
				c = U(c);
			}
			r = c, N(c), oe.current?.(c);
		}, o = () => {
			window.removeEventListener("pointermove", a), window.removeEventListener("pointerup", o), r !== n.rect && se.current?.(r), requestAnimationFrame(() => re(!1));
		};
		window.addEventListener("pointermove", a), window.addEventListener("pointerup", o);
	};
	return !e && !L ? null : m(/* @__PURE__ */ f("div", {
		className: "tenon-window-layer",
		style: { zIndex: x },
		children: /* @__PURE__ */ p("div", {
			ref: M,
			role: "dialog",
			"aria-labelledby": te,
			tabIndex: -1,
			className: g("tenon-window", C && "tenon-window--peeked", V.className),
			style: {
				left: W.x,
				top: W.y,
				width: W.width,
				height: W.height,
				transition: I || !P ? "none" : Le
			},
			onPointerDownCapture: () => ce.current?.(),
			...V.rest,
			children: [
				/* @__PURE__ */ p("div", {
					className: "tenon-modal__head tenon-window__head",
					onPointerDown: (e) => {
						e.target.closest("button,a,input,textarea,[contenteditable=\"true\"]") || K("move", e);
					},
					children: [
						/* @__PURE__ */ p("div", {
							className: "tenon-modal__titles",
							children: [/* @__PURE__ */ f("h2", {
								id: te,
								className: "tenon-modal__title",
								children: V.title
							}), V.subtitle && /* @__PURE__ */ f("div", {
								className: "tenon-modal__subtitle",
								children: V.subtitle
							})]
						}),
						V.headEnd,
						T && /* @__PURE__ */ f(_, {
							variant: "ghost",
							size: "sm",
							iconOnly: !0,
							"aria-label": "Close",
							onClick: () => ae.current(),
							children: "×"
						})
					]
				}),
				/* @__PURE__ */ f("div", {
					className: g("tenon-modal__body", V.bare && "tenon-modal__body--bare"),
					children: V.children
				}),
				V.footer && /* @__PURE__ */ f("div", {
					className: g("tenon-modal__footer", V.bare && "tenon-modal__footer--bare"),
					children: V.footer
				}),
				Re.map((e) => /* @__PURE__ */ f("div", {
					className: g("tenon-window__grip", `tenon-window__grip--${e}`),
					"data-edge": e,
					onPointerDown: (t) => K(e, t)
				}, e))
			]
		})
	}), document.body);
}
//#endregion
//#region src/components/Markdown/Markdown.tsx
var Ve = /\[([^[\]\n]+)\]\(([^()\s]+)\)|(https?:\/\/[^\s<>"')\]]+)|\[([^[\]\n]+)\]/g, He = [
	{
		re: /\*\*([^*]+)\*\*/,
		tag: "strong",
		lead: !1
	},
	{
		re: /__([^_]+)__/,
		tag: "strong",
		lead: !1
	},
	{
		re: /(^|[\s(])_([^_]+)_/,
		tag: "em",
		lead: !0
	},
	{
		re: /\*([^*]+)\*/,
		tag: "em",
		lead: !1
	}
];
function Y(e, t) {
	for (let { re: n, tag: r, lead: i } of He) {
		let a = n.exec(e);
		if (!a) continue;
		let o = i ? a[1] : "", s = i ? a[2] : a[1], c = r;
		return [
			...Y(e.slice(0, a.index) + o, `${t}a`),
			/* @__PURE__ */ f(c, { children: Y(s, `${t}i`) }, `${t}m`),
			...Y(e.slice(a.index + a[0].length), `${t}z`)
		];
	}
	return e ? [e] : [];
}
function Ue(e, t) {
	let n = [], r = 0;
	for (let i of e.matchAll(Ve)) {
		let [a, o, s, c] = i;
		if (n.push(...Y(e.slice(r, i.index), `${t}t${r}`)), s !== void 0) n.push(/* @__PURE__ */ f("a", {
			href: s,
			className: "tenon-markdown__link",
			children: o
		}, `${t}l${i.index}`)), r = i.index + a.length;
		else if (c !== void 0) {
			let e = c, o = "";
			for (; /[.,;:!?]$/.test(e);) o = e.slice(-1) + o, e = e.slice(0, -1);
			n.push(/* @__PURE__ */ f("a", {
				href: e,
				className: "tenon-markdown__link",
				children: e
			}, `${t}l${i.index}`)), r = i.index + a.length - o.length;
		} else n.push(/* @__PURE__ */ f("em", {
			className: "tenon-markdown__placeholder",
			children: a
		}, `${t}h${i.index}`)), r = i.index + a.length;
	}
	return n.push(...Y(e.slice(r), `${t}e`)), n;
}
function X(e) {
	return e.split(/(`[^`]+`)/).flatMap((e, t) => t % 2 ? [/* @__PURE__ */ f("code", { children: e.slice(1, -1) }, `c${t}`)] : Ue(e, `p${t}`));
}
function We(e) {
	let t = [], n = [], r = null, i = null, a = () => {
		n.length && (t.push({
			kind: "p",
			lines: n
		}), n = []);
	}, o = () => {
		r &&= (t.push({
			kind: "list",
			...r
		}), null);
	}, s = () => {
		a(), o();
	};
	for (let c of e.replace(/\r/g, "").split("\n")) {
		let e = c.replace(/\s+$/, "");
		if (/^\s*```/.test(e)) {
			i === null ? (s(), i = []) : (t.push({
				kind: "code",
				text: i.join("\n")
			}), i = null);
			continue;
		}
		if (i !== null) {
			i.push(c);
			continue;
		}
		if (!e.trim()) {
			s();
			continue;
		}
		let l = /^\s*\d+[.)]\s+(.*)$/.exec(e), u = l || /^\s*[-*•]\s+(.*)$/.exec(e);
		if (u) {
			let e = !!l;
			r && r.ordered !== e && o(), a(), r ||= {
				ordered: e,
				items: []
			}, r.items.push(u[1]);
			continue;
		}
		let d = /^\s*#{1,6}\s+(.*)$/.exec(e);
		if (d) {
			s(), t.push({
				kind: "h",
				text: d[1]
			});
			continue;
		}
		o(), n.push(e.trim());
	}
	return i !== null && t.push({
		kind: "code",
		text: i.join("\n")
	}), s(), t;
}
function Ge({ children: t, inline: n = !1, className: r }) {
	return n ? /* @__PURE__ */ f("span", {
		className: g("tenon-markdown", r),
		children: X(t)
	}) : /* @__PURE__ */ f("div", {
		className: g("tenon-markdown", r),
		children: We(String(t)).map((t, n) => {
			if (t.kind === "code") return /* @__PURE__ */ f("pre", { children: /* @__PURE__ */ f("code", { children: t.text }) }, n);
			if (t.kind === "h") return /* @__PURE__ */ f("p", {
				className: "tenon-markdown__heading",
				children: X(t.text)
			}, n);
			if (t.kind === "list") {
				let e = t.ordered ? "ol" : "ul";
				return /* @__PURE__ */ f(e, { children: t.items.map((e, t) => /* @__PURE__ */ f("li", { children: X(e) }, t)) }, n);
			}
			return /* @__PURE__ */ f("p", { children: t.lines.map((t, n) => /* @__PURE__ */ p(e, { children: [n > 0 && /* @__PURE__ */ f("br", {}), X(t)] }, n)) }, n);
		})
	});
}
//#endregion
//#region src/components/EditableText/EditableText.tsx
function Ke({ value: e, onCommit: t, hint: n = "Double-click to rename", className: r }) {
	let i = c(null), [o, s] = l(!1), [u, d] = l(e);
	return a(() => {
		o || d(e);
	}, [e, o]), /* @__PURE__ */ f("span", {
		ref: i,
		className: g("tenon-editable", o && "tenon-editable--editing", r),
		title: o ? void 0 : n,
		contentEditable: o,
		suppressContentEditableWarning: !0,
		spellCheck: !1,
		"data-tenon-editing": o ? "" : void 0,
		onDoubleClick: () => {
			s(!0), requestAnimationFrame(() => {
				let e = i.current;
				e && (e.focus(), window.getSelection()?.selectAllChildren?.(e));
			});
		},
		onKeyDown: (t) => {
			(t.key === "Enter" || t.key === "Escape") && (t.preventDefault(), t.stopPropagation(), t.key === "Escape" && i.current && (i.current.textContent = e), i.current?.blur());
		},
		onBlur: o ? () => {
			let n = i.current;
			if (s(!1), !n) return;
			let r = (n.textContent || "").trim();
			r && r !== e ? t(r) : n.textContent = e;
		} : void 0,
		onPointerDown: (e) => {
			o && e.stopPropagation();
		},
		children: u
	});
}
//#endregion
//#region src/components/Disclosure/Disclosure.tsx
function qe({ summary: e, open: t, defaultOpen: n = !1, onOpenChange: r, className: i, children: a }) {
	let [o, s] = l(n), c = t ?? o;
	return /* @__PURE__ */ p("div", {
		className: g("tenon-disclosure", c && "tenon-disclosure--open", i),
		children: [/* @__PURE__ */ p("button", {
			type: "button",
			className: "tenon-disclosure__head",
			"aria-expanded": c,
			onClick: () => {
				t === void 0 && s(!c), r?.(!c);
			},
			children: [/* @__PURE__ */ f("span", {
				className: "tenon-disclosure__twist",
				"aria-hidden": "true",
				children: c ? "⌄" : "›"
			}), e]
		}), c && /* @__PURE__ */ f("div", {
			className: "tenon-disclosure__panel",
			children: a
		})]
	});
}
//#endregion
//#region src/components/Reorder/reorderCore.ts
var Je = "data-tenon-reorder", Ye = "data-tenon-drop", Xe = "data-tenon-dragging", Z = "data-tenon-axis", Ze = "data-tenon-grip", Qe = (e, t) => e === t || !!e && !!t && e.key === t.key && e.after === t.after;
function Q(e, t, n, r) {
	let i = e.getBoundingClientRect();
	return r === "x" ? t > i.left + i.width / 2 : n > i.top + i.height / 2;
}
function $e(e, t, n) {
	if (!n.after) return n.key;
	let r = e.filter((e) => e !== t), i = r.indexOf(n.key);
	return i + 1 < r.length ? r[i + 1] : null;
}
function et(e, t, n) {
	let r = e.dataTransfer;
	if (r && (r.effectAllowed = "move", r.setData("text/plain", t), n)) {
		let t = n.getBoundingClientRect();
		r.setDragImage(n, e.clientX - t.left, e.clientY - t.top);
	}
}
var tt = (e) => {
	setTimeout(e, 0);
};
function $(e) {
	e.preventDefault(), e.stopPropagation(), e.dataTransfer && (e.dataTransfer.dropEffect = "move");
}
//#endregion
//#region src/components/Reorder/useReorder.ts
function nt(e, t, n) {
	let r = e.filter((e) => e !== t), i = n == null ? r.length : Math.max(0, r.indexOf(n));
	return r.splice(i, 0, t), r;
}
function rt(e, t, n) {
	if (!n.length) return e;
	let r = new Map(n.map((e, t) => [e, t]));
	return e.map((e, i) => ({
		item: e,
		r: r.get(t(e)) ?? n.length + i
	})).sort((e, t) => e.r - t.r).map((e) => e.item);
}
function it({ keys: e, onMove: t, axis: n = "y" }) {
	let [r, i] = l(null), [a, o] = l(null), s = c(null), u = c(null), d = (e) => {
		Qe(u.current, e) || (u.current = e, o(e));
	}, f = () => {
		s.current = null, u.current = null, i(null), o(null);
	}, p = () => {
		let n = s.current, r = u.current;
		n && r && r.key !== n && t(n, $e(e, n, r)), f();
	}, m = (e) => Q(e.currentTarget, e.clientX, e.clientY, n);
	return {
		item: (e) => {
			let t = r && r !== e && a && a.key === e ? a.after ? "after" : "before" : null;
			return {
				dragging: r === e,
				drop: t,
				handleProps: {
					draggable: !0,
					onDragStart: (t) => {
						t.stopPropagation(), et(t, e, t.currentTarget.closest("[data-tenon-reorder]")), s.current = e, tt(() => {
							s.current === e && i(e);
						});
					},
					onDragEnd: f
				},
				itemProps: {
					"data-tenon-reorder": e,
					"data-tenon-drop": t ?? void 0,
					"data-tenon-dragging": r === e ? "" : void 0,
					onDragOver: (t) => {
						s.current && ($(t), d(s.current === e ? null : {
							key: e,
							after: m(t)
						}));
					},
					onDrop: (t) => {
						s.current && ($(t), s.current !== e && d({
							key: e,
							after: m(t)
						}), p());
					}
				}
			};
		},
		listProps: {
			"data-tenon-axis": n,
			onDragOver: (e) => {
				s.current && $(e);
			},
			onDrop: (e) => {
				s.current && ($(e), p());
			}
		},
		dragging: r
	};
}
//#endregion
//#region src/components/Reorder/bindReorder.ts
function at(e, t) {
	let { onMove: n, axis: r = "y", grip: i = `[${Ze}]`, item: a = `[${Je}]`, keyOf: o = (e) => e.getAttribute("data-tenon-reorder") ?? "" } = t;
	e.setAttribute(Z, r);
	let s = null, c = null, l = (t) => {
		let n = t instanceof Element ? t.closest(a) : null;
		for (; n && n.parentElement?.closest("[data-tenon-axis]") !== e;) n = n.parentElement?.closest(a) ?? null;
		return n;
	}, u = () => Array.from(e.querySelectorAll(a)).filter((t) => t.parentElement?.closest(`[${Z}]`) === e).map(o), d = (e) => {
		Qe(c, e) && c?.el === e?.el || (c?.el.removeAttribute(Ye), c = e, e && e.el.setAttribute(Ye, e.after ? "after" : "before"));
	}, f = () => {
		s?.el.removeAttribute(Xe), d(null), s = null;
	}, p = (t) => {
		let n = t.target instanceof Element ? t.target.closest(i) : null;
		n && e.contains(n) && l(n) && (n.draggable = !0);
	}, m = (e) => {
		let t = e.target instanceof Element ? e.target.closest(i) : null, n = t && l(t);
		if (!n) return;
		e.stopPropagation();
		let r = o(n);
		et(e, r, n);
		let a = {
			key: r,
			el: n
		};
		s = a, e.target.addEventListener("dragend", f, { once: !0 }), tt(() => {
			s === a && n.setAttribute(Xe, "");
		});
	}, h = (e) => {
		if (!s) return;
		$(e);
		let t = l(e.target);
		if (!t) return;
		let n = o(t);
		d(n === s.key ? null : {
			key: n,
			el: t,
			after: Q(t, e.clientX, e.clientY, r)
		});
	}, g = (e) => {
		if (!s) return;
		$(e);
		let t = l(e.target);
		t && o(t) !== s.key && d({
			key: o(t),
			el: t,
			after: Q(t, e.clientX, e.clientY, r)
		});
		let i = s.key, a = c, p = u();
		f(), a && a.key !== i && n(i, $e(p, i, a));
	}, _ = (e) => {
		s && $(e);
	};
	return e.addEventListener("pointerdown", p), e.addEventListener("dragstart", m), e.addEventListener("dragenter", _), e.addEventListener("dragover", h), e.addEventListener("drop", g), e.addEventListener("dragend", f), () => {
		f(), e.removeAttribute(Z), e.removeEventListener("pointerdown", p), e.removeEventListener("dragstart", m), e.removeEventListener("dragenter", _), e.removeEventListener("dragover", h), e.removeEventListener("drop", g), e.removeEventListener("dragend", f);
	};
}
//#endregion
//#region src/components/Reorder/DragHandle.tsx
function ot({ className: e, ...t }) {
	return /* @__PURE__ */ f("span", {
		className: g("tenon-draghandle", e),
		"aria-hidden": "true",
		"data-tenon-grip": "",
		...t,
		children: /* @__PURE__ */ p("svg", {
			viewBox: "0 0 10 16",
			fill: "currentColor",
			"aria-hidden": "true",
			draggable: !1,
			children: [
				/* @__PURE__ */ f("circle", {
					cx: "3",
					cy: "3",
					r: "1.3"
				}),
				/* @__PURE__ */ f("circle", {
					cx: "7",
					cy: "3",
					r: "1.3"
				}),
				/* @__PURE__ */ f("circle", {
					cx: "3",
					cy: "8",
					r: "1.3"
				}),
				/* @__PURE__ */ f("circle", {
					cx: "7",
					cy: "8",
					r: "1.3"
				}),
				/* @__PURE__ */ f("circle", {
					cx: "3",
					cy: "13",
					r: "1.3"
				}),
				/* @__PURE__ */ f("circle", {
					cx: "7",
					cy: "13",
					r: "1.3"
				})
			]
		})
	});
}
function st(e) {
	return `<span class="${e ? `tenon-draghandle ${e}` : "tenon-draghandle"}" aria-hidden="true" data-tenon-grip=""><svg viewBox="0 0 10 16" fill="currentColor" aria-hidden="true" draggable="false">${[
		[3, 3],
		[7, 3],
		[3, 8],
		[7, 8],
		[3, 13],
		[7, 13]
	].map(([e, t]) => `<circle cx="${e}" cy="${t}" r="1.3"></circle>`).join("")}</svg></span>`;
}
//#endregion
//#region src/components/Reorder/DropLine.tsx
function ct({ className: e, ...t }) {
	return /* @__PURE__ */ f("div", {
		className: g("tenon-dropline", e),
		"aria-hidden": "true",
		...t
	});
}
//#endregion
export { se as Alert, ke as AppHeader, x as Badge, _ as Button, pe as Calendar, b as Card, C as Column, w as ColumnEmpty, me as DateButton, qe as Disclosure, ot as DragHandle, Ne as Drawer, ct as DropLine, he as Dropdown, Ke as EditableText, O as Field, N as Input, v as LinkButton, Ge as Markdown, _e as Menu, M as Modal, te as ModalPane, ae as Pill, le as SegmentedControl, D as Select, R as Spinner, T as Stat, H as StepSlider, ce as Switch, S as Tag, U as TagChip, de as TagChipAdd, ne as Textarea, De as Toaster, ue as ToggleChip, z as ToggleGroup, Be as Window, rt as applySavedOrder, at as bindReorder, g as cx, st as dragHandleHTML, X as inlineNodes, nt as reorderKeys, G as toIsoDate, we as toast, je as useDrawerTools, it as useReorder };
