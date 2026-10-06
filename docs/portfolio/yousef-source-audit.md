# Yousef portfolio — source and claim audit

Audit date: 6 October 2026. Scope: replace the portfolio owner's public content with Yousef's identity and work while retaining the Studio Dark presentation. The user's exact requested display name, **Yousef Fahim Amin**, overrides the spelling used in older repository materials. The current request supersedes the historical Ahmed project selection; it does not authorize changes to any referenced project repository or publication to Ahmed's host.

## Evidence method

Read the public profile README, all seven root project READMEs, repository metadata and file trees, and the focused implementation files listed below. GitHub's API supplied the full default-branch commit IDs; implementation reads used those pinned IDs. The README is a useful starting point, but implementation and saved artifacts take precedence when they contradict its claims. Architectural tradeoffs in the case studies are explanations of the observed implementation, not invented accounts of Yousef's personal intent.

Only read-only HTTP requests and static source inspection were used. No source setup command, migration, seed, notebook, serialized model, camera application, Arduino sketch, or project test suite was executed. No source application was mounted in this portfolio. All seven content records have `demoAvailable: false`; flow diagrams are labeled as diagrams, and no fabricated application screenshots are supplied. Browser QA remains deferred under the standing project instruction.

## Pinned sources

The subsequent SpaceDrums addition is documented in [its dedicated source audit](spacedrums-source-audit.md). It adds an eighth case study from `youseffahem/air_drum_project` at `f5754e16c32632e506ed25f804755e8fbd358064`. The published drumstick-endpoint candidate is distinct from the owner-confirmed, unpushed fingertip iteration that is in development. The original seven-project review below remains its historical evidence record.

