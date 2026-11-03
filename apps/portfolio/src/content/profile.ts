/** Self-reported background from the CV supplied on 3 November 2026; project skills from inspected source. */
export const profile = {
  name: 'Yousef Fahim Amin',
  fullName: 'Yousef Fahim Amin Hassoun',
  firstName: 'Yousef',
  initials: 'yf',
  title: 'Applied ML & computer vision',
  location: 'Cairo, Egypt',
  email: 'yousef.fahem11@gmail.com',
  github: 'https://github.com/youseffahem',
  linkedin: 'https://www.linkedin.com/in/yousef-fahem/',
  social: 'https://x.com/YousefFahem0',
  description: 'Yousef Fahim Amin — final-year Computer Science undergraduate focused on applied machine learning, model evaluation, and interactive computer vision.',
  cvUrl: '/Yousef_Fahim_Amin_CV.pdf' as string | null,
};

export const skillGroups = [
  { name: 'Motion-prediction experiments', tools: 'Python · PyTorch · LightGBM · NumPy', detail: 'Space Drums: offline GBDT, GRU and TCN training and evaluation code.', evidence: 'Project-supported' },
  { name: 'Model comparison & evaluation', tools: 'scikit-learn · XGBoost · Pandas · Streamlit', detail: 'HeartGuard AI: classifier comparison, PCA, RFE and feature importance; XGBoost is used for feature analysis.', evidence: 'Project-supported' },
  { name: 'Interactive computer vision', tools: 'OpenCV · MediaPipe · OpenGL · sounddevice', detail: 'Space Drums: webcam perception, strike geometry, rendered feedback and local audio.', evidence: 'Project-supported' },
  { name: 'Web applications & data', tools: 'Flask · MySQL · SQL · Jinja2 · JavaScript · pytest', detail: 'RealEstate: relational constraints, parameterized queries, validation and server-rendered interfaces.', evidence: 'Project-supported' },
  { name: 'Further programming practice', tools: 'C++ · Embedded C/C++ · Arduino · Flutter · Dart', detail: 'Further projects explore linked lists, sensor input, GPIO/PWM and mobile browsing screens.', evidence: 'Project-supported' },
  { name: 'Additional familiarity', tools: 'TensorFlow · C · Java', detail: 'Listed in my current CV; not demonstrated by the featured projects presented here.', evidence: 'CV-listed' },
] as const;

export const training = [
  { organization: 'Ray Group', program: 'Full Stack with Python', period: '45 days', certificate: null },
  { organization: 'Sprints × Microsoft Summer Camp', program: 'AI & Machine Learning', period: null, certificate: 'https://sprints.ai/en-eg/journeys/learning/ID%20-%20SPR%20-%20I92F5Y/view-certificate-serial' },
  { organization: 'IT Gate Academy, Nasr City', program: 'AI & Machine Learning', period: '40 hours', certificate: null },
  { organization: 'Ex-Fresher', program: 'Python Programming', period: null, certificate: 'https://drive.google.com/file/d/1iwOjD47GwBEmMF3y_Fk5r1kqdF14VJzQ/view' },
] as const;
