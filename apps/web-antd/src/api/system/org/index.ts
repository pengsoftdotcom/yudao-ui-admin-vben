import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace OrgApi {
  /** 组织信息 */
  export interface Org {
    id: number; // 部门id
    name?: string; // 组织名称
    abbreviation?: string; // 组织简称
    parentId?: number; // 父组织id
    sort?: number; // 显示顺序
    status?: number; // 组织状态（0正常 1停用）
  }
}

/** 查询组织分页 */
export function getOrgPage(params: PageParam) {
  return requestClient.get<PageResult<OrgApi.Org>>('/system/org/page', {
    params,
  });
}

/** 查询组织详情 */
export function getOrg(id: number) {
  return requestClient.get<OrgApi.Org>(`/system/org/get?id=${id}`);
}

/** 新增组织 */
export function createOrg(data: OrgApi.Org) {
  return requestClient.post('/system/org/create', data);
}

/** 修改组织 */
export function updateOrg(data: OrgApi.Org) {
  return requestClient.put('/system/org/update', data);
}

/** 删除组织 */
export function deleteOrg(id: number) {
  return requestClient.delete(`/system/org/delete?id=${id}`);
}

/** 批量删除组织 */
export function deleteOrgList(ids: number[]) {
  return requestClient.delete(`/system/org/delete-list?ids=${ids.join(',')}`);
}

/** 导出组织 */
export function exportOrg(params: any) {
  return requestClient.download('/system/org/export-excel', params);
}

/** 查询组织列表 */
export function getOrgList() {
  return requestClient.get<OrgApi.Org[]>('/system/org/list');
}
