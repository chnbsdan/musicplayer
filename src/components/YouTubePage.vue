<template>
  <VideoPlayer
    :visible="visible"
    :items="YOUTUBE_ITEMS"
    title="YouTube"
    type="youtube"
    icon="fab fa-youtube"
    icon-color="#ff0000"
    @close="$emit('close')"
  />
</template>

<script setup>
import VideoPlayer from './VideoPlayer.vue'
import { YOUTUBE_ITEMS } from '../config/videos.js'

defineProps({ visible: Boolean })
defineEmits(['close'])
</script>
