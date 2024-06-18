/* eslint-disable react-hooks/rules-of-hooks */
import { css } from '@emotion/react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Layout } from 'antd';
import { useState } from 'react';

import useApp from '@/hooks/use-app';
import SideNav from '@/shared/components/side-nav';
import TopBar from '@/shared/components/top-bar';

export const Route = createRootRoute({
  component: () => {
    const { token } = useApp();

    const [collapsed, setCollapsed] = useState(false);

    return (
      <>
        <Layout
          hasSider
          css={css`
            min-height: 100dvh;
          `}
        >
          <SideNav collapsed={collapsed} setCollapsed={setCollapsed} />

          <Layout>
            <TopBar collapsed={collapsed} setCollapse={setCollapsed} />

            <Layout.Content
              className="main-content"
              css={css`
                margin: ${token.margin}px;
                padding: ${token.padding}px;
                padding-top: 0;
                background-color: ${token.colorBgContainer};
                border-radius: ${token.borderRadius}px;
                height: calc(100dvh - 64px - 2 * ${token.margin}px);
                overflow-y: auto;
                overflow: -moz-scrollbars-none;
                -ms-overflow-style: none;
              `}
            >
              <Outlet />
            </Layout.Content>
          </Layout>
        </Layout>

        {/* <TanStackRouterDevtools position="bottom-right" /> */}
      </>
    );
  },
});
