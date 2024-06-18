import { ArrowLeftOutlined, ExportOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Divider, Flex, Space, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { EChartsOption } from 'echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import * as R from 'ramda';
import { useMemo } from 'react';
import * as xlsx from 'xlsx';

import useApp from '@/hooks/use-app';
import RequestMethodTag from '@/modules/projects/components/request-method-tag';
import useGetProject from '@/modules/projects/hooks/use-get-project';
import useGetResult from '@/modules/projects/hooks/use-get-result';

export const Route = createFileRoute(
  '/app/projects/$projectId/results/$resultId',
)({
  component: ProjectResultDetail,
});

const NUM_POINTS = 30;

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  CanvasRenderer,
  TitleComponent,
]);

function ProjectResultDetail() {
  const { projectId, resultId } = Route.useParams();

  const navigate = Route.useNavigate();

  const { token } = useApp();

  const projectQuery = useGetProject(projectId);
  const resultQuery = useGetResult(projectId, resultId, true);
  const { data: project } = projectQuery;
  const { data: result } = resultQuery;

  const totalDuration = useMemo(
    () => (result?.finishTimestamp || 0) - (result?.startTimestamp || 0),
    [result],
  );

  const chartData = useMemo(
    () =>
      result
        ? Array.from({ length: NUM_POINTS }).map((_, index) => {
            const gapTime = totalDuration / NUM_POINTS;
            const curTime = result?.startTimestamp + gapTime * index;

            const accData = R.filter(
              (x) => x.metric.finishTimestamp <= curTime + gapTime,
              result.data,
            );
            const inRangeData = R.filter(
              (x) =>
                x.metric.startTimestamp >= curTime &&
                x.metric.finishTimestamp <= curTime + gapTime,
              result.data,
            );

            const avgResponseTime =
              R.reduce(
                (acc, x) =>
                  acc + (x.metric.finishTimestamp - x.metric.startTimestamp),
                0,
                inRangeData,
              ) / inRangeData.length;

            const errorPercent =
              R.filter((x) => !x.metric.isSuccess, accData).length /
              accData.length;

            let passedDuration = 0;
            for (const stage of result.stages) {
              if (
                result.startTimestamp + passedDuration * 1000 <= curTime &&
                curTime <
                  result.startTimestamp +
                    (stage.duration + passedDuration) * 1000
              ) {
                return {
                  timestamp: curTime,
                  avgResponseTime,
                  vus: stage.vus,
                  errorPercent,
                };
              }
              passedDuration += stage.duration;
            }

            return {
              timestamp: curTime,
              avgResponseTime,
              vus: 0,
              errorPercent,
            };
          })
        : [],
    [result, totalDuration],
  );

  const tableData = useMemo(() => {
    return Array.from(new Set(result?.data.map((x) => x.requestId)))
      .map((x) => {
        return {
          requestId: x,
          data: result?.data.filter((y) => y.requestId === x) || [],
        };
      })
      .map((x) => {
        const request = project?.requests.find((y) => y.id === x.requestId);

        return {
          requestId: x.requestId,
          requestName: request?.name || 'Unknown',
          totalRequest: x.data.length,
          requestMethod: request?.method || 'GET',
          avgResponseTime:
            R.reduce(
              (acc, y) =>
                acc + y.metric.finishTimestamp - y.metric.startTimestamp,
              0,
              x.data,
            ) / x.data.length,
          minResponseTime: R.reduce(
            (acc, y) =>
              Math.min(acc, y.metric.finishTimestamp - y.metric.startTimestamp),
            Infinity,
            x.data,
          ),
          maxResponseTime: R.reduce(
            (acc, y) =>
              Math.max(acc, y.metric.finishTimestamp - y.metric.startTimestamp),
            0,
            x.data,
          ),
          errorPercent: (
            (R.filter((y) => !y.metric.isSuccess, x.data).length /
              x.data.length) *
            100
          ).toFixed(),
        };
      });
  }, [project?.requests, result?.data]);

  const avgResponseColor = token.colorInfo;
  const vusColor = '#bfbfbf';
  const errorColor = token['red-3'];

  return (
    <>
      <Flex vertical>
        <Flex align="baseline" justify="space-between">
          <Space align="baseline" size="large">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() =>
                navigate({
                  to: `/app/projects/$projectId`,
                  params: { projectId },
                })
              }
            />

            <Typography.Title level={4}>{result?.id}</Typography.Title>
          </Space>

          <Button
            css={css`
              justify-self: end;
            `}
            icon={<ExportOutlined />}
            type="primary"
            onClick={() => {
              const wb = xlsx.utils.book_new();
              const tableSheet = xlsx.utils.json_to_sheet(tableData);
              const chartSheet = xlsx.utils.json_to_sheet(
                resultQuery.data?.data.map((x) => ({
                  ...x,
                  success: x.metric.isSuccess ? '1' : '0',
                  duration: x.metric.finishTimestamp - x.metric.startTimestamp,
                })) || [],
              );
              xlsx.utils.book_append_sheet(wb, tableSheet, 'table');
              xlsx.utils.book_append_sheet(wb, chartSheet, 'chart');
              xlsx.writeFile(wb, `${Date.now()}-export.xlsx`);
            }}
          >
            Xuất Excel
          </Button>
        </Flex>

        <Divider />

        <div
          css={css`
            width: 100%;
            height: 400px;
          `}
        >
          <ReactEChartsCore
            echarts={echarts}
            style={{ height: '100%', width: '100%' }}
            option={
              {
                toolbox: {
                  feature: {
                    dataView: { show: true, readOnly: false },
                    saveAsImage: { show: true },
                  },
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross',
                  },
                },
                legend: {
                  data: ['Thời gian TB', 'Tỉ lệ lỗi', 'VUs'],
                },
                color: [avgResponseColor, errorColor, vusColor],
                title: {
                  text: 'Biểu đồ kết quả',
                },
                xAxis: {
                  type: 'time',
                  axisLabel: {
                    formatter: (value: number) =>
                      dayjs(value).format('HH:mm:ss'),
                  },
                },
                yAxis: [
                  {
                    type: 'value',
                    name: 'Thời gian TB',
                    position: 'left',
                    offset: 20,
                    axisLabel: {
                      formatter: '{value} ms',
                    },
                    axisLine: {
                      show: true,
                      lineStyle: {
                        color: avgResponseColor,
                      },
                    },
                  },
                  {
                    type: 'value',
                    name: 'Tỉ lệ lỗi',
                    axisLine: {
                      show: true,
                      lineStyle: {
                        color: errorColor,
                      },
                    },
                    minInterval: 1,
                    offset: 20,
                    position: 'right',
                    axisLabel: {
                      formatter: (value) => `${value}%`,
                    },
                    min: 0,
                    max: 100,
                  },
                  {
                    type: 'value',
                    name: 'VUs',
                    axisLine: {
                      show: true,
                      lineStyle: {
                        color: vusColor,
                      },
                    },
                    minInterval: 1,
                    offset: 80,
                    position: 'right',
                    axisLabel: {
                      formatter: '{value} VU',
                    },
                  },
                ],
                series: [
                  {
                    name: 'Thời gian TB',
                    type: 'line',
                    data: chartData.map((x) => [
                      x.timestamp,
                      x.avgResponseTime.toFixed(),
                    ]),
                    yAxisIndex: 0,
                  },
                  {
                    name: 'Tỉ lệ lỗi',
                    type: 'line',
                    data: chartData.map((x) => [
                      x.timestamp,
                      (x.errorPercent * 100).toFixed(2),
                    ]),
                    yAxisIndex: 1,
                  },
                  {
                    name: 'VUs',
                    type: 'line',
                    data: chartData.map((x) => [x.timestamp, x.vus]),
                    yAxisIndex: 2,
                  },
                ],
              } as EChartsOption
            }
          />
        </div>

        <Table
          dataSource={tableData}
          rowKey={(record) => record.requestId}
          columns={[
            {
              title: 'Request',
              dataIndex: 'requestName',
              key: 'requestName',
              render: (_, record) => (
                <Space>
                  <RequestMethodTag method={record.requestMethod} />
                  <Typography.Text>{record.requestName}</Typography.Text>
                </Space>
              ),
            },
            {
              title: 'Tổng số request',
              dataIndex: 'totalRequest',
              key: 'totalRequest',
            },
            {
              title: 'Thời gian trung bình (ms)',
              dataIndex: 'avgResponseTime',
              key: 'avgResponseTime',
              render: (avgResponseTime: number) => (
                <Typography.Text
                  css={css`
                    color: ${token.blue};
                  `}
                >
                  {avgResponseTime.toFixed()}
                </Typography.Text>
              ),
            },
            {
              title: 'Thời gian nhỏ nhất (ms)',
              dataIndex: 'minResponseTime',
              key: 'minResponseTime',
              render: (minResponseTime: number) => (
                <Typography.Text
                  css={css`
                    color: ${token.green};
                  `}
                >
                  {minResponseTime.toFixed()}
                </Typography.Text>
              ),
            },
            {
              title: 'Thời gian lớn nhất (ms)',
              dataIndex: 'maxResponseTime',
              key: 'maxResponseTime',
              render: (maxResponseTime: number) => (
                <Typography.Text
                  css={css`
                    color: ${token.orange};
                  `}
                >
                  {maxResponseTime.toFixed()}
                </Typography.Text>
              ),
            },
            {
              title: 'Tỉ lệ lỗi (%)',
              dataIndex: 'errorPercent',
              key: 'errorPercent',
              render: (errorPercent: number) => (
                <Typography.Text type="danger">{errorPercent}</Typography.Text>
              ),
            },
          ]}
        />
      </Flex>
    </>
  );
}

export default ProjectResultDetail;
