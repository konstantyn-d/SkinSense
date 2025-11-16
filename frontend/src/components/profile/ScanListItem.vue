<script setup>
import { computed } from 'vue'
import { formatDate, formatScore } from '../../utils/format'

const props = defineProps({
  scan: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const formattedDate = computed(() => {
  return formatDate(props.scan.scan_date || props.scan.created_at)
})

const issuesCount = computed(() => {
  if (Array.isArray(props.scan.detected_issues)) {
    return props.scan.detected_issues.length
  }
  return 0
})

const scoreFormatted = computed(() => {
  return formatScore(props.scan.overall_skin_health_score)
})

const scoreClass = computed(() => {
  const score = props.scan.overall_skin_health_score
  if (score >= 80) return 'score-excellent'
  if (score >= 60) return 'score-good'
  if (score >= 40) return 'score-fair'
  return 'score-poor'
})

const handleClick = () => {
  emit('click', props.scan)
}
</script>

<template>
  <div class="scan-list-item neumorphic-card card-sm" @click="handleClick">
    <div class="scan-thumbnail">
      <img v-if="scan.image_url" :src="scan.image_url" :alt="`Scan from ${formattedDate}`" />
      <div v-else class="thumbnail-placeholder">📸</div>
    </div>

    <div class="scan-info">
      <div class="scan-date">{{ formattedDate }}</div>
      <div class="scan-issues">
        <span class="issues-icon">🔍</span>
        <span>{{ issuesCount }} issue{{ issuesCount !== 1 ? 's' : '' }} detected</span>
      </div>
    </div>

    <div class="scan-score" :class="scoreClass">
      <div class="score-value">{{ scoreFormatted }}</div>
      <div class="score-label">Score</div>
    </div>
  </div>
</template>

<style scoped>
.scan-list-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.scan-list-item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-neumorphic-lg);
}

.scan-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-background-dark);
  box-shadow: var(--shadow-neumorphic-inset-sm);
}

.scan-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
  background: var(--color-background-main);
}

.scan-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.scan-date {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.scan-issues {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.issues-icon {
  font-size: var(--font-size-base);
}

.scan-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--color-background-main);
  box-shadow: var(--shadow-flat);
  min-width: 70px;
}

.score-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: 1;
}

.score-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.score-excellent .score-value {
  color: var(--color-success);
}

.score-good .score-value {
  color: var(--color-info);
}

.score-fair .score-value {
  color: var(--color-warning);
}

.score-poor .score-value {
  color: var(--color-error);
}

@media (max-width: 640px) {
  .scan-thumbnail {
    width: 50px;
    height: 50px;
  }

  .scan-date {
    font-size: var(--font-size-sm);
  }

  .scan-issues {
    font-size: var(--font-size-xs);
  }
}
</style>

