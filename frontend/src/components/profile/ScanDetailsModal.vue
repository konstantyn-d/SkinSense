<script setup>
import { computed } from 'vue'
import { formatDateTime, formatScore, formatSeverity } from '../../utils/format'

const props = defineProps({
  scan: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const formattedDate = computed(() => {
  if (!props.scan) return ''
  return formatDateTime(props.scan.scan_date || props.scan.created_at)
})

const scoreFormatted = computed(() => {
  if (!props.scan) return '--'
  return formatScore(props.scan.overall_skin_health_score)
})

const detectedIssues = computed(() => {
  if (!props.scan || !Array.isArray(props.scan.detected_issues)) return []
  return props.scan.detected_issues
})

const recommendations = computed(() => {
  if (!props.scan || !Array.isArray(props.scan.recommendations)) return []
  return props.scan.recommendations
})

const handleClose = () => {
  emit('close')
}

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}

const getSeverityInfo = (severity) => {
  return formatSeverity(severity)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && scan" class="modal-overlay" @click="handleBackdropClick">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">Scan Details</h2>
            <button class="close-button neumorphic-button btn-icon" @click="handleClose">
              ✕
            </button>
          </div>

          <!-- Scan Image -->
          <div v-if="scan.image_url" class="scan-image-container">
            <img :src="scan.image_url" :alt="`Scan from ${formattedDate}`" class="scan-image" />
          </div>

          <!-- Scan Info -->
          <div class="scan-info-grid">
            <div class="info-item">
              <span class="info-label">Date</span>
              <span class="info-value">{{ formattedDate }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Health Score</span>
              <span class="info-value">{{ scoreFormatted }}</span>
            </div>
          </div>

          <!-- Detected Issues -->
          <div v-if="detectedIssues.length > 0" class="section">
            <h3 class="section-title">Detected Issues</h3>
            <div class="issues-list">
              <div
                v-for="(issue, index) in detectedIssues"
                :key="index"
                class="issue-item neumorphic-card card-sm"
              >
                <div class="issue-header">
                  <h4 class="issue-name">{{ issue.name }}</h4>
                  <span class="badge" :class="`badge-${getSeverityInfo(issue.severity).color}`">
                    {{ getSeverityInfo(issue.severity).emoji }} {{ getSeverityInfo(issue.severity).label }}
                  </span>
                </div>
                <p v-if="issue.description" class="issue-description">{{ issue.description }}</p>
                <div v-if="issue.location" class="issue-location">
                  <span class="location-icon">📍</span>
                  <span>{{ issue.location }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div v-if="recommendations.length > 0" class="section">
            <h3 class="section-title">Recommendations</h3>
            <div class="recommendations-list">
              <div
                v-for="(rec, index) in recommendations"
                :key="index"
                class="recommendation-item neumorphic-card card-sm"
              >
                <h4 class="recommendation-title">{{ rec.title }}</h4>
                <p class="recommendation-description">{{ rec.description }}</p>
                <div v-if="rec.category" class="recommendation-category">
                  <span class="badge badge-primary">{{ rec.category }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Analysis Notes -->
          <div v-if="scan.analysis_notes" class="section">
            <h3 class="section-title">Analysis Notes</h3>
            <p class="analysis-notes">{{ scan.analysis_notes }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(46, 58, 89, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal-backdrop);
  padding: var(--spacing-md);
  overflow-y: auto;
}

.modal-content {
  background: var(--color-background-main);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--spacing-xl);
  position: relative;
  z-index: var(--z-index-modal);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.modal-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.close-button {
  font-size: var(--font-size-xl);
}

.scan-image-container {
  margin-bottom: var(--spacing-lg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-neumorphic-md);
}

.scan-image {
  width: 100%;
  height: auto;
  display: block;
}

.scan-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--color-background-main);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-flat);
}

.info-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.section {
  margin-bottom: var(--spacing-xl);
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.issues-list,
.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.issue-item,
.recommendation-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.issue-name,
.recommendation-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.issue-description,
.recommendation-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.issue-location {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.location-icon {
  font-size: var(--font-size-base);
}

.recommendation-category {
  margin-top: var(--spacing-xs);
}

.analysis-notes {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  padding: var(--spacing-md);
  background: var(--color-background-main);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-neumorphic-inset-sm);
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--transition-base);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform var(--transition-base);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

@media (max-width: 640px) {
  .modal-content {
    padding: var(--spacing-lg);
  }

  .scan-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>

