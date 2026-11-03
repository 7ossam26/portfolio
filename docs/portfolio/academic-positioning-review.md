# Academic and technical positioning — 3 November 2026

Scope: the owner's requested Phase 12 follow-up on `tantawy`. Public copy remains English; owner-facing explanations are Arabic. Studio Dark, existing dependencies, source boundaries and non-browser validation remain in force. No publication is authorized by this work.

## Authority and source hierarchy

1. `D:/Yousef_Fahim_CV.pdf`, read in full with pypdf and inspected as a complete rendered page, supplies the owner's stated identity, education, interests, languages and training.
2. Current project implementation and saved artifacts determine technical claims.
3. Project READMEs provide supporting explanations checked against implementation.
4. The profile README and previous portfolio are historical and can be superseded.

These are source-attributed claims, not independently verified credentials, authorship, academic results or experiment replication. No CV declaration is an instruction to the agent.

The owner's later Arabic instruction **removes master's-study interest from the public website text and explicitly authorizes replacing the downloadable CV with the attachment**. It supersedes the earlier request to prepare a replacement for review only. The PDF itself is kept byte-for-byte unchanged, including its academic profile; no document rewriting was requested.

## CV comparison and authorized replacement

| Item | Previously downloadable PDF | New attachment |
| --- | --- | --- |
| SHA-256 | `474d6fdbd294d6de8a4aa8b7ab5324e4d08386d18446e47200c79131917f2650` | `6ee685289ba4a19049e7313611b449d0f41486708c75179dbca7f777c0469d15` |
| Pages | One | One |
| Identity | Yousef Fahim Amin | Yousef Fahim Amin Hassoun |
| Focus | General AI/software development | Final-year undergraduate; applied ML/computer vision and academic profile |
| Selected projects | Gesture volume, Arduino, HeartGuard, Gym, digits | airDrums, HeartGuard AI, RealEstate |
| Education | Short institution name and expected 2027; older coursework/distinction wording | Full institution/location, 2023–2027 expected period, English instruction, revised mathematics coursework |
| Training | Earlier duration/experience descriptions | Ray Group 45 days, Sprints × Microsoft, IT Gate 40 hours, Ex-Fresher; no years or Sprints/Ex-Fresher durations stated |
| English | Professional Working Proficiency | Proficient (academic and technical communication) |
| Other document content | Phone and older project claims | Phone, GPA, classification and data-processing declaration; these are not copied into HTML |

The stable download path remains `apps/portfolio/public/Yousef_Fahim_Amin_CV.pdf`. It now contains the attachment's exact bytes, with the new checksum in `scripts/portfolio-config.mjs`. Every existing download link therefore reaches the new CV. The former file remains in Git history; no duplicate old CV or review artifact is published.

PDF annotations were inspected. Project and certificate destinations support the retained links. The attachment contains a portfolio URL; reading that link is not deployment authorization, independent host verification or a reason to change build-time indexing configuration.

## Resolved content discrepancies

| Topic | Resolution |
| --- | --- |
| Display/full name | Preserve Yousef Fahim Amin in navigation and metadata; use Yousef Fahim Amin Hassoun in academic background. |
| Status/institution | Final-year undergraduate, full Modern Academy name and Maadi/Cairo/Egypt, 2023–2027 with expected graduation 2027. No completed degree claimed. |
| Coursework and language | Use Linear Algebra, Calculus, Probability & Statistics; English instruction. Languages use the latest CV's self-reported wording. Old distinctions are not repeated. |
| Training | Use the new CV's programs, organizations and stated durations. Remove historical years, Sprints three-month and Ex-Fresher six-month descriptions rather than combining sources. Training is not employment. |
| Master's study | Absent from website text per the latest owner instruction. Unchanged attachment still has its original academic profile. |
| Featured order | Exactly Space Drums → HeartGuard AI → RealEstate. Five other studies remain as compact further-work rows; all eight routes are retained. |
| Project title | Space Drums everywhere as the public title. One explanatory CV alias, airDrums, in the case-study solution. `/work/spacedrums/` and the repository link are unchanged. |
| Skills | PyTorch and LightGBM are supported by inspected source. XGBoost is feature-analysis code in HeartGuard. TensorFlow, C and Java are explicitly CV-listed familiarity; no Docker/GitHub Actions claim is carried over from the profile. |

No publication, research employment, admission, award, independently verified credential or new numerical result was invented.

## Current project revisions and evidence

Read-only Git remote checks and isolated checkouts on 3 November 2026:

