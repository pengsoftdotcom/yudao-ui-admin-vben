import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ApartmentApi } from '#/api/bdm/apartment';

import { getFloorListByBuildingId } from '#/api/bdm/floor';
import { getZoneOptions } from '#/views/bdm/building/data';
import { getBuildingOptions } from '#/views/bdm/floor/data';

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
      fieldName: 'buildingId',
      label: '所属楼栋',
      rules: 'required',
      component: 'ApiSelect',
      componentProps: {
        options: [],
        fieldNames: { label: 'name', value: 'id' },
        placeholder: '请选择所属楼栋',
      },
      dependencies: {
        triggerFields: ['zoneId'],
        componentProps: async (values) => ({
          options: await getBuildingOptions(values.zoneId),
        }),
      },
    },
    {
      fieldName: 'floorId',
      label: '所属楼层',
      rules: 'required',
      component: 'ApiSelect',
      componentProps: {
        options: [],
        fieldNames: { label: 'name', value: 'id' },
        placeholder: '请选择所属楼层',
      },
      dependencies: {
        triggerFields: ['buildingId'],
        componentProps: async (values) => ({
          options: await getFloorOptions(values.buildingId),
        }),
      },
    },
    {
      fieldName: 'name',
      label: '房屋名称',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入房屋名称',
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
      label: '房屋名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入房屋名称',
      },
    },
    {
      fieldName: 'buildingId',
      label: '楼栋编号',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入楼栋编号',
      },
    },
    {
      fieldName: 'sort',
      label: '显示顺序',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入显示顺序',
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<ApartmentApi.Apartment>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '房屋编号',
      minWidth: 120,
    },

    {
      field: 'zoneName',
      title: '所属区域',
      minWidth: 120,
    },
    {
      field: 'buildingName',
      title: '所属楼栋',
      minWidth: 120,
    },
    {
      field: 'floorName',
      title: '所属楼层',
      minWidth: 120,
    },
    {
      field: 'name',
      title: '房屋名称',
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

export async function getFloorOptions(buildingId?: number) {
  return buildingId === undefined
    ? Promise.resolve([])
    : getFloorListByBuildingId(buildingId);
}
