export const statusMap = [
  {
    label: '运行中',
    value: 2,
    color: 'success',
  },
  {
    label: '异常',
    value: 1,
    color: 'warning',
  },
  {
    label: '停机',
    value: 4,
    color: 'fail',
  },
  {
    label: '待部署',
    value: 5,
    color: 'info',
  },
  {
    label: '启动中',
    value: 0,
    color: 'loading',
  },
];

export const deployModeMap = [
  {
    label: 'EDAS K8s',
    value: 'edas',
  },
  {
    label: '天宫 2.0',
    value: 'tiangong',
  },
  {
    label: '自定义部署',
    value: 'custom',
  },
  {
    label: '独立输出',
    value: 'adp',
  },
  {
    label: 'K8s部署',
    value: 'k8s',
  },
];
