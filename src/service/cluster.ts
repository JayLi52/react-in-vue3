import { request } from '@ali/teamix-pro';
import { commonUrl, product, version } from './base';
import { registerInnerRequest } from './request';

registerInnerRequest();
export const listClusters = (params: any) => {
  return request({
    url: commonUrl,
    method: 'post',
    data: {
      $product: product,
      $version: version,
      $action: 'ListClusters',
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
