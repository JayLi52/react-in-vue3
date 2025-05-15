import React, { useEffect, useRef, useState } from 'react';
import { UniTable } from '@alife/teamix-uni-table';
import { Button, Message } from '@ali/teamix-ui';
import {
  createAction,
  getCookie,
  ProActionConfig,
  ProTableActionType,
  ProTableColumnProps,
} from '@ali/teamix-pro';

import {
  getListUnauthorizedOrganizationsForRamServiceRole,
  listInstances,
  logoutInstanceParams,
  restartInstanceParams,
  stopInstanceParams,
} from '../../service/instance';
import { deployModeMap, statusMap } from './constant';
import { getEDASJumpRole } from './utils';
import './index.scss';

export default (props: any) => {
  const { ifEnterprise, jumpToEdas, openCustomConfigDrawer, jumpToK8sCluster } = props;
  // console.log('getInstanceList', getInstanceList);

  const [createDisabled, setCreateDisabled] = useState(true);
  const [edasRole, setEdasRole] = useState('');
  // const [isShowHigressCols, setHigressCol] = useState(false);

  const tableRef = useRef<ProTableActionType>(null);
  const columns: ProTableColumnProps[] = [
    {
      title: '实例ID/名称',
      dataIndex: 'gwInstanceId',
      tooltip: '网关实例ID/名称',
      width: 240,
      lock: 'left',
      render: {
        copy: true,
        descriptionCopy: true,
        description: '{{ record.name }}',
        icon: 'task-fill',
        iconColor: 'B20',
        link: true,
        linkOnClick: (gwInstanceId: any, _index: number, record: any) => {
          const path = 'dashboard';
          location.href = `#/${path}?gwInstanceId=${gwInstanceId}&engineType=${record.brokerEngineType?.toLowerCase()}`;
        },
      },
    },
    {
      title: '实例状态',
      dataIndex: 'status',
      dataSource: statusMap,
      filters: statusMap,
      width: 120,
      render: {
        type: 'statusIconTag',
        overlay: (value) => {
          return value === 1 ? <>请查看集群中该实例是否正常运行</> : false;
        },
      },
    },
    {
      title: '组织',
      width: 80,
      dataIndex: 'DepartmentName',
      hidden: !ifEnterprise,
    },
    {
      title: '资源集',
      width: 120,
      dataIndex: 'ResourceGroupName',
      hidden: !ifEnterprise,
    },
    {
      title: '集群',
      dataIndex: 'deployClusterName',
      hidden: ifEnterprise,
    },
    {
      title: '命名空间',
      dataIndex: 'deployClusterNamespace',
      hidden: ifEnterprise,
    },
    {
      title: '引擎类型',
      dataIndex: 'brokerEngineType',
      width: 120,
    },
    {
      title: '对外访问',
      dataIndex: 'deployMode',
      width: 120,
      render: {
        value: (value: any, _i: number, record: any) => {
          if (value === 'edas') {
            return (
              <Button
                text
                type="primary"
                onClick={() => {
                  handleOpenEdas(record);
                }}
              >
                EDAS配置
              </Button>
            );
          } else {
            return (
              <>
                <Button
                  text
                  type="primary"
                  onClick={() => {
                    handleOpenHigress(record);
                  }}
                  className="detail-config-btn"
                >
                  查看
                </Button>
              </>
            );
          }
        },
      },
    },
    {
      title: '部署架构',
      dataIndex: 'deployMode',
      dataSource: deployModeMap,
      filters: deployModeMap,
      width: 120,
      render: {
        // value: (value: any) => {
        //   switch (value) {
        //     case 'edas':
        //       return 'EDAS';
        //     case 'custom':
        //       return '自定义';
        //     default:
        //       return '天宫2.0';
        //   }
        // },
      },
      hidden: !ifEnterprise,
    },
    {
      title: '创建时间',
      width: 180,
      dataIndex: 'createTime',
      render: {
        value: (value: string) =>
          (value
            ? new Date(value)
              .toLocaleString('zh-CN', { hour12: false })
              .replace(/\//g, '-')
              .replace(/年|月/g, '-')
              .replace('日', '')
            : '-'),
      },
    },
    {
      title: '更新时间',
      width: 180,
      dataIndex: 'modifyTime',
      render: {
        value: (value: string) =>
          (value
            ? new Date(value)
              .toLocaleString('zh-CN', { hour12: false })
              .replace(/\//g, '-')
              .replace(/年|月/g, '-')
              .replace('日', '')
            : '-'),
      },
    },
    {
      title: '操作',
      lock: 'right',
      width: 240,
      dataIndex: '_action',
      actionSchema: {
        actions: [
          {
            children: 'EDAS应用管理',
            onClick: (_e, { record }: any) => {
              handleOpenEdas(record);
            },
            disabled: '{{ record.status === 0 }}',
            visible: '{{ record.deployMode === "edas" }}',
          },
          {
            children: '重启',
            config: {
              type: 'confirm',
              title: '提示',
              content: '此操作将重启选中实例, 是否继续?',
              ...restartInstanceParams({
                $content: {
                  gwInstanceId: '{{ record.gwInstanceId }}',
                  Department: '{{ record.Department }}',
                },
              }),
              successMsg: '重启成功',
              onSuccess: () => {
                tableRef.current?.refresh();
              },
            },
            disabled: '{{ record.status === 0 }}',
            visible: '{{ record.deployMode !== "edas" && record.deployMode !== "custom" }}',
          },
          {
            children: '详情',
            onClick: (event: any, { record }: any) => {
              const path =
                record.brokerEngineType?.toLowerCase() === 'higress' ? 'router' : 'dashboard';
              location.href = `#/${path}?gwInstanceId=${
                record.gwInstanceId
              }&engineType=${record.brokerEngineType?.toLowerCase()}`;
            },
            config: {
              type: 'link',
              // to: '#/dashboard?gwInstanceId={{ record.gwInstanceId }}',
            },
            disabled: '{{ record.status === 0 }}',
          },
          {
            children: '变配',
            config: {
              type: 'link',
              to: '/ascm/buy?product=cop-spec&gwInstanceId={{ record.gwInstanceId }}&RegionId={{ record.RegionId }}',
            },
            disabled: '{{ record.status !== 4 && record.status !== 2 }}',
            visible: '{{ record.deployMode !== "edas" && record.deployMode !== "custom" }}',
          },
          {
            children: '停机',
            config: {
              type: 'confirm',
              title: '提示',
              content: '此操作将使选中实例停止运行, 是否继续?',
              ...stopInstanceParams({
                $content: {
                  gwInstanceId: '{{ record.gwInstanceId }}',
                  Department: '{{ record.Department }}',
                },
              }),
              successMsg: '停机成功',
              onSuccess: () => {
                tableRef.current?.refresh();
              },
            },
            disabled: '{{ record.status !== 2 }}',
            visible: '{{ record.deployMode !== "edas" && record.deployMode !== "custom" }}',
          },
          {
            children: '注销',
            config: {
              type: 'confirm',
              title: '提示',
              content: '此操作将注销选中实例, 是否继续?',
              ...logoutInstanceParams({
                $content: {
                  gwInstanceId: '{{ record.gwInstanceId }}',
                  Department: '{{ record.Department }}',
                },
              }),
              successMsg: '注销成功',
              onSuccess: () => {
                tableRef.current?.refresh();
              },
            },
          },
          {
            children: '编辑',
            config: {
              type: 'link',
              to: '#/instance/edit?id={{ record.gwInstanceId }}',
            },
          },
          {
            children: '查看',
            onClick: (_e, { record }: any) => {
              openCustomConfigDrawer(record);
            },
            visible: '{{ record.deployMode === "custom" }}',
          },
        ],
      },
    },
  ];

  const customRequest = async (params: any) => {
    const extraPamams: any = {};
    if (params.name && params.name.length > 0) {
      // return customRequest(params);
      extraPamams.activeSearchName = 'name';
    }
    if (params.gwInstanceId && params.gwInstanceId.length > 0) {
      // return customRequest(params);
      extraPamams.activeSearchName = 'gwInstanceId';
    }
    try {
      const result = await listInstances({ ...params, ...extraPamams });
      return {
        data: result?.data?.records,
        total: result?.data?.total,
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  };
  const handleRefresh = () => {
    tableRef.current?.refresh();
  };

  const handleOpenEdas = (record: any) => {
    const config: ProActionConfig = {
      type: 'dialog-table',
      title: 'EDAS应用管理',
      schema: {
        toolBar: false,
        showPagination: false,
        columns: [
          {
            title: '应用ID',
            dataIndex: 'appId',
            render: {
              link: true,
              linkOnClick: (value: any) => {
                jumpToEdas({ value }, edasRole);
              },
            },
          },
        ],
        dataSource: record.edasAppInfos,
      },
    };
    createAction({
      config,
    });
  };

  const handleOpenHigress = (record: any) => {
    const AccessType = {
      NORMAL: 1,
      NO_IP: 2,
    };
    let showData: any = {
      label: '-',
    };
    const { accessMode } = record;
    if (accessMode && accessMode.length > 0) {
      const { accessModeType, ips, ports } = accessMode[0];
      const ip = ips ? ips[0] : [];
      const port = ports ? ports[0] : [];
      if (accessModeType === 'LoadBalancer' && ips) {
        showData = {
          label: `${ip}:${port}`,
          type: AccessType.NORMAL,
        };
      } else if (accessModeType === 'NodePort' && ports) {
        showData = {
          label: `{IP}:${port}`,
          type: AccessType.NO_IP,
          tip: 'ip 为 node 节点 ip',
        };
      } else {
        showData = {
          label: '-',
        };
      }
    }
    const colWidth = 120;
    const config: ProActionConfig = {
      type: 'dialog-table',
      title: 'Higress配置',
      schema: {
        toolBar: false,
        showPagination: false,
        columns: [
          {
            title: '部署集群',
            width: colWidth,
            dataIndex: 'deployClusterName',
            render: {
              copy: true,
              // link: true,
              // linkOnClick: () => {
              //   console.log('record===', record)
              //   jumpToK8sCluster(record)
              // }
            },
          },
          {
            title: '类型',
            width: colWidth,
            dataIndex: 'accessModeType',
          },
          {
            title: '集群 IP',
            width: 150,
            dataIndex: 'clusterIp',
            render: {
              copy: true,
              type: 'ip',
              ipType: ['private'],
            },
          },
          {
            title: '端口映射',
            width: 2 * colWidth,
            dataIndex: 'ports',
          },
          {
            title: '外部 IP 地址（External IP）',
            width: 150,
            dataIndex: 'externalIps',
            render: {
              copy: true,
              type: 'ip',
              ipType: ['public'],
            },
          },
          {
            title: '引擎类型',
            width: colWidth,
            dataIndex: 'brokerEngineType',
          },
          {
            title: '引擎版本',
            width: colWidth,
            dataIndex: 'brokerEngineVersion',
          },
        ],
        dataSource:
          record.accessMode?.length > 0
            ? record.accessMode.map((item: any) => ({
              ...item,
              brokerEngineType: record.brokerEngineType,
              brokerEngineVersion: record.brokerEngineVersion,
              deployClusterName: record.deployClusterName,
            }))
            : [
              {
                brokerEngineType: record.brokerEngineType,
                brokerEngineVersion: record.brokerEngineVersion,
                deployClusterName: record.deployClusterName,
              },
            ],
      },
    };
    createAction({
      config,
    });
  };

  const handleAuth = () => {
    window.ALIYUN_CONSOLE_NAV_PAYLOAD?.set({
      type: 'activeRamCreator',
      payload: {
        productName: 'cop', // 产品名
        redirectURL: `${window.location.origin}/cop/gateway`,
      },
    });
  };

  const getAuth = async () => {
    return await getListUnauthorizedOrganizationsForRamServiceRole();
  };

  const getEdasRole = async () => {
    return await getEDASJumpRole(ifEnterprise);
  };

  const dataFilterSchema = [
    {
      name: 'name',
      component: 'Input',
      title: '实例名称',
    },
    {
      name: 'gwInstanceId',
      component: 'Input',
      title: '实例ID',
    },
  ];

  useEffect(() => {
    getAuth().then((res: any) => {
      setCreateDisabled(
        Boolean(res.data.find((item: any) => item.id === +getCookie('organizationId'))),
      );
    });

    getEdasRole().then((res: any) => {
      setEdasRole(res);
    });
  }, []);

  return (
    <div style={{ padding: '10px 14px 0' }}>
      <Message style={{ marginBottom: 14 }} type="notice">
        创建实例需要获取本组织下云资源的访问权限，点击
        <a onClick={handleAuth}>云资源访问授权</a>
        检查是否已授权
      </Message>

      <UniTable
        actionRef={tableRef}
        columns={columns}
        mainAction={{
          actions: [
            {
              type: 'primary',
              children: '创建实例',
              disabled: createDisabled,
              onClick: () => {
                // location.href = '/ascm/buy?product=cop';
                window.open('/ascm/buy?product=cop', '_blank');
              },
              icon: 'add-line',
            },
            // {
            //   type: 'default',
            //   children: isShowHigressCols ? '隐藏Higress列' : '显示Higress列',
            //   className: 'cop-gateway-button',
            //   disabled: createDisabled,
            //   onClick: () => {
            //     setHigressCol(!isShowHigressCols);
            //     if (isShowHigressCols) {
            //     tableRef.current?.refresh();
            //     }
            //   },
            // },
          ],
        }}
        pageKey="current"
        pageSizeKey="size"
        dataFilter={{
          mode: 'bar',
          schema: dataFilterSchema,
        }}
        autoWidth={false}
        autoRefresh={(dataSource: any[]) => {
          return dataSource.find((item: any) => item.status === 0) ? 3000 : 0;
        }}
        customRequest={customRequest}
      />
    </div>
  );
};
