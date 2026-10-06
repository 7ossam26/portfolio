// Active publication scope for the tantawy branch. Historical demo workspaces
// and their provenance remain in the repository but are not publication inputs.
export const portfolioOwner = Object.freeze({
  name: 'Yousef Fahim Amin',
  email: 'yousef.fahem11@gmail.com',
  github: 'https://github.com/youseffahem',
  linkedin: 'https://www.linkedin.com/in/yousef-fahem/',
  x: 'https://x.com/YousefFahem0',
});

export const projectSlugs = Object.freeze([
  'realestate',
  'spacedrums',
  'heartguard',
  'gym-app',
  'arduino-projects',
  'gesture-volume',
  'digits-classifier',
  'hospital-management',
]);

// A README or repository link is not a verified runnable portfolio demo.
export const activeDemoSlugs = Object.freeze([]);
export const portfolioCv = Object.freeze({
  path: 'Yousef_Fahim_Amin_CV.pdf',
  sha256: '474d6fdbd294d6de8a4aa8b7ab5324e4d08386d18446e47200c79131917f2650',
});
export const publishedAssets = Object.freeze(['favicon.svg', portfolioCv.path]);
