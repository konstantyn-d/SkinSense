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
            <span class="error-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8.44971V12.4497M7.33173 3.9375L3.9375 7.33173L3.93442 7.33462C3.59057 7.67847 3.41824 7.85081 3.29492 8.05204C3.18526 8.23098 3.10425 8.4263 3.05526 8.63037C3 8.86055 3 9.10506 3 9.59424V14.4058C3 14.8949 3 15.1395 3.05526 15.3697C3.10425 15.5738 3.18526 15.7688 3.29492 15.9478C3.41857 16.1495 3.59182 16.3228 3.9375 16.6685L7.33173 20.0627C7.67763 20.4086 7.85021 20.5812 8.05204 20.7048C8.23099 20.8145 8.42581 20.8958 8.62988 20.9448C8.85971 21 9.10382 21 9.59151 21H14.4075C14.8952 21 15.1404 21 15.3702 20.9448C15.5743 20.8958 15.7693 20.8145 15.9482 20.7049C16.1501 20.5812 16.323 20.4086 16.6689 20.0627L20.0632 16.6685C20.4091 16.3226 20.5817 16.1496 20.7053 15.9478C20.815 15.7688 20.8953 15.5738 20.9443 15.3697C20.9996 15.1395 21 14.895 21 14.4058V9.59424C21 9.10506 20.9996 8.86055 20.9443 8.63037C20.8953 8.4263 20.815 8.23099 20.7053 8.05205C20.5817 7.85022 20.4091 7.67761 20.0632 7.33173L16.6689 3.9375C16.3233 3.59181 16.15 3.41857 15.9482 3.29492C15.7693 3.18526 15.5743 3.10425 15.3702 3.05526C15.14 3 14.8945 3 14.4053 3H9.59375C9.10457 3 8.86006 3 8.62988 3.05526C8.42581 3.10425 8.23099 3.18526 8.05204 3.29492C7.85204 3.41748 7.68106 3.58847 7.3414 3.92813L7.33173 3.9375ZM12.0498 15.4497V15.5497L11.9502 15.5499V15.4497H12.0498Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
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
              <div class="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 7.69431C10 2.99988 3 3.49988 3 9.49991C3 15.4999 12 20.5001 12 20.5001C12 20.5001 21 15.4999 21 9.49991C21 3.49988 14 2.99988 12 7.69431Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="stat-card-label">Avg Health Score</div>
              <div class="stat-card-value">{{ averageHealthScore }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11V20M9 11H4.59961C4.03956 11 3.75981 11 3.5459 11.109C3.35774 11.2049 3.20487 11.3577 3.10899 11.5459C3 11.7598 3 12.04 3 12.6001V20H9M9 11V5.6001C9 5.04004 9 4.75981 9.10899 4.5459C9.20487 4.35774 9.35774 4.20487 9.5459 4.10899C9.75981 4 10.0396 4 10.5996 4H13.3996C13.9597 4 14.2403 4 14.4542 4.10899C14.6423 4.20487 14.7948 4.35774 14.8906 4.5459C14.9996 4.75981 15 5.04005 15 5.6001V8M9 20H15M15 20L21 20.0001V9.6001C21 9.04005 20.9996 8.75981 20.8906 8.5459C20.7948 8.35774 20.6429 8.20487 20.4548 8.10899C20.2409 8 19.9601 8 19.4 8H15M15 20V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="stat-card-label">Total Scans</div>
              <div class="stat-card-value">{{ totalScans }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.0005 7L14.1543 12.9375C14.0493 13.0441 13.9962 13.0976 13.9492 13.1396C13.1899 13.8193 12.0416 13.8193 11.2822 13.1396C11.2352 13.0976 11.1817 13.0442 11.0767 12.9375C10.9716 12.8308 10.9191 12.7774 10.8721 12.7354C10.1127 12.0557 8.96397 12.0557 8.20461 12.7354C8.15771 12.7773 8.10532 12.8305 8.00078 12.9367L4 17M20.0005 7L20 13M20.0005 7H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
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
              <div class="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.48898 7H6.2002C5.08009 7 4.51962 7 4.0918 7.21799C3.71547 7.40973 3.40973 7.71547 3.21799 8.0918C3 8.51962 3 9.08009 3 10.2002V15.8002C3 16.9203 3 17.4796 3.21799 17.9074C3.40973 18.2837 3.71547 18.5905 4.0918 18.7822C4.5192 19 5.07899 19 6.19691 19H17.8031C18.921 19 19.48 19 19.9074 18.7822C20.2837 18.5905 20.5905 18.2837 20.7822 17.9074C21 17.48 21 16.921 21 15.8031V10.1969C21 9.07899 21 8.5192 20.7822 8.0918C20.5905 7.71547 20.2837 7.40973 19.9074 7.21799C19.4796 7 18.9203 7 17.8002 7H14.5108M9.48898 7H9.55078M9.48898 7C9.50151 7.00001 9.51468 7 9.52857 7L9.55078 7M9.48898 7C9.38286 6.99995 9.32339 6.99941 9.27637 6.99414C8.68878 6.92835 8.28578 6.36908 8.40918 5.79084C8.42066 5.73703 8.44336 5.66894 8.4883 5.53412L8.49023 5.52841C8.54156 5.37443 8.56723 5.29743 8.59558 5.22949C8.88586 4.53389 9.54322 4.06083 10.2949 4.00541C10.3683 4 10.449 4 10.6113 4H13.3886C13.5509 4 13.6322 4 13.7057 4.00541C14.4574 4.06083 15.114 4.53389 15.4043 5.22949C15.4326 5.29743 15.4584 5.37434 15.5098 5.52832C15.556 5.66699 15.5791 5.73636 15.5908 5.79093C15.7142 6.36917 15.3118 6.92835 14.7242 6.99414C14.6772 6.99941 14.6171 6.99995 14.5108 7M9.55078 7H14.449M14.449 7H14.5108M14.449 7L14.4712 7C14.4851 7 14.4983 7.00001 14.5108 7M12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13C15 14.6569 13.6569 16 12 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon svg {
  width: 24px;
  height: 24px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary-main);
}

.empty-icon svg {
  width: 80px;
  height: 80px;
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
