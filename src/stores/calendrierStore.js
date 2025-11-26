import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export const useCalendrierStore = defineStore('calendrier', {
  state: () => ({
    calendrier: [
      { debut: '2025-09-02', fin: '2025-10-12', type: 'école' },
      { debut: '2025-10-13', fin: '2025-11-09', type: 'entreprise' },
      { debut: '2025-11-10', fin: '2025-11-10', type: 'école' },
      { debut: '2025-11-11', fin: '2025-11-11', type: 'repos' },
      { debut: '2025-11-12', fin: '2025-12-14', type: 'école' },
      { debut: '2025-12-15', fin: '2025-12-24', type: 'entreprise' },
      { debut: '2025-12-25', fin: '2025-12-26', type: 'repos' },
      { debut: '2025-12-27', fin: '2025-12-31', type: 'entreprise' },
      { debut: '2026-01-01', fin: '2026-01-02', type: 'repos' },
      { debut: '2026-01-03', fin: '2026-01-18', type: 'entreprise' },
      { debut: '2026-01-19', fin: '2026-02-22', type: 'école' },
      { debut: '2026-02-23', fin: '2026-06-21', type: 'entreprise' },
    ],
  }),

  getters: {
    /**
     * Retourne la période en cours selon la date du jour
     */
    periodeActuelle: (state) => {
      const maintenant = dayjs()
      return state.calendrier.find(
        (periode) =>
          maintenant.isSameOrAfter(periode.debut, 'day') &&
          maintenant.isSameOrBefore(periode.fin, 'day')
      )
    },

    /**
     * Retourne le type de période actuelle (école, entreprise, repos)
     */
    statutActuel: (state) => {
      const maintenant = dayjs()
      const periode = state.calendrier.find(
        (p) =>
          maintenant.isSameOrAfter(p.debut, 'day') &&
          maintenant.isSameOrBefore(p.fin, 'day')
      )
      return periode ? periode.type : 'repos' // par défaut "repos"
    },

    /**
     * Retourne la date du prochain changement de période
     */
    prochainChangement: (state) => {
      const maintenant = dayjs()
      // trouve la première période à venir
      const prochaine = state.calendrier.find((p) =>
        maintenant.isBefore(p.debut, 'day')
      )
      return prochaine ? dayjs(prochaine.debut) : null
    },
  },

  actions: {
    /**
     * Permet d'ajouter une nouvelle période dynamiquement
     */
    ajouterPeriode(periode) {
      this.calendrier.push(periode)
      // Trie par date de début pour garder un calendrier propre
      this.calendrier.sort(
        (a, b) => new Date(a.debut).getTime() - new Date(b.debut).getTime()
      )
    },
  },
})
