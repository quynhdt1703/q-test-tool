import { App, theme } from 'antd';

function useApp() {
  const { token } = theme.useToken();
  const antdApp = App.useApp();

  return {
    token,
    antdApp,
  };
}

export default useApp;
