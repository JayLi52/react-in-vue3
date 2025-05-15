import React, { useRef } from 'react';
import { UniTable } from '@alife/teamix-uni-table';
import { Button, Message } from '@ali/teamix-ui';
import {
  createAction,
  customComponent,
  ProActionConfig,
  ProTableActionType,
  ProTableColumnProps,
  setGlobalConfig,
} from '@ali/teamix-pro';

import { k8sClusterTypeMap, statusMap } from './constant';
import './index.scss';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/ext-language_tools';
import { listClusters } from '../../service/cluster';

export default (props: any) => {
  const {
    ifEnterprise,
    updateCluster,
    checkConnectK8sCluster,
    cancelImportK8sCluster,
    importK8sCluster,
  } = props;
  // console.log('getInstanceList', getInstanceList);

  const form = useRef();

  // const [isShowHigressCols, setHigressCol] = useState(false);

  const tableRef = useRef<ProTableActionType>(null);
  const columns: ProTableColumnProps[] = [
    {
      title: 'K8s集群ID/名称',
      dataIndex: 'k8sClusterCode',
      tooltip: '集群实例ID/名称',
      width: 240,
      lock: 'left',
      render: {
        copy: true,
        descriptionCopy: true,
        description: '{{ record.k8sClusterName }}',
        icon: 'task-fill',
        iconColor: 'B20',
        // link: true,
        // linkOnClick: (k8sClusterCode: any, _index: number, record: any) => {

        // },
      },
    },
    {
      title: '集群类型',
      dataIndex: 'k8sClusterType',
      dataSource: k8sClusterTypeMap,
      // render: {
      //   // copy: true,
      // }
      width: 180,
    },
    {
      title: '容器服务集群ID',
      dataIndex: 'k8sClusterAttribute.csClusterId',
      width: 180,
      render: {
        copy: true,
      },
    },
    {
      title: '容器服务集群名称',
      dataIndex: 'k8sClusterAttribute.csClusterName',
      width: 180,
      render: {
        copy: true,
      },
    },
    {
      title: '集群状态',
      dataIndex: 'k8sClusterStatus',
      dataSource: statusMap,
      // filters: statusMap,
      width: 120,
      render: {
        type: 'statusIconTag',
        overlay: (value) => {
          return value === 1 ? <>请查看集群中该实例是否正常运行</> : false;
        },
      },
    },
    {
      title: '集群地址',
      width: 80,
      dataIndex: 'masterUrl',
      hidden: !ifEnterprise,
      render: {
        copy: true,
      },
    },
    {
      title: '导入时间',
      width: 80,
      dataIndex: 'k8sClusterImportDateTime',
      hidden: !ifEnterprise,
    },
    {
      title: '操作',
      lock: 'right',
      width: 240,
      dataIndex: '_action',
      actionSchema: {
        actions: [
          {
            children: '移除',
            onClick: (_e, { record }: any) => {
              const config: ProActionConfig = {
                type: 'confirm',
                title: '移除该k8s集群',
                content: '此操作将移除该k8s集群, 是否继续?',
                onOk: () => {
                  cancelImportK8sCluster(record.k8sClusterCode);
                  tableRef.current?.refresh();
                },
              };
              createAction({
                config,
              });
              // cancelImportK8sCluster(record.k8sClusterCode)
            },
          },
          {
            children: '编辑',
            onClick: (_e, { record }: any) => {
              const config: ProActionConfig = {
                type: 'drawer-form',
                title: '编辑K8s集群',
                schema: [
                  {
                    name: 'k8sClusterName',
                    title: '名称',
                    component: 'Input',
                    required: true,
                  },
                  {
                    name: 'k8sClusterType',
                    title: '集群类型',
                    component: 'Select',
                    dataSource: k8sClusterTypeMap,
                    required: true,
                    // disabled: true,
                  },
                  {
                    name: 'csClusterId',
                    title: '容器服务集群ID',
                    component: 'Input',
                    reactions: {
                      dependencies: ['k8sClusterType'],
                      fulfill: {
                        state: {
                          hidden: '{{$deps[0] !== \'container-service\'}}',
                        },
                      },
                    },
                    required: true,
                  },
                  {
                    name: 'csClusterName',
                    title: '容器服务集群名称',
                    component: 'Input',
                    reactions: {
                      dependencies: ['k8sClusterType'],
                      fulfill: {
                        state: {
                          hidden: '{{$deps[0] !== \'container-service\'}}',
                        },
                      },
                    },
                    required: true,
                  },
                  {
                    name: 'configContents',
                    title: '配置内容',
                    component: 'CustomAceEditor',
                    tooltip: 'Kubernetes 集群配置Yaml(编辑情况下只支持覆盖)',
                    decorator: 'FormItem',
                    type: 'string',
                    // description: 'Kubernetes 集群配置Yaml(编辑情况下只支持覆盖)',
                    props: {
                      mode: 'yaml',
                      theme: 'github_dark',
                    },
                  },
                  // {
                  //   name: 'k8sClusterAttribute',
                  //   title: '集群扩展信息 - JSON',
                  //   component: 'CustomAceEditor',
                  //   type: 'string',
                  //   decorator: 'FormItem',
                  //   props: {
                  //     mode: 'yaml',
                  //     theme: 'github_dark',
                  //   }
                  // },
                ],
                initialValues: {
                  k8sClusterName: record.k8sClusterName,
                  configContents: record.configContents || '',
                  // k8sClusterAttribute: record.k8sClusterAttribute,
                  k8sClusterType: record.k8sClusterType,
                  k8sClusterCode: record.k8sClusterCode,
                  csClusterName: JSON.parse(record.k8sClusterAttribute).csClusterName,
                  csClusterId: JSON.parse(record.k8sClusterAttribute).csClusterId,
                },
                formRef: form,
                footer(context: any) {
                  console.log('form.current', form.current);
                  if (!(form && form.current)) return null;
                  return (
                    <>
                      <Button
                        onClick={() => {
                          context.hide();
                        }}
                      >
                        取消
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          checkConnectK8sCluster({
                            configContent: form.current.values.configContents,
                          }).then((res: any) => {
                            if (res.data.connectStatusDesc.includes('正常')) {
                              Message.success('连接成功');
                            } else {
                              Message.error(res.data.connectStatusDesc);
                            }
                          });
                        }}
                        className="footer-btn"
                      >
                        测试连接
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          form.current.submit().then((values: any) => {
                            updateCluster({
                              ...values,
                              clusterCode: record.k8sClusterCode,
                              k8sClusterAttribute: JSON.stringify({
                                csClusterId: values.csClusterId,
                                csClusterName: values.csClusterName,
                              }),
                              configContent: values.configContents,
                            }).then((res) => {
                              context.hide();
                              tableRef.current?.refresh();
                            });
                          });
                        }}
                        className="footer-btn"
                      >
                        确定
                      </Button>
                    </>
                  );
                },
              };
              createAction({
                config,
              });
            },
            disabled: true,
          },
        ],
      },
    },
  ];

  const customRequest = async (params: any) => {
    try {
      const result = await listClusters({
        activeSearchName: params.clusterName ? 'clusterName' : '',
        ...params,
      });
      return {
        data: result?.data?.records.map((item) => ({
          ...item,
          k8sClusterAttribute: JSON.parse(item.k8sClusterAttribute || '{}'),
        })),
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

  const dataFilterSchema = [
    {
      name: 'clusterName',
      component: 'Input',
      title: '集群名称',
    },
  ];

  const CustomAceEditor = customComponent(({ onChange, values, ...props }: any) => {
    return (
      <AceEditor
        width="100%"
        mode={props.mode}
        theme={props.theme}
        onChange={(value) => {
          onChange(value);
        }}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
      />
    );
  });

  setGlobalConfig({
    ProForm: {
      components: {
        CustomAceEditor,
      },
    },
  });

  return (
    <div style={{ padding: '10px 14px 0' }}>
      {/* <Message style={{ marginBottom: 14 }} type="notice">
        创建实例需要获取本组织下云资源的访问权限，点击
        <a onClick={handleAuth}>云资源访问授权</a>
        检查是否已授权
      </Message> */}

      <UniTable
        actionRef={tableRef}
        columns={columns}
        mainAction={{
          actions: [
            {
              type: 'primary',
              children: '导入K8s集群',
              onClick: () => {
                const config: ProActionConfig = {
                  type: 'drawer-form',
                  title: '导入K8s集群',
                  size: 'medium',
                  schema: [
                    {
                      name: 'k8sClusterName',
                      title: '名称',
                      component: 'Input',
                      required: true,
                    },
                    {
                      name: 'k8sClusterType',
                      title: '集群类型',
                      component: 'Select',
                      dataSource: k8sClusterTypeMap,
                      required: true,
                    },
                    {
                      name: 'csClusterId',
                      title: '容器服务集群ID',
                      component: 'Input',
                      reactions: {
                        dependencies: ['k8sClusterType'],
                        fulfill: {
                          state: {
                            hidden: '{{$deps[0] !== \'container-service\'}}',
                          },
                        },
                      },
                      required: true,
                    },
                    {
                      name: 'csClusterName',
                      title: '容器服务集群名称',
                      component: 'Input',
                      reactions: {
                        dependencies: ['k8sClusterType'],
                        fulfill: {
                          state: {
                            hidden: '{{$deps[0] !== \'container-service\'}}',
                          },
                        },
                      },
                      required: true,
                    },
                    {
                      name: 'configContents',
                      title: '配置内容',
                      component: 'CustomAceEditor',
                      decorator: 'FormItem',
                      type: 'string',
                      props: {
                        mode: 'yaml',
                        theme: 'github_dark',
                      },
                    },
                    // {
                    //   name: 'k8sClusterAttribute',
                    //   title: '集群扩展信息 - JSON',
                    //   component: 'CustomAceEditor',
                    //   decorator: 'FormItem',
                    //   type: 'string',
                    //   props: {
                    //     mode: 'json',
                    //     theme: 'github_dark'
                    //   },
                    // },
                  ],
                  initialValues: {
                    k8sClusterName: '',
                    configContents: '',
                    k8sClusterAttribute: '',
                    k8sClusterType: '',
                  },
                  formRef: form,
                  footer: (context: any) => {
                    return (
                      <>
                        <Button
                          onClick={() => {
                            context.hide();
                          }}
                        >
                          取消
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => {
                            checkConnectK8sCluster({
                              configContent: form.current.values.configContents,
                            }).then((res) => {
                              if (res.data.connectStatusDesc.includes('正常')) {
                                Message.success('连接成功');
                              } else {
                                Message.error(res.data.connectStatusDesc);
                              }
                            });
                          }}
                          className="footer-btn"
                        >
                          测试连接
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => {
                            form.current.submit().then((values: any) => {
                              importK8sCluster({
                                ...values,
                                k8sClusterAttribute: JSON.stringify({
                                  csClusterId: values.csClusterId || '',
                                  csClusterName: values.csClusterName || '',
                                }),
                                configContent: values.configContents,
                              }).then(() => {
                                tableRef.current?.refresh();
                                context.hide();
                              });
                            });
                          }}
                          className="footer-btn"
                        >
                          确定
                        </Button>
                      </>
                    );
                  },
                };
                createAction({
                  config,
                });
              },
              icon: 'add-line',
            },
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
