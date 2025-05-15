export const statusMap = [
  {
    label: '正常',
    value: 0,
    color: 'success',
  },
  {
    label: '异常',
    value: 1,
    color: 'warning',
  }
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

export const k8sClusterTypeMap = [
  {
    label: '自建 Kubernetes',
    value: 'self-built'
  },
  {
    label: '容器服务 Kubernetes',
    value: 'container-service'
  },
]