| Source | Default branch | Revision | README |
| --- | --- | --- | --- |
| Profile | main | `fd22bb16d062f7392517712d79539fec49fe725f` | [Profile README](https://github.com/youseffahem/youseffahem/blob/fd22bb16d062f7392517712d79539fec49fe725f/README.md) |
| RealEstate | main | `7d25a6553a6dd2a2fd4b01a410f365c92c6d5b89` | [RealEstate README](https://github.com/youseffahem/RealEstate/blob/7d25a6553a6dd2a2fd4b01a410f365c92c6d5b89/README.md) |
| Hearts_Disease_Project | main | `cda2aaf0595a21b2bcf32ca0d7eda50ba0dc9d51` | [HeartGuard README](https://github.com/youseffahem/Hearts_Disease_Project/blob/cda2aaf0595a21b2bcf32ca0d7eda50ba0dc9d51/README.md) |
| Gym-App | main | `31cd783aaad6ef4ad9f59679c054ffbbe1c37f01` | [Gym App README](https://github.com/youseffahem/Gym-App/blob/31cd783aaad6ef4ad9f59679c054ffbbe1c37f01/README.md) |
| Arduino-Projects-Collection | main | `1e384ebb5245db6d77dc85eb91f0e31fa3c4609f` | [Arduino README](https://github.com/youseffahem/Arduino-Projects-Collection/blob/1e384ebb5245db6d77dc85eb91f0e31fa3c4609f/README.md) |
| hand-gesture-volume-control | main | `8cc4be4d39820694cc6d796256bc387de33bf483` | [Gesture control README](https://github.com/youseffahem/hand-gesture-volume-control/blob/8cc4be4d39820694cc6d796256bc387de33bf483/README.md) |
| Digits-Classifier-Comparison | master | `fedb606a70c72cb9956d04d1e8a60f343d3ca748` | [Digits README](https://github.com/youseffahem/Digits-Classifier-Comparison/blob/fedb606a70c72cb9956d04d1e8a60f343d3ca748/README.md) |
| Hospital-Management-System | main | `fe29c709f5b16522400b4845a8fa488104bd2e90` | [Hospital exercise README](https://github.com/youseffahem/Hospital-Management-System/blob/fe29c709f5b16522400b4845a8fa488104bd2e90/README.md) |

## Identity and background

The profile presents a software engineering focus spanning Flask/MySQL applications, applied machine learning, computer vision, Flutter, and embedded C/C++. It lists Egypt as the location and these contact destinations:

- Email: `yousef.fahem11@gmail.com`
- GitHub: `https://github.com/youseffahem`
- LinkedIn: `https://www.linkedin.com/in/yousef-fahem/`
- X: `https://x.com/YousefFahem0`

The current profile lists Modern Academy, Maadi, B.Sc. Computer Science, 2023–2027; Microsoft and Sprints AI/ML Summer Camp in 2024; Ex-Fresher Python programming (six months); IT-GATE AI/ML in 2025; and Ray Group full-stack development with Python in 2026. These are education/training entries, not evidence of employment at those organizations. Certificate destinations are source links, not independently validated credentials. The parent implementation also reviewed a user-supplied CV; this source audit does not itself claim to have parsed that artifact.

The profile uses “Youssef Fahem Amin,” and older project documents sometimes append “Hasson.” The user's exact current spelling controls the portfolio. Older contact/name variants in project READMEs should not override the current profile and user instruction. No years-of-experience total, employer history, paid client claim, availability claim, or project impact metric is inferred.

## RealEstate

Inspected `README.md`, focused schema and validation sections in `real_estate_db.py`, `property_validation.py`, `inquiry_validation.py`, and `analytics_queries.py`, plus the repository tree and commit author metadata.

Supported copy:

- Flask/Jinja2 server-rendered application with MySQL, parameterized query modules, property/agent/inquiry flows, image galleries, and aggregate analytics.
- Six relational tables; `RESTRICT` for property type/location, `SET NULL` for an agent, and `CASCADE` for a property's images/inquiries. Decimal money and explicit status/check constraints exist in source.
- The inquiry validator rejects backward status moves. Do not imply that every stage must be visited: the inspected validator allows a forward jump.
- Validation is separated from database queries and receives valid foreign-key IDs as inputs.
- The README credits Yousef with architecture, application modules, analytics, schema/tests, and the front-end design system. It separately credits **Ahmed** for agent detail/photo support and extended displays. Public copy preserves that contribution without claiming sole authorship. Commit `31634683b651f17d673070d476bd9985974ffa12` has author name Ahmed and GitHub login `AhmedMohsen30`; there is no basis to replace that name with the old portfolio owner's surname.

Limits: the 274-pass figure is the repository's reported historical test result, not new validation. The README explicitly identifies missing authentication/authorization, CSRF protection, and upload size/type hardening. No production readiness or deployed client usage is claimed. Source setup would create/seed a database and is outside this audit.

## HeartGuard AI

Inspected `README.md`, `results/final_optimized_models_info.json`, and `ui/app.py` at the pinned commit. The tree and README identify notebook/data/result/model artifacts. Serialized model files were not loaded.

The profile and current project README disagree materially:

| Profile claim | Pinned evidence / copy decision |
| --- | --- |
| Random Forest leads at 85.2% accuracy, 0.847 F1, 0.901 AUC | The current project README corrects these figures. Saved metadata and the UI selection loop select original-feature Logistic Regression: test accuracy `0.6229508196721312`, F1 `0.6101694915254238`, AUC `0.6908602150537635`. Public portfolio omits headline metrics. |
| Four model families include XGBoost | The supervised comparison uses Logistic Regression, Decision Tree, Random Forest, and SVM. XGBoost appears among feature-importance methods, not as one of those four comparison families. |
| Docker and GitHub Actions deployment | Current project README states no Dockerfile, CI workflow, or hosted deployment is present. These are omitted. |
| A broadly deployable risk system | The source is a baseline educational study on a small public cohort, with no external-cohort or clinical validation. Public copy explicitly retains the educational/non-medical scope. |

The UI reads saved metadata and chooses the highest recorded **test** F1. Case-study text describes that observed criterion and its limitation; it does not endorse using a test set as an independent final evaluation after selection. Notebook preprocessing/inference compatibility was not executed or verified. The project README flags truncated PCA/clustering JSON and absent automated tests; do not convert “pytest declared” into a passing-test claim. No medical recommendations or personal health assessment are offered by the portfolio.

## Gym App

Read `README.md`, `lib/main.dart`, both model files, and login, exercise-list, workout-list, and profile screens. The tree contains seven screens and assets but no `pubspec.yaml`, platform build directories, tests, CI workflow, service modules, or license file.

The actual implementation supports a **Flutter browsing prototype**: local exercise/workout lists, name search using `setState`, model objects passed to detail routes, a home section, and a profile/logout route. `login_screen.dart` calls `Navigator.pushReplacement` directly without authenticating.

The README describes Provider/Hive/Firestore/Firebase Auth, biometrics, social sign-in, 1,000+ exercises, analytics, progressive overload, test percentages, CI, and broader production functionality. These claims are not supported by the checked-in source and are omitted. The public stack is Flutter, Dart, and Material widgets. Do not claim a fully runnable release from this incomplete tree or reinterpret the login screen as real authentication. The README's MIT language is not an independently verified license file.

## Arduino Projects

Read the collection README and all five `.ino` files under `Arduino-Projects-Collection/`.

- Controlled LED directly maps button state to LED state; it does not implement a latched press-to-toggle state.
- Disco Strobe Light maps an analog input to a 10–500 millisecond delay and writes two LEDs explicitly. The source uses blocking `delay`, not the README's microsecond timing, array sequencing, or non-blocking behavior.
- Light Dimmer reads the potentiometer and writes `potValue / 4` to its PWM pin, with a short delay.
- Plant Monitor logs changing readings and drives its LED/buzzer above a fixed raw-reading threshold of 900. Do not imply calibrated soil moisture percentages or a cloud monitoring service.
- Memory Game contains sequence/input arrays and buzzer logic, but the pinned file ends without the final closing brace and declares pin arrays as `boolean`, which cannot preserve the intended pin integers. Public copy notes repair is needed; it does not claim a verified complete game.

Five experiments are present as source, not five newly proven working hardware demos. The README includes decorative instrument graphics and claims recorded hardware feeds; neither hardware behavior nor recording authenticity was independently checked. No source/media assets are copied into the portfolio.

## Hand Gesture Volume Control

Read `README.md`, `HciVoliom/HandTrackingModule.py`, and `HciVoliom/VolumeHandControl.py`.

OpenCV supplies camera frames; MediaPipe returns landmarks. The control script measures landmark 4–8 distance with `math.hypot` and interpolates a 50–300 pixel range to a 0–1 volume scalar for PyCAW's Windows endpoint. It also draws the points, volume bar/percentage, and FPS counter. The separate tracking module supports the documented architecture.

The portfolio describes this source behavior without claiming measured frame rate, robust gesture accuracy, arbitrary-platform support, or a live browser demo. Camera and system volume were not accessed.

## Digits Classifier Comparison

Read `README.md`, `project/main.py`, and `project/result.txt`. The default branch is `master`.

- Both models share a 70/30 split with `random_state=42`, but the actual call has **no `stratify` parameter**. The profile/README's stratification claim is omitted.
- Source constructs default `SVC()` and `DecisionTreeClassifier()`; the README's controlled tree depth and fixed tree seed are not implemented. Avoid claiming fully deterministic results.
- Saved `result.txt` reports SVC `0.9870` and Decision Tree `0.8463` on 540 test records. The README instead advertises `0.9889`/`0.8528` and includes a 450-record report. Public copy omits those inconsistent headline metrics rather than inventing a resolution.
- The script writes both classification reports and renders both confusion matrices. Its console line for `tree_report` mistakenly prints `svc_report`; the written result uses the correct variable. No script execution or repair was performed here.
- This is scikit-learn's 8×8 digits dataset, not an assertion of full MNIST benchmark performance. Generalization, timing, and production inference claims are omitted.

## Hospital Management System

Read `README.md` and `Hospital.cpp`. The source file is `Hospital.cpp`, although README compilation examples refer to `main.cpp`.

Three node structures and list classes model branches, doctors, and patients. Source confirms head insertion, traversal, branch search by ID, doctor deletion by ID, and patient deletion by **name**. The profile's generalized delete-by-ID wording is narrowed accordingly.

The data is in memory, appointments are integer counts, and the implementation lacks persistent storage, actual calendar booking, duplicate prevention, and whitespace-aware string input. It is presented as a C++ data-structures exercise, with no hospital deployment or real patient-data claim. Compilation and runtime behavior were not tested in this task.

## Content and provenance outcome

The seven content records keep RealEstate first, then HeartGuard, Gym App, and Arduino as the four featured projects. Gesture control, digit classification, and the hospital exercise form further work. Only RealEstate has a specific personal contribution field because its source provides explicit contributor attribution. No role duration, sole ownership, clients, adoption, financial outcome, or employment was invented for the other records.

`projects.ts` retains the existing content interface and exports while adding optional `featured`; `project-evidence.server.ts` maps all seven slugs to exact revisions, inspected paths, and claim limits. No dependency is installed and no external source code is copied. Links preserve source provenance without making an unsupported license declaration.

This audit is static evidence only. Type/build/static results for the integrated portfolio belong in the personalization validation record; historical tests and browser scores from the old owner's portfolio do not validate these new pages.

## Phase 11 review — 6 October 2026

The active copy was checked again against the pinned audit and the existing CV review. No new personal facts were needed. RealEstate's lead-handling sentence now explicitly allows forward jumps to Contacted or Closed and rejects backward moves. The embedded skill description now names sensor/GPIO/PWM/serial work and interactive game logic instead of implying an implemented state-machine architecture. The introduction makes the documented Computer Science student status explicit while keeping the software-engineering focus.

No employer, internship, new achievement, project metric, availability or completed degree was added. Java and TensorFlow/Keras remain supported by the supplied CV; Docker and GitHub Actions remain profile-listed skills without being presented as demonstrated project deployments. The RealEstate collaborator's exact first-name credit is preserved.

The supplied PDF remains unchanged under D33, including its broader Gym/Firebase description and digit-classifier score. Those details are not repeated as verified claims on the website: the active case studies follow the public implementation and the conflicting-metric limits above. A later CV update would require the owner's revised document or a separate request to revise it. Phase 11 did not re-execute the source applications, training experiments, hardware, or project tests.
