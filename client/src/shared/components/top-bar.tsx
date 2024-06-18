import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, Layout, Space, Switch, theme } from 'antd';

import useApp from '@/hooks/use-app';
import { useAppStore } from '@/modules/app/app.zustand';

type TMainTopBarProps = {
  collapsed: boolean;
  setCollapse: React.Dispatch<React.SetStateAction<boolean>>;
};

const TopBar = ({ collapsed, setCollapse }: TMainTopBarProps) => {
  const { token } = useApp();

  const gTheme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  return (
    <Layout.Header
      css={css`
        background: ${token.colorBgContainer};
        display: flex;
        padding: 0;
        top: 0;
        z-index: 1;
        position: sticky;
        width: 100%;
        align-items: center;
      `}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapse(!collapsed)}
        css={css`
          font-size: 16px !important;
          width: 64px !important;
          height: 64px !important;
        `}
      />

      <div
        css={css`
          flex: 1;
        `}
      />

      <div
        css={css`
          flex: 1;
        `}
      />

      <Space
        css={css`
          margin-right: ${token.margin}px;
        `}
      >
        <Switch
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          checked={gTheme.algorithm.includes(theme.darkAlgorithm)}
          onChange={() => toggleTheme()}
        />
      </Space>
    </Layout.Header>
  );
};

export default TopBar;
