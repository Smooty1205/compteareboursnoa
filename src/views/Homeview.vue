<template>
  <main class="container">
    <h1>Calendrier d’alternance</h1>

    <section class="statut">
      <p>Pour le moment, Noa est en <strong>{{ statutActuel }}</strong> !</p>
    </section>

    <section class="compte-a-rebours" v-if="prochainChangement">
      <p>Il changera le <strong>{{ prochainChangement.format('DD/MM/YYYY') }}</strong></p>
      <p>dans précisément <span class="countdown">{{ countdown }}</span></p>
    </section>

    <section v-else>
      <p>Aucun changement à venir 🎉</p>
    </section>

    <section v-if="statutActuel === 'école'">
      <img :src="studyVideo" alt="studying" width="300px" />
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useCalendrierStore } from '../stores/calendrierStore.js'
import studyVideo from '../assets/study.gif'

dayjs.extend(duration)

const store = useCalendrierStore()
const statutActuel = computed(() => store.statutActuel)
const prochainChangement = computed(() => store.prochainChangement)
const countdown = ref('')

function updateCountdown() {
  if (!prochainChangement.value) {
    countdown.value = '—'
    return
  }

  const maintenant = dayjs()
  const diffMs = prochainChangement.value.diff(maintenant)
  const duree = dayjs.duration(diffMs)

  const jours = Math.floor(duree.asDays())
  const heures = duree.hours()
  const minutes = duree.minutes()
  const secondes = duree.seconds()

  countdown.value = `${jours} jours, ${heures} heures, ${minutes} minutes et ${secondes} secondes`
}

let intervalId

onMounted(() => {
  updateCountdown()
  intervalId = setInterval(updateCountdown, 1000)
})

onUnmounted(() => clearInterval(intervalId))
</script>

<style scoped>
/* Container général */
.container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  background-color: #fefefe;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Titre principal */
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

/* Section statut */
.statut {
  margin: 20px 0;
  font-size: 1.2rem;
  color: #555;
}

/* Section compte à rebours */
.compte-a-rebours {
  margin-top: 20px;
  padding: 15px;
  background-color: #e3f2fd;
  border-radius: 8px;
  font-size: 1.1rem;
  color: #0d47a1;
}

.countdown {
  font-weight: bold;
  font-size: 1.3rem;
  color: #d32f2f;
}
</style>
