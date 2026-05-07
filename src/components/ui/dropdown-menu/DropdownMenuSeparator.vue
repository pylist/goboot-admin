<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { DropdownMenuSeparator, type DropdownMenuSeparatorProps, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps<DropdownMenuSeparatorProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...rest } = props;
  return rest;
});
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <DropdownMenuSeparator
    v-bind="forwarded"
    :class="cn('-mx-1 my-1 h-px bg-muted', props.class)"
  />
</template>
