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
  'spacedrums',
  'heartguard',
  'realestate',
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
  sha256: '6ee685289ba4a19049e7313611b449d0f41486708c75179dbca7f777c0469d15',
  // The site links only to the owner's public Drive copy (verified identical bytes).
  viewUrl: 'https://drive.google.com/file/d/1HyJ6ZVG2oKNNknmskzUYkgvbSr7VIrm8/view?usp=drive_link',
});
export const publishedAssets = Object.freeze(['favicon.svg', portfolioCv.path]);
