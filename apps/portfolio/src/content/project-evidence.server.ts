import type { ProjectSlug } from './projects';

export interface ProjectEvidence {
  readonly sourceRevision: string;
  readonly sourceNotes: readonly string[];
  readonly claimNotes: readonly string[];
}

/** Build-only provenance; public content must not imply the source apps were run. */
export const projectEvidence = {
  realestate: {
    sourceRevision: '7d25a6553a6dd2a2fd4b01a410f365c92c6d5b89',
    sourceNotes: ['README.md, including Team and Credits and Known limitations', 'real_estate_db.py', 'property_validation.py', 'inquiry_validation.py', 'analytics_queries.py'],
    claimNotes: ['Repository credits Yousef with architecture, modules, analytics, schema, tests, and front-end design; retain its collaborator credit.', '274 passing tests is a repository report, not a test run for this portfolio.', 'No authentication, CSRF protection, or production deployment is established.'],
  },
  spacedrums: {
    sourceRevision: 'e1964f4a198cbbf916b1bf891b84077c7f318b3f',
    sourceNotes: [
      'Only https://github.com/youseffahem/air_drum_project; main at the pinned revision',
      'README.md and pyproject.toml; reviewed 3 November 2026',
      'src/spacedrums/app/play.py, app/main.py, app/pipeline.py; configs/product.candidate.yaml',
      'src/spacedrums/app/play.py selects fingertip, ordinary visible-stick or red-tip perception; stick/visible.py',
      'src/spacedrums/geometry/kit_layout.py, geometry/four_pad.py, commit/policy.py; configs/demo.fullkit.candidate.yaml',
      'src/spacedrums/calib/automatic.py, calib/reach.py, calib/developer_demo.py',
      'src/spacedrums/audio/README.md, audio/bank.py, audio/scheduler.py, audio/mixer.py, app/audio_out.py; assets/samples/LICENSES.md',
      'src/spacedrums/ui/ar/gl.py, ui/ar/view.py; OpenGL implementation and classic fallback in app/play.py',
      'src/spacedrums/models/gbdt/train.py, models/temporal/gru.py, models/temporal/tcn.py; training and replay evaluation modules',
      'docs/reports/phase-09-gbdt.md, phase-10-model-comparison.md, phase-18-final-evaluation.md, standing-product-v1.md',
      'Prior contribution audit retained in docs/portfolio/spacedrums-source-audit.md; latest static review in academic-positioning-review.md',
    ],
    claimNotes: [
      'Current source implements index-fingertip, visible-stick and red-tip modes. It supersedes the October unpublished-fingertip description.',
      'Public title is Space Drums; airDrums appears once as the CV alias. Repository URL and route are preserved.',
      'Current product uses reactive Arm A. Model research code and synthetic results do not establish a deployed learned anticipator.',
      'Synthetic fixtures and developer recordings do not establish participant outcomes, physical accuracy, all-pad reliability or action-to-sound latency.',
      'SpaceDrums source tests were inspected, not run. No camera, speakers, model or source application was executed for this portfolio task.',
      'Contribution is development and integration, not sole authorship. MediaPipe, Oramics/TR-505 and Alexander Holm’s Salamander Drumkit retain third-party attribution; no source assets are copied.',
    ],
  },
  heartguard: {
    sourceRevision: 'cda2aaf0595a21b2bcf32ca0d7eda50ba0dc9d51',
    sourceNotes: ['README.md', 'results/final_optimized_models_info.json', 'ui/app.py', 'notebooks/01_data_preprocessing.ipynb, 02_pca_analysis.ipynb, 03_feature_selection.ipynb, 04_supervised_learning.ipynb, 06_hyperparameter_tuning.ipynb (code cells read, not executed)'],
    claimNotes: ['Profile claims of 85.2% Random Forest accuracy, Docker, and GitHub Actions conflict with pinned project evidence; omit them.', 'Educational study only; no clinical validity, independent reproduction, production deployment, or passing tests claimed.', 'Saved metadata selects Logistic Regression by test F1; no estimator was deserialized or executed during audit.', 'Notebook code fits scaling/PCA/feature selection before downstream splits; five-fold CV does not remove this leakage.', 'The UI sends raw form values to the saved estimator without the training scaler; inference consistency is not established.', 'XGBoost is implemented for feature importance, not one of the four supervised comparison families.'],
  },
  'gym-app': {
    sourceRevision: '31cd783aaad6ef4ad9f59679c054ffbbe1c37f01',
    sourceNotes: ['README.md', 'lib/main.dart', 'lib/models/exercise.dart', 'lib/models/workout.dart', 'lib/screens/login_screen.dart', 'lib/screens/exercises_screen.dart', 'lib/screens/workouts_screen.dart', 'lib/screens/profile_screen.dart', 'Public repository tree'],
    claimNotes: ['Source supports a Flutter browsing prototype with local lists and setState.', 'README-only claims of Provider, Hive, Firebase, biometrics, analytics, 1,000 exercises, coverage, and CI are not supported by this source tree.', 'No pubspec.yaml is present; do not claim a complete runnable build or an MIT license file.'],
  },
  'arduino-projects': {
    sourceRevision: '1e384ebb5245db6d77dc85eb91f0e31fa3c4609f',
    sourceNotes: ['README.md', 'Arduino-Projects-Collection/Controlled-LED/Controlled_LED.ino', 'Arduino-Projects-Collection/Disco-Strobe-Light/Disco_Strobe_Light.ino', 'Arduino-Projects-Collection/Light-Dimmer/Light_Dimmer.ino', 'Arduino-Projects-Collection/Memory-Game/Memory_Game.ino', 'Arduino-Projects-Collection/Plant-Monitor/Plant_Monitor.ino'],
    claimNotes: ['Five source sketches are present; no hardware, compile, timing, or recording authenticity check was performed.', 'Strobe uses blocking delay rather than the README microsecond/non-blocking description.', 'Memory_Game.ino ends without its final closing brace and declares pin arrays as boolean; no complete working-game claim.'],
  },
  'gesture-volume': {
    sourceRevision: '8cc4be4d39820694cc6d796256bc387de33bf483',
    sourceNotes: ['README.md', 'HciVoliom/HandTrackingModule.py', 'HciVoliom/VolumeHandControl.py'],
    claimNotes: ['Windows camera/audio application; source inspected without accessing a camera or changing audio.', 'Frame-rate readout is an implemented UI element, not a measured performance result.'],
  },
  'digits-classifier': {
    sourceRevision: 'fedb606a70c72cb9956d04d1e8a60f343d3ca748',
    sourceNotes: ['README.md', 'project/main.py', 'project/result.txt; default branch is master'],
    claimNotes: ['Source uses a non-stratified 70/30 split; omit README stratification and controlled-depth claims.', 'README metrics 98.89% / 85.28% disagree with result.txt 98.70% / 84.63%; omit headline accuracy.', 'DecisionTreeClassifier has no fixed random_state; do not claim a fully deterministic experiment.'],
  },
  'hospital-management': {
    sourceRevision: 'fe29c709f5b16522400b4845a8fa488104bd2e90',
    sourceNotes: ['README.md', 'Hospital.cpp'],
    claimNotes: ['Data-structures exercise with in-memory records; not a clinical or deployed hospital product.', 'Patient removal uses name; branch search and doctor removal use ID.', 'No persistence, real appointment scheduling, duplicate checking, compile result, or runtime verification claimed.'],
  },
} as const satisfies Readonly<Record<ProjectSlug, ProjectEvidence>>;
