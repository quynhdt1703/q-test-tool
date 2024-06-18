import { AppstoreOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useNavigate, useParams } from '@tanstack/react-router';
import type { MenuProps } from 'antd';
import { Layout, Menu, Typography, theme } from 'antd';
import { useMemo } from 'react';
import { useLocation } from 'react-use';

import { APP_NAME, SIDE_NAV_WIDTH } from '@/configs/constants';
import { useAppStore } from '@/modules/app/app.zustand';
import useGetListProject from '@/modules/projects/hooks/use-get-list-project';
import { TAntdToken } from '@/shared/types/antd-token.type';

type TSideNavProps = {
  collapsed: boolean;
  setCollapsed: (_collapsed: boolean) => void;
};

const SideNav = ({ collapsed, setCollapsed }: TSideNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { projectId } = useParams<any>({ strict: false });

  const gTheme = useAppStore((state) => state.theme);
  const isDark = gTheme.algorithm.includes(theme.darkAlgorithm);

  const { token } = theme.useToken();

  const projectsQuery = useGetListProject();

  const items = useMemo<MenuProps['items']>(
    () => [
      {
        key: '/app/projects',
        icon: <AppstoreOutlined />,
        label: 'Dự án',
        children: projectsQuery.data?.map((project) => ({
          key: `/app/projects/${project.id}`,
          label: project.name,
          onClick: () =>
            navigate({
              to: '/app/projects/$projectId',
              params: { projectId: project.id },
            }),
        })),
      },
    ],
    [projectsQuery.data, navigate],
  );

  const onClick: MenuProps['onClick'] = (e) => {
    navigate({ to: e.key } as any);
  };

  return (
    <Layout.Sider
      width={SIDE_NAV_WIDTH}
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme={isDark ? 'light' : 'dark'}
    >
      <LogoWrapper
        $token={token}
        onClick={() => navigate({ to: '/app/projects' })}
      >
        <img
          src="/logo.jpeg"
          alt="logo"
          width={80 - token.padding}
          css={css`
            background: linear-gradient(
              45deg,
              ${token.colorPrimary},
              ${token.colorWhite}
            );
            border-radius: ${token.borderRadius}px;
            transition: ease-in-out 1s;
            margin-right: ${collapsed ? 0 : token.margin / 2}px;
          `}
        />

        {!collapsed && (
          <Typography.Text
            css={css`
              color: ${token.colorWhite};
              font-size: ${token.fontSizeHeading5}px;
              font-weight: ${token.fontWeightStrong};
            `}
          >
            {APP_NAME}
          </Typography.Text>
        )}
      </LogoWrapper>

      <Menu
        onClick={onClick}
        theme={isDark ? 'light' : 'dark'}
        mode="inline"
        items={items}
        selectedKeys={[location.pathname || '', `/app/projects/${projectId}`]}
        css={css`
          border-inline-end: none;
        `}
      />
    </Layout.Sider>
  );
};

export default SideNav;

const LogoWrapper = styled.div<TAntdToken>`
  cursor: pointer;
  width: 100%;
  padding: ${(props) => props.$token.padding / 2}px;
  display: flex;
  align-items: center;
`;
