# ETO Competition Resources

The VIGIL team's submission to **IDSOL 2026 — Emerging Technologies Olympiads (ETO)**, the competition the [www.vigil.green](https://www.vigil.green/) platform (the code in this repository) was built for.

Team VIGIL: **Pham Duy Long** (captain, The Olympia School) · **Nguyen Duc Anh** (Foreign Language Specialized School) · **Do Nhat Quang** (Vinschool The Harmony).

| Document | Contents |
|---|---|
| [Whitepaper](VIGIL_IDSOL2026_Whitepaper.pdf) | *VIGIL: An Interpretable Machine Learning Pipeline for Deforestation Risk Prediction in Vietnam at 1 km Resolution* (5 pages): the three data pillars, the 1 km grid pipeline, Table II(A)/(B) results, the web platform, the path to nationwide scale and ethical considerations. |
| [Poster](VIGIL_IDSOL2026_Poster.pdf) | IDSOL26VN posterboard: background, system and training pipelines, AUC / Cap@5% for both evaluation scenarios, glossary. |
| [Pitch deck](VIGIL_IDSOL2026_Pitch_Deck.pdf) | 26 presentation slides: problem, vision, methodology, results, web platform, limitations and ethics, the four-layer scaling model, business plan, team. |

Headline results (whitepaper, Table II):

| Scenario | Baseline | Logistic regression | Random forest |
|---|---|---|---|
| Provided split — AUC | 0.504 | 0.817 | **0.861** |
| Transfer K'Bang → Mang Yang — AUC | 0.376 | **0.589** | 0.535 |

The website also serves the whitepaper and poster at `/papers/` (identical copies in [`frontend/public/papers/`](../frontend/public/papers/)).
