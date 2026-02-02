<template>
  <component
    :is="iconComponent"
    :size="size"
    :class="colorClass"
  />
</template>

<script setup>
import { computed } from 'vue';
import IconTrash from '@/components/Icons/IconTrash.vue';
import IconPlus from '@/components/Icons/IconPlus.vue';
import IconClose from '@/components/Icons/IconClose.vue';
import IconUpload from '@/components/Icons/IconUpload.vue';
import IconWarning from '@/components/Icons/IconWarning.vue';
import IconSpinner from '@/components/Icons/IconSpinner.vue';
import IconCheck from '@/components/Icons/IconCheck.vue';
import IconInfo from '@/components/Icons/IconInfo.vue';
import IconClock from '@/components/Icons/IconClock.vue';
import IconCalendar from '@/components/Icons/IconCalendar.vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: (value) => [
      'trash',
      'plus',
      'close',
      'upload',
      'warning',
      'spinner',
      'check',
      'info',
      'clock',
      'calendar'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md'
  },
  color: {
    type: String,
    default: 'current'
  }
});

const iconMap = {
  trash: IconTrash,
  plus: IconPlus,
  close: IconClose,
  upload: IconUpload,
  warning: IconWarning,
  spinner: IconSpinner,
  check: IconCheck,
  info: IconInfo,
  clock: IconClock,
  calendar: IconCalendar
};

const iconComponent = computed(() => iconMap[props.name]);

const colorClasses = {
  current: '',
  primary: 'text-primary',
  secondary: 'text-secondary',
  white: 'text-white',
  red: 'text-red-600',
  green: 'text-green-600',
  amber: 'text-amber-500',
  gray: 'text-gray-500'
};

const colorClass = computed(() => colorClasses[props.color] || '');
</script>
