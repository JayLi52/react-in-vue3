import { ProFormRequestConfig, request } from '@ali/teamix-pro';
import { commonUrl, product, version } from './base';
import { registerInnerRequest } from './request';

registerInnerRequest();
export const listInstances = (params: any) => {
  return request({
    url: commonUrl,
    method: 'post',
    data: {
      $product: product,
      $version: version,
      $action: 'ListInstances',
      $content: params,
      // ...params,
    },
  });
};

export const getListUnauthorizedOrganizationsForRamServiceRole = () => {
  return request({
    url: commonUrl,
    method: 'post',
    data: {
      $product: 'ascm',
      $version: '2019-05-10',
      $action: 'ListUnauthorizedOrganizationsForRamServiceRole',
      productName: 'cop',
    },
  });
};

export const getJumpConsoleInfoByIdentifier = () => {
  return request({
    url: commonUrl,
    method: 'post',
    data: {
      $product: 'ascm',
      $version: '2019-05-10',
      $action: 'GetJumpConsoleInfoByIdentifier',
      identifier: 'edas',
    },
  });
};

export const logoutInstanceParams = (params: any): ProFormRequestConfig => ({
  url: commonUrl,
  method: 'post',
  data: {
    $product: product,
    $version: version,
    $action: 'DeleteInstance',
    ...params,
  },
});

export const stopInstanceParams = (params: any): ProFormRequestConfig => ({
  url: commonUrl,
  method: 'post',
  data: {
    $product: product,
    $version: version,
    $action: 'StopInstance',
    ...params,
  },
});

export const restartInstanceParams = (params: any): ProFormRequestConfig => ({
  url: commonUrl,
  method: 'post',
  data: {
    $product: product,
    $version: version,
    $action: 'RestartInstance',
    ...params,
  },
});