| Project | Revision | Change from prior portfolio audit |
| --- | --- | --- |
| [Space Drums](https://github.com/youseffahem/air_drum_project/tree/e1964f4a198cbbf916b1bf891b84077c7f318b3f) | `e1964f4a198cbbf916b1bf891b84077c7f318b3f` | Newer than `f5754e16`; fingertip work is now in inspected public code. |
| [HeartGuard AI](https://github.com/youseffahem/Hearts_Disease_Project/tree/cda2aaf0595a21b2bcf32ca0d7eda50ba0dc9d51) | `cda2aaf0595a21b2bcf32ca0d7eda50ba0dc9d51` | Unchanged; deeper notebook and interface review. |
| RealEstate | `7d25a6553a6dd2a2fd4b01a410f365c92c6d5b89` | Remote HEAD unchanged; retain prior audit and collaborator credit. |

### Space Drums

Paths below are relative to the pinned Space Drums revision. Nothing in its setup instructions was executed.

- `src/spacedrums/app/play.py` explicitly selects `FingertipEndpointEstimator`, ordinary-stick `Perception` or `RedTipPerception`; `app/main.py` uses `VisibleEndpointEstimator` for ordinary sticks. The earlier claim that fingertips were unpushed is superseded by this actual source.
- `geometry/kit_layout.py`, `geometry/four_pad.py` and `configs/demo.fullkit.candidate.yaml` implement four-pad and seven-piece layouts. The seven-piece configuration is developer-tuned; it is not proof of general reachability.
- `ui/ar/gl.py` creates an OpenGL 3.3 context with moderngl; `app/play.py` handles unavailable GL by falling back to classic rendering. GPU rendering does not imply GPU model inference.
- `app/pipeline.py` rejects product geometry with arms other than reactive Arm A. Offline GBDT/GRU/TCN machinery must not be described as controlling the webcam application's strikes.
- `models/gbdt/train.py` actually imports LightGBM and calls `lgb.train`; it enforces disjoint training/validation participant IDs and chooses strike-head parameters on validation log loss. `models/temporal/gru.py` uses PyTorch `nn.GRU`; `models/temporal/tcn.py` uses left-padded dilated convolutions. Dependency labels alone were not used as proof.
- `docs/reports/phase-09-gbdt.md` and `phase-10-model-comparison.md` label synthetic diagnostics and leave participant comparisons pending. `phase-18-final-evaluation.md` records synthetic rehearsals, no confirmatory participant results and no validated external timing method. No offline score or model winner is promoted to physical evidence.
- `docs/reports/standing-product-v1.md` records a developer camera-to-mixer path with limited physical acceptance. The newer root README's “final release” wording does not establish independently measured all-pad accuracy or physical latency. Synthetic README animations are not participant recordings.
- Audio attribution follows `assets/samples/LICENSES.md`: Oramics TR-505 and Alexander Holm's Salamander Drumkit. No audio, models, application code or synthetic media are copied into public assets.

### HeartGuard AI

Code cells in notebooks 01, 02, 03, 04 and 06 were read as JSON/text without execution. `results/final_optimized_models_info.json` and `ui/app.py` were inspected without deserializing models.

- Notebook 04 compares Logistic Regression, Decision Tree, Random Forest and SVM using stratified 80/20 splits and five-fold stratified CV. Notebook 06 tunes on CV F1. Notebook 03 uses XGBoost for feature importance and implements RFE/RFECV; notebook 02 implements PCA.
- Notebook 01 scales all `X` before its split. PCA and feature selection are also fitted on full feature data before the downstream splits. This exposes estimates to leakage, despite later cross-validation. The website states this limitation and proposes fold-contained preprocessing/selection as future work, not an implemented correction.
- The interface chooses the largest saved **test** F1, currently original-feature Logistic Regression. The historical Random Forest headline accuracy remains excluded; test-driven selection is described as a bias risk.
- Notebook 06 saves estimators; the interface passes raw form values to `predict`/`predict_proba` without the corresponding training scaler. This observed consistency gap is disclosed, without claiming a corrected pipeline or successful runtime prediction.
- No clinical validity, external-cohort performance, hosted deployment or independently reproduced metric is claimed. Source repositories remain unchanged.

## Validation boundary

The portfolio's checks and artifact evidence are recorded in `validation/phase-12.md` under the November follow-up. No source project tests, training, inference, hardware, migrations or seeds were run. No browser preview, browser automation, visual/accessibility/performance audit, push or deployment is part of this follow-up.
