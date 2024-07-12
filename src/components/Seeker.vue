<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  max: number,
  min: number,
}>()

const model = defineModel<number>();

const pos = ref(0);
const barRef = ref(null);
const dragging = ref(false)

function handleDrag(e: MouseEvent) {
  if (!dragging.value) return;
  handleClick(e);
}

function handleClick(e: MouseEvent) {
  const { clientWidth } = (barRef.value as unknown as HTMLDivElement)
  const clientLeft = (barRef.value as unknown as HTMLDivElement).getBoundingClientRect().left;

  pos.value = Math.round((e.x - clientLeft) / clientWidth * (props.max - 1)) / (props.max - 1) * 100;
  if (pos.value < 0) pos.value = 0;
  if (pos.value > 100) pos.value = 100;

  model.value = Math.round(pos.value * (props.max - 1) / 100);
};

watch(model, (v) => {
  pos.value = Math.round((v! / (props.max - 1)) * 100);
})

function handleDragEnd() {
  dragging.value = false;
}

onMounted(() => {
  window.addEventListener("mousemove", handleDrag)
  window.addEventListener("mouseup", handleDragEnd)
})

onUnmounted(() => {
  window.removeEventListener("mousemove", handleDrag)
  window.removeEventListener("mouseup", handleDragEnd)
})
</script>

<template>
  <div class="bar" id="bar" ref="barRef" @mousedown="handleClick">
    <div class="ball" @mousedown="dragging = true" :style="{ left: `calc(${pos}% - 0.625rem)` }">

    </div>
  </div>
</template>


<style scoped>
.bar {
  height: 0.5rem;
  width: 100%;
  position: relative;
  background-color: lightgray;
}

.ball {
  position: absolute;
  border-radius: 9999px;
  padding: 0.625rem;
  background-color: hsla(160, 100%, 37%, 1);
  top: 50%;
  transform: translateY(-50%);
}
</style>
