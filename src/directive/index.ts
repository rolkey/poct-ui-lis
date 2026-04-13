import hasPermi from './auth/hasPermi';

export default {
  install(app: any) {
    app.directive('hasPermi', hasPermi);
  }
};
