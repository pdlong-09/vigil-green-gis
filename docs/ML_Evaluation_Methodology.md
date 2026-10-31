# Methodology & Evaluation of the Deforestation-Warning AI Model

This document details how the machine-learning model of the **"Gia Lai Province Deforestation Risk Warning System"** was built, trained and tested. It is written to support the scientific explanation of the project in front of the judging panel.

---

## 1. Research Objective
Build a proactive monitoring framework that predicts which areas face high deforestation risk at 1 km × 1 km resolution, instead of only counting forest loss after it has happened.

## 2. Data Sources & Predictors (Features)
The model does not rely on a single image source; it combines several spatial data layers (multi-source satellite data) to capture the ecological factors that affect the forest:

*   **Target label:** `loss_any_2001_2024` — the historical record of forest actually lost, taken from the `lossyear` layer of **Hansen Global Forest Change (v1.12)**, for cells with `treecover2000 ≥ 30%`. Samples are balanced 50/50. The model learns from forest that has disappeared in the past.
*   **Input features (X_features):**
    *   **Terrain:** elevation (`mean_elevation_m`) and slope (`mean_slope_deg`) from **NASA SRTM**.
    *   **Climate:** 12-month rainfall total and 2000–2024 mean annual rainfall from **CHIRPS**.
    *   **Biological:** baseline forest cover in 2000 (`treecover2000`).
    *   **Optical:** bands B2, B3, B4, B8, B11, B12 and the NDVI and NBR indices from **Sentinel-2** (2023).
*   Distance to roads and land tenure are **not** inputs yet; they are planned next steps.

---

## 3. Training & Algorithms
We applied and compared three approaches:

1.  **Baseline risk score:** a transparent z-score of the standardised predictors that does not learn from the data. It serves as the benchmark.
2.  **Logistic regression:** used for **interpretability**. It shows the weight (coefficient) of each factor: higher rainfall and lower elevation/slope go with higher risk. It is also the best model under area transfer.
3.  **Random forest:** captures non-linear relationships and gives the highest AUC on the provided split, but drops more than logistic regression on a district it has never seen.

---

## 4. Validation Scenarios
To check that the model does **not overfit** and can be used in practice, testing has two scenarios:

### Scenario 1: Standard evaluation (provided split)
*   **How:** pool the 6,000 cells of both districts and split them into 4,788 training cells and 1,212 test cells (620 with forest loss).
*   **Purpose:** measure how well risk is ranked within the same data region.

### Scenario 2: Area transfer validation 🌟 (the key differentiator)
*   **How:** the model is trained **entirely on K'Bang District** (4,000 cells), then predicts blind on **all of Mang Yang District** (2,000 cells, 1,000 with forest loss).
*   **Purpose:** see how much ranking ability survives in a district the model has never seen. Performance **drops clearly** because of differences in land use, roads and enforcement, but a prioritisation signal remains. Each new province therefore needs local re-validation before use.

---

## 5. Evaluation Metrics & Practical Value

Instead of plain accuracy, which is misleading with imbalanced data, we use domain metrics:

*   **Discrimination (AUC — area under the curve):** the probability that the model ranks a randomly chosen loss cell above a randomly chosen no-loss cell (0.5 is random guessing). Results (whitepaper, Table II):

    | Scenario | Baseline | Logistic regression | Random forest |
    |---|---|---|---|
    | Provided split (1,212 cells) | 0.504 | 0.817 | **0.861** |
    | Transfer K'Bang → Mang Yang (2,000 cells) | 0.376 | **0.589** | 0.535 |

*   **Capture rate (top 5% / 10%):** the share of loss cells that fall within the 5% (or 10%) of cells ranked highest-risk. Because the test set is balanced 50/50, Cap@5% can reach at most about 0.098; logistic regression reaches 0.089 (about 90% of that ceiling) and still leads under transfer (0.062).
    *   **How to present it to the judges:** *"Ranger resources are limited; nobody can patrol 100% of the forest every day. The model ranks cells by risk so rangers can patrol the top-ranked cells first. It is a prioritisation aid that needs local calibration and validation, not proof of wrongdoing at any specific location."*

## 6. Transparency, Not a "Black Box" (Explainability)
Unlike neural networks, which are often seen as black boxes, the project's random forest and logistic regression models produce a **feature importance** chart.
In the random forest feature importance, `treecover2000`, elevation, slope and the two rainfall variables rank highest. These outputs show which factors the model relies on to rank cells; they do **not** prove causation. A sensitivity check with an alternative forest-loss label definition gave consistent conclusions.

---
*This document summarises the methodology implemented in `src/pipeline.py` for presenting the project.*
