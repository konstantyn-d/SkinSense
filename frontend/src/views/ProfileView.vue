<script setup>
import { ref, computed, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import ProfileHeader from '../components/profile/ProfileHeader.vue'
import ScanListItem from '../components/profile/ScanListItem.vue'
import ScanDetailsModal from '../components/profile/ScanDetailsModal.vue'
import api from '../lib/apiClient'

// State
const scans = ref([])
const progressSummary = ref({
  activeIssues: 0,
  avgProgress: 0,
  resolvedIssues: 0
})
const selectedScan = ref(null)
const isModalOpen = ref(false)
const loading = ref(true)
const error = ref(null)

// Computed
const totalScans = computed(() => scans.value.length)

const averageHealthScore = computed(() => {
  if (scans.value.length === 0) return 0
  
  const sum = scans.value.reduce((acc, scan) => {
    return acc + (scan.overall_skin_health_score || 0)
  }, 0)
  
  return Math.round(sum / scans.value.length)
})

const recentScans = computed(() => {
  return scans.value.slice(0, 10) // Show last 10 scans
})

// Methods
const fetchScans = async () => {
  const result = await api.get('/scans')
  
  if (result.success) {
    scans.value = result.data.scans || []
  } else {
    error.value = result.error
    console.error('Error fetching scans:', result.error)
  }
}

const fetchProgressSummary = async () => {
  const result = await api.get('/progress/summary')
  
  if (result.success) {
    progressSummary.value = {
      activeIssues: result.data.activeIssues || 0,
      avgProgress: result.data.avgProgress || 0,
      resolvedIssues: result.data.resolvedIssues || 0
    }
  } else {
    console.error('Error fetching progress summary:', result.error)
  }
}

const fetchScanDetails = async (scanId) => {
  const result = await api.get(`/scans/${scanId}`)
  
  if (result.success) {
    selectedScan.value = result.data
    isModalOpen.value = true
  } else {
    console.error('Error fetching scan details:', result.error)
  }
}

const handleScanClick = (scan) => {
  fetchScanDetails(scan.id)
}

const closeModal = () => {
  isModalOpen.value = false
  selectedScan.value = null
}

const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    await Promise.all([
      fetchScans(),
      fetchProgressSummary()
    ])
  } catch (err) {
    error.value = 'Failed to load profile data'
    console.error('Error loading profile data:', err)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>

<template>
  <MainLayout>
    <div class="profile-view">
      <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="spinner spinner-lg"></div>
          <p class="text-secondary mt-md">Loading profile...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <div class="error-message">
            <span class="error-icon">❌</span>
            {{ error }}
          </div>
          <button class="neumorphic-button btn-primary mt-md" @click="loadData">
            Retry
          </button>
        </div>

        <!-- Profile Content -->
        <div v-else>
          <!-- Profile Header -->
          <ProfileHeader
            :total-scans="totalScans"
            :resolved-issues="progressSummary.resolvedIssues"
            class="mb-xl"
          />

          <!-- Stat Cards -->
          <div class="stat-cards-grid mb-xl">
            <div class="stat-card">
              <div class="stat-card-icon">💯</div>
              <div class="stat-card-label">Avg Health Score</div>
              <div class="stat-card-value">{{ averageHealthScore }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-card-icon">📊</div>
              <div class="stat-card-label">Total Scans</div>
              <div class="stat-card-value">{{ totalScans }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-card-icon">🎯</div>
              <div class="stat-card-label">Tracking Issues</div>
              <div class="stat-card-value">{{ progressSummary.activeIssues }}</div>
            </div>
          </div>

          <!-- Recent Scans Section -->
          <div class="section">
            <div class="section-header">
              <h2 class="section-title">Recent Scans</h2>
              <span v-if="totalScans > 0" class="section-count">{{ totalScans }}</span>
            </div>

            <!-- No Scans State -->
            <div v-if="recentScans.length === 0" class="empty-state neumorphic-card">
              <div class="empty-icon">📸</div>
              <h3 class="empty-title">No scans yet</h3>
              <p class="empty-description">
                Start your skin health journey by taking your first scan
              </p>
              <router-link to="/scan" class="neumorphic-button btn-primary btn-lg mt-lg">
                Take Your First Scan
              </router-link>
            </div>

            <!-- Scans List -->
            <div v-else class="scans-list">
              <ScanListItem
                v-for="scan in recentScans"
                :key="scan.id"
                :scan="scan"
                @click="handleScanClick"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scan Details Modal -->
    <ScanDetailsModal
      :scan="selectedScan"
      :is-open="isModalOpen"
      @close="closeModal"
    />
  </MainLayout>
</template>

<style scoped>
.profile-view {
  padding: var(--spacing-xl) 0;
  min-height: 100vh;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-error-light);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
}

.error-icon {
  font-size: var(--font-size-xl);
}

.stat-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.section {
  margin-bottom: var(--spacing-2xl);
}

.section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.section-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 var(--spacing-sm);
  background: var(--color-primary-light);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: var(--spacing-lg);
}

.empty-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-bottom: 0;
}

.scans-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .stat-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
