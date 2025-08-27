import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { BuildingApi } from '#/api/bdm/building';

import { getZonePage } from '#/api/bdm/zone';

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'zoneId',
      label: '所属区域',
      rules: 'required',
      component: 'ApiSelect',
      componentProps: {
        api: () => getZoneOptions(),
        placeholder: '请选择所属区域',
      },
    },
    {
      fieldName: 'name',
      label: '楼栋名称',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入楼栋名称',
      },
    },
    {
      fieldName: 'sort',
      label: '显示顺序',
      rules: 'required',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: '请输入显示顺序',
      },
      defaultValue: 0,
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '楼栋名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入楼栋名称',
      },
    },
    {
      fieldName: 'zoneId',
      label: '所属区域',
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: () => getZoneOptions(),
        placeholder: '请选择所属区域',
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<BuildingApi.Building>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '楼栋编号',
      minWidth: 120,
    },
    {
      field: 'zoneName',
      title: '所属区域',
      minWidth: 120,
    },
    {
      field: 'name',
      title: '楼栋名称',
      minWidth: 120,
    },
    {
      field: 'sort',
      title: '显示顺序',
      minWidth: 120,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export function getZoneOptions() {
  return getZonePage({ pageNo: 1, pageSize: 20 }).then((res) => {
    return res.list.map((item) => ({
      label: item.abbreviation,
      value: item.id,
    }));
  });
}
