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
      <div v-else class="thumbnail-placeholder">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.48898 7H6.2002C5.08009 7 4.51962 7 4.0918 7.21799C3.71547 7.40973 3.40973 7.71547 3.21799 8.0918C3 8.51962 3 9.08009 3 10.2002V15.8002C3 16.9203 3 17.4796 3.21799 17.9074C3.40973 18.2837 3.71547 18.5905 4.0918 18.7822C4.5192 19 5.07899 19 6.19691 19H17.8031C18.921 19 19.48 19 19.9074 18.7822C20.2837 18.5905 20.5905 18.2837 20.7822 17.9074C21 17.48 21 16.921 21 15.8031V10.1969C21 9.07899 21 8.5192 20.7822 8.0918C20.5905 7.71547 20.2837 7.40473 19.9074 7.21799C19.4796 7 18.9203 7 17.8002 7H14.5108M9.48898 7H9.55078M9.48898 7C9.50151 7.00001 9.51468 7 9.52857 7L9.55078 7M9.48898 7C9.38286 6.99995 9.32339 6.99941 9.27637 6.99414C8.68878 6.92835 8.28578 6.36908 8.40918 5.79084C8.42066 5.73703 8.44336 5.66894 8.4883 5.53412L8.49023 5.52841C8.54156 5.37443 8.56723 5.29743 8.59558 5.22949C8.88586 4.53389 9.54322 4.06083 10.2949 4.00541C10.3683 4 10.449 4 10.6113 4H13.3886C13.5509 4 13.6322 4 13.7057 4.00541C14.4574 4.06083 15.114 4.53389 15.4043 5.22949C15.4326 5.29743 15.4584 5.37434 15.5098 5.52832C15.556 5.66699 15.5791 5.73636 15.5908 5.79093C15.7142 6.36917 15.3118 6.92835 14.7242 6.99414C14.6772 6.99941 14.6171 6.99995 14.5108 7M9.55078 7H14.449M14.449 7H14.5108M14.449 7L14.4712 7C14.4851 7 14.4983 7.00001 14.5108 7M12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13C15 14.6569 13.6569 16 12 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <div class="scan-info">
      <div class="scan-date">{{ formattedDate }}</div>
      <div class="scan-issues">
        <span class="issues-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.0005 7L14.1543 12.9375C14.0493 13.0441 13.9962 13.0976 13.9492 13.1396C13.1899 13.8193 12.0416 13.8193 11.2822 13.1396C11.2352 13.0976 11.1817 13.0442 11.0767 12.9375C10.9716 12.8308 10.9191 12.7774 10.8721 12.7354C10.1127 12.0557 8.96397 12.0557 8.20461 12.7354C8.15771 12.7773 8.10532 12.8305 8.00078 12.9367L4 17M20.0005 7L20 13M20.0005 7H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
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
  background: var(--color-background-main);
  color: var(--color-text-secondary);
}

.thumbnail-placeholder svg {
  width: 24px;
  height: 24px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-main);
}

.issues-icon svg {
  width: 16px;
  height: 16px;
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

