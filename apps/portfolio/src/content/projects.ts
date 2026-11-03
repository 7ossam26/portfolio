export const projectSlugs = ['spacedrums', 'heartguard', 'realestate', 'gym-app', 'arduino-projects', 'gesture-volume', 'digits-classifier', 'hospital-management'] as const;

export type ProjectSlug = (typeof projectSlugs)[number];

export interface ProjectCapability {
  readonly label: string;
  readonly detail: string;
}

export interface EngineeringDecision {
  readonly title: string;
  readonly detail: string;
  readonly tradeoff: string;
}

export interface ProjectMedia {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly caption: string;
}

export interface ProjectDetail {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface ProjectContent {
  readonly slug: ProjectSlug;
  readonly name: string;
  readonly domain: string;
  readonly summary: string;
  readonly distinction: string;
  readonly problem: string;
  readonly solution?: string;
  readonly role?: string;
  readonly contribution?: string;
  readonly featured?: boolean;
  readonly capabilities: readonly ProjectCapability[];
  readonly decisions: readonly EngineeringDecision[];
  readonly flow: readonly string[];
  readonly demoSummary: string;
  readonly stack: readonly string[];
  readonly repositoryUrl: string;
  readonly demoAvailable: boolean;
  readonly media?: readonly ProjectMedia[];
  readonly details?: readonly ProjectDetail[];
}

export const projects = [
  {
    slug: 'spacedrums',
    name: 'Space Drums',
    domain: 'Computer vision & motion prediction',
    featured: true,
    summary: 'A webcam drumming application with fingertip and drumstick interaction, plus separate offline motion-prediction experiments.',
    distinction: 'Implemented interaction and model experiments are documented separately from physical measurements that remain unresolved.',
    problem: 'A webcam drum kit must locate the striking point, distinguish a deliberate downstroke from idle motion, and trigger one sound per strike. The research question is whether causal prediction can reduce action-to-sound latency without unacceptable false hits or timing error.',
    solution: 'Space Drums, called airDrums in my CV, connects webcam perception, pad geometry, duplicate-hit suppression and local sample playback. Its reactive application and offline prediction experiments have separate evidence and limits.',
    role: 'Project development',
    contribution: 'My development and integration work spans capture, perception, strike geometry, calibration, audio, replay diagnostics and focused tests, alongside the offline model-training and evaluation pipeline.',
    capabilities: [
      { label: 'Three interaction modes', detail: 'The application implements bare index-fingertip tracking, image-supported ordinary-stick endpoints, and colour-based red-tip tracking.' },
      { label: 'Webcam application', detail: 'Four-pad and seven-piece layouts, classic and GPU-rendered AR views, calibration and recorded-sample playback.' },
      { label: 'Offline model experiments', detail: 'LightGBM GBDT and PyTorch GRU/TCN pipelines explore motion prediction using synthetic and developer data, without a demonstrated physical latency benefit.' },
    ],
    decisions: [
      { title: 'Keep measured interaction separate from prediction', detail: 'OpenCV supplies frames; MediaPipe supports hand perception, with a different endpoint estimator for each mode. Measured downward crossings, rebound re-arming and per-hand commit checks drive the application. Product geometry accepts reactive Arm A only.', tradeoff: 'The learned models can be evaluated through research code, but they do not drive strikes in the webcam application.' },
      { title: 'Separate rendering, audio and calibration evidence', detail: 'A bounded capture queue feeds the decision loop; committed strikes enter a scheduler and callback mixer. The OpenGL AR view has a classic-view fallback. Automatic calibration fits and checks four-pad layouts; the seven-piece developer layout can be adjusted and saved.', tradeoff: 'A developer-tuned layout is not population validation. Software timestamps and reported audio-stream latency do not measure physical action-to-sound delay.' },
    ],
    details: [
      { id: 'offline-experiments', title: 'Offline GBDT, GRU & TCN experiments', paragraphs: [
        'LightGBM trains a flattened-window GBDT baseline with strike, time-to-impact and displacement outputs. PyTorch implements a unidirectional GRU and a causal, dilated-convolution TCN. Training and replay evaluation code compare prediction with reactive and rule-based baselines.',
        'The evaluation framework separates participant groups, selects operating points on validation data, and measures false/missed hits, timing error and trajectory error. The intended participant comparison remains pending; no model winner or generalization result is claimed.',
      ] },
      { id: 'data-and-evidence', title: 'Synthetic and developer evidence', paragraphs: [
        'Available evidence consists of synthetic fixtures, scripted rehearsals and developer recordings. Synthetic participant identifiers are not real participants; README animations are scripted illustrations. These materials exercise the software and evaluation pipeline, not a completed participant study.',
        'Source tests cover causality, geometry, repeated-hit suppression, calibration and audio behavior. The repository reports developer runs and test results; models, tests, camera and speakers were not rerun for this portfolio.',
      ] },
      { id: 'audio-provenance', title: 'Audio and model provenance', paragraphs: [
        'Playback uses hash-checked local samples and a polyphonic mixer. The Oramics TR-505 recordings and Alexander Holm’s Salamander Drumkit are third-party assets, as are the pretrained MediaPipe models. Motion-derived loudness is an intensity proxy, not a physical force measurement.',
      ] },
      { id: 'open-research', title: 'Open measurements & research questions', paragraphs: [
        'Independent physical strike accuracy, all-pad reliability and externally measured action-to-sound latency remain unresolved. The saved evaluation report has no confirmatory participant result or validated external timing method.',
        'The next research steps are independently labelled strokes, evaluation beyond developer data, and controlled reactive-versus-predictive comparisons with external audio timing. Whether prediction improves latency while controlling false hits remains an open question.',
      ] },
    ],
    flow: ['Webcam frames', 'Fingertip or stick perception', 'Measured strike & commit', 'Local samples & visual feedback'],
    demoSummary: 'Source reviewed at revision e1964f4a. This case study describes implemented code and saved evidence; no webcam application or prediction service is embedded here.',
    stack: ['Python', 'OpenCV', 'MediaPipe', 'PyTorch', 'LightGBM', 'OpenGL', 'sounddevice', 'pytest'],
    repositoryUrl: 'https://github.com/youseffahem/air_drum_project',
    demoAvailable: false,
  },
  {
    slug: 'heartguard',
    name: 'HeartGuard AI',
    domain: 'Applied machine learning & evaluation',
    featured: true,
    summary: 'An educational comparison of classifiers and feature subsets on the UCI Heart Disease dataset, with a Streamlit interface.',
    distinction: 'PCA, recursive feature elimination and saved model results make modeling choices inspectable, including the limits of the evaluation.',
    problem: 'A classification study needs to explain which features and evaluation choices produced its results. HeartGuard compares model families and feature representations, then exposes saved outputs through an interface.',
    capabilities: [
      { label: 'Model comparison', detail: 'Logistic Regression, Decision Tree, Random Forest and SVM are compared on original and reduced feature sets.' },
      { label: 'PCA & feature selection', detail: 'Notebooks explore principal components, RFE and feature importance, including XGBoost for feature analysis.' },
      { label: 'Streamlit interface', detail: 'A form displays saved model metrics and calls a selected estimator for predictions. This is an educational interface using a public research dataset.' },
    ],
    decisions: [
      { title: 'Inspect evaluation at each stage', detail: 'The supervised notebook uses stratified 80/20 splits and five-fold stratified cross-validation. Parameter search uses cross-validated F1; saved outputs include accuracy, F1 and ROC-AUC.', tradeoff: 'Scaling, PCA and feature selection are fitted before downstream splits in the notebooks, exposing estimates to data leakage. Fold-contained preprocessing and selection are needed for a stronger evaluation.' },
      { title: 'Make saved-model selection explicit', detail: 'The Streamlit code selects the estimator with the highest saved test F1. Current metadata selects Logistic Regression with original features, rather than the Random Forest result described in the historical profile.', tradeoff: 'Using test F1 for selection biases a final assessment. The interface also lacks the matching scaling step used during training; inference consistency requires correction and validation.' },
    ],
    details: [
      { id: 'evaluation-limits', title: 'Evaluation limits & next steps', paragraphs: [
        'The notebooks and saved artifacts support a study of model comparison, not a clinical performance claim. Results were not independently reproduced, and no headline accuracy figure is presented here.',
        'A stronger follow-up would fit preprocessing and feature selection inside training folds, reserve an untouched final test set, and export one preprocessing-plus-estimator pipeline for the interface. External-cohort evaluation remains outside the current evidence.',
      ] },
    ],
    flow: ['Public research data', 'PCA, RFE & model comparison', 'Saved evaluation artifacts', 'Streamlit interface'],
    demoSummary: 'Educational project, not a medical device. Notebook and interface limitations are stated above; no clinical validity or hosted prediction service is claimed.',
    stack: ['Python', 'scikit-learn', 'Pandas', 'NumPy', 'Streamlit', 'Matplotlib'],
    repositoryUrl: 'https://github.com/youseffahem/Hearts_Disease_Project',
    demoAvailable: false,
  },
  {
    slug: 'realestate',
    name: 'RealEstate',
    domain: 'Backend & relational data',
    featured: true,
    summary: 'A Flask and MySQL application connecting property listings, agents, inquiries, and analytics.',
    distinction: 'Data integrity lives in the schema: listings survive agent deletion, while related images and inquiries follow their property.',
    problem: 'Property information, agent assignments, and customer inquiries need to stay consistent as records change. RealEstate brings them into a shared relational model, with server-side validation and database constraints protecting the relationships.',
    role: 'Application architecture & full-stack development',
    contribution: 'The repository credits me with the application architecture, property, agent and inquiry modules, analytics, schema, tests, and front-end design system. This was collaborative work: Ahmed contributed the agent detail view with photo support and extended property and inquiry displays.',
    capabilities: [
      { label: 'Connected records', detail: 'Six InnoDB tables link properties, agents, locations, property types, images, and inquiries with explicit deletion rules.' },
      { label: 'Lead handling', detail: 'Inquiries start as New and can advance to Contacted or Closed; backward moves are rejected. Filter by property, status, and assigned agent.' },
      { label: 'Query-based analytics', detail: 'Dashboard totals, charts, and agent summaries are calculated from SQL aggregates. Property galleries support ordered images.' },
    ],
    decisions: [
      { title: 'Enforce relationships in MySQL', detail: 'Foreign keys use RESTRICT, SET NULL, and CASCADE for different relationships. Decimal prices, controlled status values, and CHECK constraints encode rules below the interface.', tradeoff: 'Schema rules protect data written through different paths, but changes to those rules must also account for existing records.' },
      { title: 'Separate validation from queries', detail: 'Flask routes delegate to paired validation and query modules. Validation receives the allowed foreign-key IDs and can be exercised without opening its own database connection.', tradeoff: 'This gives field rules a clear boundary while keeping database lookups and relational checks in the request flow.' },
    ],
    flow: ['Flask request', 'Validation modules', 'Parameterized SQL', 'Jinja2 response'],
    demoSummary: 'The repository documents a 274-test suite; that result is repository-reported and was not rerun for this portfolio. Authentication, CSRF protection, and upload hardening remain future work before public production use.',
    stack: ['Python', 'Flask', 'MySQL', 'Jinja2', 'JavaScript', 'pytest'],
    repositoryUrl: 'https://github.com/youseffahem/RealEstate',
    demoAvailable: false,
  },
  {
    slug: 'gym-app',
    name: 'Gym App',
    domain: 'Flutter & mobile interfaces',
    featured: false,
    summary: 'A Flutter interface prototype for browsing exercises and workout routines.',
    distinction: 'Simple exercise and workout models connect searchable lists to focused detail screens.',
    problem: 'Exercise information and routine contents should be easy to browse on a phone. This project explores that navigation through a small Flutter application with separate home, exercise, workout, login, and profile screens.',
    capabilities: [
      { label: 'Exercise discovery', detail: 'Search the local exercise list by name, see the muscles involved, and open a dedicated detail screen.' },
      { label: 'Routine browsing', detail: 'Browse and search predefined workouts, then inspect their descriptions and included exercises.' },
      { label: 'Screen navigation', detail: 'Flutter navigation connects the main sections, while model objects carry the selected exercise or workout into its detail view.' },
    ],
    decisions: [
      { title: 'Separate records from screens', detail: 'Exercise and Workout classes define the content passed between list and detail screens, keeping each screen focused on presentation and interaction.', tradeoff: 'The models are intentionally small; richer tracking would require additional fields and persistence behavior.' },
      { title: 'Keep the prototype state local', detail: 'The browsing screens filter local lists with setState, which makes their current interaction flow visible in a small amount of Dart code.', tradeoff: 'The current implementation does not establish cloud sync, workout history, or real authentication. The login screen is a navigation prototype.' },
    ],
    flow: ['Home navigation', 'Search local content', 'Select a record', 'Read exercise or routine'],
    demoSummary: 'This case study covers the checked-in Flutter screens and models. The public repository does not include the complete build configuration, so a runnable mobile release is not claimed.',
    stack: ['Flutter', 'Dart', 'Material widgets'],
    repositoryUrl: 'https://github.com/youseffahem/Gym-App',
    demoAvailable: false,
  },
  {
    slug: 'arduino-projects',
    name: 'Arduino Projects',
    domain: 'Embedded C/C++ & electronics',
    featured: false,
    summary: 'A collection of five Arduino experiments spanning buttons, LEDs, PWM, game logic, and soil sensing.',
    distinction: 'Small sketches make the path from physical input to an output signal explicit.',
    problem: 'Embedded programming connects code to changing electrical inputs. These exercises explore that connection through a controlled LED, strobe, light dimmer, memory game, and plant monitor, each with its own source and documentation.',
    capabilities: [
      { label: 'Digital control', detail: 'The controlled LED reads a button input and sets its output pin. The strobe varies its timing using a potentiometer.' },
      { label: 'PWM dimming', detail: 'The light dimmer scales an analog potentiometer reading into an LED brightness value for analogWrite.' },
      { label: 'Sensor feedback', detail: 'The plant monitor reads soil sensor values, logs changes to serial, and activates an LED and buzzer at a fixed threshold.' },
    ],
    decisions: [
      { title: 'Scale the input to the output range', detail: 'The dimmer divides the analog reading by four to map its 10-bit input into the 8-bit PWM range used by the LED output.', tradeoff: 'Direct scaling keeps the signal path simple; smoothing and calibration would be additional work for a noisier input.' },
      { title: 'Use small, inspectable polling loops', detail: 'The LED, strobe, and sensor sketches use the Arduino setup/loop structure with direct pin reads and writes. The strobe and monitor include blocking delays.', tradeoff: 'The sequence is easy to follow, but other inputs cannot be serviced continuously during those delays.' },
    ],
    flow: ['Button or sensor', 'Arduino loop', 'GPIO or PWM', 'LED, buzzer & serial'],
    demoSummary: 'The workflow diagram shows an input/output pattern across the collection. Hardware was not run for this portfolio. The memory-game source needs repair before build or hardware readiness can be claimed.',
    stack: ['Embedded C/C++', 'Arduino', 'GPIO', 'PWM', 'Analog sensing', 'Serial'],
    repositoryUrl: 'https://github.com/youseffahem/Arduino-Projects-Collection',
    demoAvailable: false,
  },
  {
    slug: 'gesture-volume',
    name: 'Hand Gesture Volume Control',
    domain: 'Computer vision & interaction',
    featured: false,
    summary: 'A Python experiment that maps the distance between two fingertips to Windows system volume.',
    distinction: 'Hand landmarks become a control signal, with on-screen feedback showing the resulting volume level.',
    problem: 'A camera can turn a small physical gesture into a software control. This experiment follows that path from webcam frames through hand detection to the Windows audio endpoint.',
    capabilities: [
      { label: 'Landmark tracking', detail: 'OpenCV supplies frames and MediaPipe locates the hand landmarks used by the control loop.' },
      { label: 'Distance mapping', detail: 'Thumb-tip and index-tip distance is interpolated into a bounded 0–1 volume scalar.' },
      { label: 'Visual feedback', detail: 'The frame displays the tracked points, a volume bar, a percentage, and an FPS readout.' },
    ],
    decisions: [
      { title: 'Keep tracking in a separate module', detail: 'HandTrackingModule exposes landmark positions; VolumeHandControl uses them to calculate the gesture and update the audio endpoint.', tradeoff: 'The split keeps vision code reusable while leaving device-specific audio control in the application loop.' },
      { title: 'Map a bounded pixel interval', detail: 'The application maps a fingertip distance of 50–300 pixels to the full volume range through NumPy interpolation.', tradeoff: 'The mapping is straightforward, but its sensitivity depends on hand distance from the camera because it uses image pixels.' },
    ],
    flow: ['Webcam frame', 'Hand landmarks', 'Fingertip distance', 'Windows audio level'],
    demoSummary: 'The original Python application requires a camera and Windows audio APIs. This portfolio presents the workflow as a diagram without accessing a camera or changing system volume.',
    stack: ['Python', 'OpenCV', 'MediaPipe', 'NumPy', 'PyCAW'],
    repositoryUrl: 'https://github.com/youseffahem/hand-gesture-volume-control',
    demoAvailable: false,
  },
  {
    slug: 'digits-classifier',
    name: 'Digits Classifier Comparison',
    domain: 'Machine learning evaluation',
    featured: false,
    summary: 'A comparison of Support Vector Machine and Decision Tree classifiers on scikit-learn’s digits dataset.',
    distinction: 'Both classifiers use the same train/test split, with per-class reports and confusion matrices exposing their errors.',
    problem: 'An overall score can hide which classes a model confuses. This experiment pairs accuracy with precision, recall, F1, and confusion matrices to make two classification approaches easier to compare.',
    capabilities: [
      { label: 'Shared dataset', detail: 'Both estimators train on the same partition of the 8×8 grayscale digit samples loaded with scikit-learn.' },
      { label: 'Per-class evaluation', detail: 'Classification reports record precision, recall, F1, and support for each digit.' },
      { label: 'Error visualization', detail: 'Side-by-side Seaborn heatmaps display the two confusion matrices, and a text file stores the model reports.' },
    ],
    decisions: [
      { title: 'Compare on a shared split', detail: 'The code creates one 70/30 split with random_state=42 and supplies it to both estimators.', tradeoff: 'A shared split supports a direct comparison, but one split alone cannot establish stability across different samples.' },
      { title: 'Pair scores with error structure', detail: 'Accuracy and classification reports are recorded alongside separate confusion matrices for SVC and Decision Tree.', tradeoff: 'The additional views help locate errors; they remain evidence about this dataset and run, rather than performance guarantees.' },
    ],
    flow: ['8×8 digit samples', 'Shared train/test split', 'SVC & Decision Tree', 'Reports & matrices'],
    demoSummary: 'The repository contains the comparison script and a saved result report. The diagram summarizes that experiment; model training and evaluation were not rerun for this portfolio.',
    stack: ['Python', 'scikit-learn', 'Matplotlib', 'Seaborn'],
    repositoryUrl: 'https://github.com/youseffahem/Digits-Classifier-Comparison',
    demoAvailable: false,
  },
  {
    slug: 'hospital-management',
    name: 'Hospital Management System',
    domain: 'C++ & data structures',
    featured: false,
    summary: 'A console data-structures exercise modeling branches, doctors, and patients with singly linked lists.',
    distinction: 'Insertion, traversal, lookup, and deletion are implemented through explicit nodes and pointer updates.',
    problem: 'Linked lists are easier to understand when their operations serve a concrete model. This exercise organizes three types of records and exposes their operations through a small console menu.',
    capabilities: [
      { label: 'Separate entity lists', detail: 'Branch, Doctor, and Patients records each have their own node structure and list class.' },
      { label: 'Record operations', detail: 'The menu adds and lists all three entities, searches branches by ID, removes doctors by ID, and removes patients by name.' },
      { label: 'Pointer handling', detail: 'Head insertion and deletion handle list links directly, making the underlying data structure visible.' },
    ],
    decisions: [
      { title: 'Represent each entity with its own list', detail: 'Separate classes group the branch, doctor, and patient operations around their respective head pointers.', tradeoff: 'The separation is explicit for a learning exercise, but the repeated list mechanics could be generalized in a larger implementation.' },
      { title: 'Keep storage in memory', detail: 'The console application allocates records while running and does not write them to a file or database.', tradeoff: 'This keeps the focus on list operations; records disappear on exit and the program is not a production hospital system.' },
    ],
    flow: ['Console menu', 'Entity list', 'Traverse or update links', 'Display result'],
    demoSummary: 'Appointments are stored as counts, with no scheduling logic. Duplicate IDs and whitespace in input are known limitations of this console exercise.',
    stack: ['C++', 'Singly linked lists', 'Console I/O'],
    repositoryUrl: 'https://github.com/youseffahem/Hospital-Management-System',
    demoAvailable: false,
  },
] as const satisfies readonly ProjectContent[];

export const projectBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
) as { readonly [Slug in ProjectSlug]: Extract<(typeof projects)[number], { slug: Slug }> };
