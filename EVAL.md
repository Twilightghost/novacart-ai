# NovaCart AI — Evaluation

This document reports actual measured results from evaluating NovaCart AI's search, recommendation, and RAG systems. No numbers here are invented — every score is the output of a script in `scripts/evaluation/`, runnable and reproducible.

## Search Evaluation: Keyword-only vs Hybrid (Semantic + Keyword + RRF)

**Method:** 8 hand-written test queries, each paired with manually-judged relevant products. Two metrics computed for both approaches:
- **Precision@5** — of the top 5 results, what fraction are relevant?
- **Mean Reciprocal Rank (MRR)** — how high up does the first relevant result appear? (1.0 = first position, 0.5 = second, etc.)

**Results:**

| Metric | Keyword-only | Hybrid (Semantic + RRF) |
|---|---|---|
| Precision@5 | 0.250 | 0.250 |
| Mean Reciprocal Rank | 0.938 | 1.000 |

**Interpretation:** Precision@5 showed no difference between approaches — on this small 20-product catalog with test queries that mostly shared exact vocabulary with product names, both methods surfaced the same relevant items somewhere in the top 5. MRR revealed what Precision@5 couldn't: hybrid search consistently ranks the *first* relevant result higher. The clearest example — for "gift for someone who works from home," keyword-only search ranked the most relevant match (ComfortFit Ergonomic Chair) second, while hybrid search correctly promoted it to first place via Reciprocal Rank Fusion.

**A known limitation of this evaluation:** most test queries shared exact words with product titles/descriptions (e.g., "running" → "Running Shoes"), which is exactly where keyword search already performs well. A qualitative test outside this formal set — querying "something to keep my drink cold" — returned HydroFlow Steel Water Bottle as the #1 semantic result despite zero shared vocabulary, demonstrating semantic search's core value proposition even though it doesn't show up as a *quantitative* difference in this particular small-catalog evaluation. At a larger catalog scale, we would expect keyword search to fail outright on more queries, widening this gap.

## RAG Shopping Assistant

**Guardrail verification (qualitative):**
- Domain restriction: asked "what's the capital of France?" — assistant correctly declined and redirected to shopping topics.
- Grounding: asked "what laptop is good for programming?" — assistant recommended PixelBook Pro 14 Laptop by exact name and price (₹68999), matching the real product record, with `sources` citing the actual product ID used.

### RAG Guardrail Test Suite

**Method:** 6 automated test cases in `scripts/evaluation/testRagGuardrails.js`, each checking a specific guardrail property (domain restriction, grounding, no-fabrication, graceful fallback, no fake personal data, price accuracy) using pattern-matching on the assistant's actual response.

**Result: 6/6 tests passing.**

**A limitation worth noting (and a real bug we caught):** the initial version of the "no fabricated products" test flagged a false failure — the assistant correctly responded "we do not have any flying cars available," but the test naively checked only for the substring "flying car" appearing in the response, without distinguishing negation ("we don't have X") from confirmation ("we do have X"). The assistant's behavior was correct throughout; the test logic was fixed to check for negation patterns near availability language. This highlights a broader limitation of keyword-based guardrail testing: it can produce false positives and negatives, and a more rigorous approach would use a second LLM call as a semantic "judge" rather than pattern matching — a natural next step for this evaluation suite.

## Recommendation Systems

- **Similar Products:** embedding-based nearest-neighbor lookup via Chroma, verified working correctly (e.g., AeroFlex Running Shoes surfaces other footwear/sport items).
- **Frequently Bought Together:** co-occurrence computed from real order data (12 seeded orders); verified AeroFlex Running Shoes correctly surfaces RunLight Reflective Jacket, FitTrack Smart Watch, and YogaFlex Non-Slip Mat, matching the seeded bundle.
- **Personalized Recommendations:** weighted average of a user's interaction embeddings (view=1, add_to_cart=3, purchase=5), verified working end-to-end with a real logged-in account's browsing history.

**Not yet measured:** formal Hit Rate@5 / Precision@K against a held-out test set (see Future Improvements).

## Review Intelligence

**Method:** 16 seeded reviews across 5 products, batch-processed once via Gemini with structured JSON output (schema-constrained: sentiment, summary, pros, cons), cached in MongoDB rather than recomputed per page view.

**Result:** sentiment correctly reflected review content — e.g., AeroFlex Running Shoes (containing one negative review about sole durability among mostly positive reviews) was correctly classified as "mixed" rather than "positive," with the specific durability complaint surfaced in the cons list.

## Future Improvements to This Evaluation

- Expand the search test set beyond 8 queries, including more queries deliberately designed to have zero keyword overlap with relevant products, to better isolate semantic search's contribution.
- Replace keyword-based guardrail testing with an LLM-as-judge approach for more semantically robust pass/fail detection.
- Run a formal ~20-question RAG evaluation scoring correctness, groundedness, and hallucination rate on a larger, more diverse question set.
- Compute Hit Rate@5 for personalized recommendations using held-out interaction data.