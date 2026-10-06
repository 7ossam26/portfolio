# SpaceDrums — published source audit

Reviewed 6 October 2026 for a bounded portfolio update before Phase 12. The only SpaceDrums source repository inspected was [youseffahem/air_drum_project](https://github.com/youseffahem/air_drum_project), public `main` at **`f5754e16c32632e506ed25f804755e8fbd358064`**. GitHub API, the public tree, `git ls-remote`, and a local read-only source checkout agreed on this revision. Only `main` was advertised as a branch at review time. No alternative SpaceDrums repository was used.

## Version clarification

The first request called the current version fingertip-based. Inspection instead found a product that uses hand landmarks to locate **visible drumstick endpoints**. The owner then explicitly confirmed that the fingertip implementation is newer, local, unpushed work in the same project, and authorized describing the published drumstick-endpoint implementation.

The portfolio therefore separates:

- **Published implementation:** the pinned drumstick-endpoint source described below.
- **In development:** a newer local fingertip iteration, supported only by the owner's clarification. Its code was not inspected. No public commit, branch, URL, architecture, behavior, measurements, or completion claim is invented for it.

## README and evidence precedence

There is no root `README.md` in the inspected revision. [`pyproject.toml`](https://github.com/youseffahem/air_drum_project/blob/f5754e16c32632e506ed25f804755e8fbd358064/pyproject.toml#L16) points to [`src/spacedrums/README.md`](https://github.com/youseffahem/air_drum_project/blob/f5754e16c32632e506ed25f804755e8fbd358064/src/spacedrums/README.md). That README, the hands/audio/calibration/app/test READMEs, product configuration, executable source, tests, ADR-0045, and the standing-product report were inspected.

Some package README status tables and `project-discovery.md` describe older plans or research ambitions. Actual product composition and configuration take precedence. The user guide also predates the latest live-run note: section 20 of the standing-product report records a partial camera-to-mixer path, while still withholding physical acceptance. That does not establish an accepted playable product.

## Claim-to-source map

All file references in this table are relative to the sole repository and pinned revision above. They describe code or documented evidence, not programs executed during this portfolio review.

| Portfolio topic | Supported finding | Source files |
| --- | --- | --- |
| Overview, problem, solution | Webcam virtual drumming; distinguish measured strikes from idle motion, map them to pads, and trigger local audio. The published product is a candidate. | `project-discovery.md`; `docs/decisions/ADR-0045-standing-four-pad-product.md`; `app/play.py`; `app/pipeline.py` under `src/spacedrums/` |
| Current architecture | `app.play` composes capture, perception, automatic calibration, measured geometry, commit checks, and audio. Product mode admits reactive Arm A, not the learned research arms. | `src/spacedrums/app/play.py:51`; `src/spacedrums/app/pipeline.py:206`; `configs/product.candidate.yaml:43` |
| Computer vision and MediaPipe | OpenCV camera frames feed the MediaPipe Tasks Hand Landmarker. Coordinate conversion and identity assignment precede grip-based visible-stick estimation. | `src/spacedrums/hands/landmarker.py:139`; `hands/coords.py`; `hands/identity.py`; `hands/grip.py`; `app/main.py:96` |
| Hand versus fingertip tracking | Product mode constructs `VisibleEndpointEstimator`; its striking point is an image-supported stick endpoint. Named finger landmarks in `grip.py` and `HAND_TIP` in zone metadata are not a fingertip product mode. | `src/spacedrums/app/main.py:103`; `stick/visible.py:119`; `stick/visible.py:158`; `hands/grip.py:43`; `geometry/four_pad.py:58` |
| Virtual drum zones | Four pads: Crash/Ride, Hi-Hat, Snare, Tom 1. Mirroring affects display rather than decision coordinates; geometry permits either hand for each zone. Physical reachability is unverified. | `src/spacedrums/geometry/four_pad.py`; `tests/product/test_four_pad_product.py:65`; ADR-0045 |
| Strike detection | Current-frame endpoint evidence, measured downstroke/top-edge crossing, travel and gap checks, rebound re-arming, earliest pad in the stroke, per-hand commit/refractory controls. | `src/spacedrums/app/pipeline.py:331`; `geometry/strokes.py:82`; `commit/policy.py`; `commit/refractory.py` |
| Audio pipeline | Hash-checked local sample bank, time-targeted scheduler, polyphonic callback mixer, late-event accounting, intensity-to-gain proxy. | `src/spacedrums/audio/README.md`; `audio/bank.py`; `audio/gain.py`; `audio/scheduler.py`; `audio/mixer.py`; `app/audio_out.py` |
| Sample provenance | Recorded TR-505 samples come from the Oramics collection. Do not imply the owner recorded them. | `assets/samples/LICENSES.md`; `assets/samples/recorded-manifest.json` |
| Calibration | Automatic standing/reach/validation stages use body reference and measured endpoints, fit four pads jointly, and reject inadequate evidence. Audio starts for verification; a retry stops it. Explicit developer fixed-guide mode does not claim calibration success. | `src/spacedrums/calib/automatic.py`; `calib/reach.py`; `calib/developer_demo.py`; `hands/body.py`; `app/play.py:227` |
| Real-time processing | Bounded frame queue, processing loop, separate audio callback, monotonic timestamps, diagnostic frame/timing/audio reports. | `src/spacedrums/capture/frame_queue.py`; `capture/source.py`; `app/play.py`; `audio/device.py`; `audio/mixer.py`; `timing/` |
| Testing | Tests are present for pad mapping, simultaneous events, negative trajectories, gaps, repeated-hit suppression, causality, calibration, scheduling and mixing. Presence is not a newly reproduced passing result. | `tests/product/test_four_pad_product.py`; `test_calibration_flow.py`; `test_developer_demo.py`; `tests/audio/`; `tests/commit/`; `tests/tracking/` |
| Current status | Developer prototype; latest documented live run records Crash/Ride events reaching the mixer. Audibility, intended-hit matching, all-four-pad acceptance and physical latency remain unverified. | `docs/reports/standing-product-v1.md:438–516`; `docs/gates/phase-18-gate.md` |
| Future work | Independently checked endpoint/stroke labels, perception reliability, reachable calibration, physical repeated/simultaneous strike validation and independent action-to-sound measurement. | `docs/reports/standing-product-v1.md:289–303` and latest section 20 |

## Contribution evidence

The public history contains 33 commits under the owner's matching name/email. Focused changes include `1917788` (hands/stick/tracking), `36f2d4e` (geometry/audio), `8b56d858` (product entry point, visible endpoints, measured strokes), and `94a5393529` (product refinements and tests). This supports describing development and integration across the pipeline, calibration, diagnostics, and focused tests. It does not establish sole authorship, independent research validation, or successful physical acceptance. The repository also records assisted development/review; pretrained models and audio assets retain their third-party origin.

## Excluded claims and actions

- No accuracy, FPS, latency, coverage percentage, user count, achievement, passed hardware result, or predictive-model benefit appears as a portfolio claim.
- No claim that the local fingertip version is published, inspected, completed, or backed by a public revision.
- No source tests, model inference, camera, audio device, setup script, or repository application was executed. Repository reports and tests were read as evidence only.
- No SpaceDrums source, samples, recordings, or model assets were copied into public portfolio assets. The portfolio contains an explanatory flow diagram, not a working demo or fabricated screenshot.
- No source repository modification, commit, push, or publication. The ignored source checkout remains at the same revision with a clean working tree.

Portfolio checks and the original addition are recorded in [`validation/phase-11-spacedrums.md`](validation/phase-11-spacedrums.md). The subsequently authorized Phase 12 editorial consolidation is recorded in [`validation/phase-12.md`](validation/phase-12.md); it retains this source revision and the same evidence boundaries.
