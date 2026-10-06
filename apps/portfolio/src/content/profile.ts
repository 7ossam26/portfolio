/** Identity spelling confirmed by the owner; background from his README and CV. */
export const profile = {
  name: 'Yousef Fahim Amin',
  firstName: 'Yousef',
  initials: 'yf',
  title: 'Software engineer',
  location: 'Egypt',
  email: 'yousef.fahem11@gmail.com',
  github: 'https://github.com/youseffahem',
  linkedin: 'https://www.linkedin.com/in/yousef-fahem/',
  social: 'https://x.com/YousefFahem0',
  description: 'Yousef Fahim Amin — software engineering across Python backend development, applied machine learning, computer vision, and embedded systems.',
  cvUrl: '/Yousef_Fahim_Amin_CV.pdf' as string | null,
};

export const skillGroups = [
  { name: 'Backend & data', tools: 'Python · Flask · MySQL · Jinja2', detail: 'Relational schemas, validation, JSON APIs, and server-rendered applications.' },
  { name: 'Applied machine learning', tools: 'scikit-learn · XGBoost · TensorFlow/Keras · Pandas · NumPy · Streamlit', detail: 'Preprocessing, feature selection, model comparison, and evaluation.' },
  { name: 'Computer vision', tools: 'OpenCV · MediaPipe · PyCAW', detail: 'Live landmark tracking and gesture-driven interaction.' },
  { name: 'Web & mobile', tools: 'HTML · CSS · JavaScript · Flutter · Dart', detail: 'Responsive web interfaces and screen-based mobile applications.' },
  { name: 'Embedded systems', tools: 'C/C++ · Arduino · GPIO · PWM · UART', detail: 'Sensor input, GPIO/PWM control, serial communication, and interactive game logic.' },
  { name: 'Foundations & tools', tools: 'Java · C++ · pytest · Git · Docker · GitHub Actions', detail: 'Data structures, validation and schema tests, source control, and development tooling.' },
] as const;

export const training = [
  { organization: 'Ray Group', program: 'Full-Stack Development with Python', period: '2026', certificate: null },
  { organization: 'IT Gate Academy', program: 'AI and Machine Learning', period: '2025 · 1 month', certificate: null },
  { organization: 'Microsoft and Sprints', program: 'AI and Machine Learning Summer Camp', period: '2024 · 3 months', certificate: 'https://sprints.ai/en-eg/journeys/learning/ID%20-%20SPR%20-%20I92F5Y/view-certificate-serial' },
  { organization: 'Ex-Fresher', program: 'Python Programming', period: '6-month program', certificate: 'https://drive.google.com/file/d/1iwOjD47GwBEmMF3y_Fk5r1kqdF14VJzQ/view' },
] as const;
