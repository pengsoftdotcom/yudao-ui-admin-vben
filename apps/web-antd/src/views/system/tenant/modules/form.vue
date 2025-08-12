<script lang="ts" setup>
import type { OrgApi } from '#/api/system/org';
import type { SystemTenantApi } from '#/api/system/tenant';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getOrgListForSaveTenant } from '#/api/system/org';
import { createTenant, getTenant, updateTenant } from '#/api/system/tenant';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<SystemTenantApi.Tenant>();
const getTitle = computed(() => {
  return formData.value
    ? $t('ui.actionTitle.edit', ['租户'])
    : $t('ui.actionTitle.create', ['租户']);
});
const orgList = ref<OrgApi.Org[]>([]);
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  // 一共2列
  wrapperClass: 'grid-cols-2',
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
  handleValuesChange(values: Record<string, any>, fieldsChanged: string[]) {
    if (fieldsChanged.includes('orgId') && values.orgId) {
      orgList.value
        .filter((org) => org.id === values.orgId)
        .forEach((org) => {
          formApi.setFieldValue('name', org.abbreviation);
        });
    }
  },
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    // 提交表单
    const data = (await formApi.getValues()) as SystemTenantApi.Tenant;
    try {
      await (formData.value ? updateTenant(data) : createTenant(data));
      // 关闭并提示
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
    }
  },
  async onOpened() {
    // 加载数据
    const data = modalApi.getData<SystemTenantApi.Tenant>();
    if (!data || !data.id) {
      orgList.value = await getOrgListForSaveTenant();
      formApi.updateSchema(useFormSchema(orgList.value));
      return;
    }
    modalApi.lock();
    try {
      orgList.value = await getOrgListForSaveTenant(data.id);
      formApi.updateSchema(useFormSchema(orgList.value));
      formData.value = await getTenant(data.id);
      if (formData.value.expireTime !== undefined) {
        formData.value.expireTime = new Date(formData.value.expireTime);
      }
      // 设置到 values
      formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>
<template>
  <Modal :title="getTitle" class="w-2/3">
    <Form class="mx-4" />
  </Modal>
</template>
