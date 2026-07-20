<template>
  <VideoPlayer
    :visible="visible"
    :items="BILIBILI_ITEMS"
    title="Bilibili"
    type="bilibili"
    icon="fab fa-bilibili"
    icon-color="#00a1d6"
    @close="$emit('close')"
  />
</template>

<script setup>
import VideoPlayer from './VideoPlayer.vue'
import { BILIBILI_ITEMS } from '../config/videos.js'

defineProps({ visible: Boolean })
defineEmits(['close'])
</script>
