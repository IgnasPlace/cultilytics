<!-- LoadingSpinner.vue -->
<template>
  <div class="spinner-border size-7">
    <svg viewBox="25 25 50 50" class="circular">
      <circle
        cx="50"
        cy="50"
        r="20"
        fill="none"
        class="path"
        stroke="#333"
        stroke-width="4"
        stroke-dasharray="100"
        stroke-dashoffset="0"
      />
    </svg>
  </div>
</template>

<script>

</script>

<style scoped>
.spinner-border {
  border-radius: 50%;
  overflow: hidden;
}

.circular {
  -webkit-animation: rotate 2s linear infinite;
  animation: rotate 2s linear infinite;
  height: 100%;
  transform-origin: center;
}

.path {
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -125;
  }
}
</style>
