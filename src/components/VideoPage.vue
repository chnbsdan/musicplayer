<template>
  <VideoPlayer
    :visible="visible"
    :items="VIDEO_ITEMS"
    title="🎬 在线视频"
    type="video"
    icon="fas fa-video"
    @close="$emit('close')"
  />
</template>

<script setup>
import VideoPlayer from './VideoPlayer.vue'
import { VIDEO_ITEMS } from '../config/videos.js'

defineProps({ visible: Boolean })
defineEmits(['close'])
</script>
