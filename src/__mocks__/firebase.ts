export const isFirebaseConfigured = true;
export const app = {
  name: '[DEFAULT]',
  options: {},
  automaticDataCollectionEnabled: false,
};
export const db = {
  type: 'firestore',
  _databaseId: { projectId: 'test-project', database: '(default)' },
};
export const auth = {
  currentUser: null,
};
export const analytics = {
  app,
  logEvent: jest.fn(),
};
