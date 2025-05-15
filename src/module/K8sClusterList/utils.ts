import { getJumpConsoleInfoByIdentifier } from '../../service/instance';

export const getEDASJumpRole = async (ifEnterprise: boolean) => {
  if (!ifEnterprise) return '';
  let JUMP_EDAS_ROLE = '';
  const res = await getJumpConsoleInfoByIdentifier('edas');
  const result = (res.data?.btnInfo || []).map((item) => item.redirectType);
  if (result.includes('REDIRECT_BY_ASCM_ACCOUNT')) {
    JUMP_EDAS_ROLE = 'REDIRECT_BY_ASCM_ACCOUNT';
  } else if (result.includes('REDIRECT_BY_RAM_ROLE_ONLY')) {
    JUMP_EDAS_ROLE = 'REDIRECT_BY_RAM_ROLE_ONLY';
  } else if (result.includes('REDIRECT_BY_RAM_SUB_ACCOUNT_ONLY')) {
    JUMP_EDAS_ROLE = 'REDIRECT_BY_RAM_SUB_ACCOUNT_ONLY';
  }
  return JUMP_EDAS_ROLE;
};
