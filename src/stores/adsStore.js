import { defineStore } from 'pinia'

export const useAdsStore = defineStore('ads', {
  state: () => ({
    ads: [],
    filteredAds: []
  }),

  actions: {
    addAd (ad) {
      const index = this.ads.findIndex(a => a.id === ad.id)
      if (index !== -1) {
        this.ads[index] = ad
      } else {
        this.ads.push({
          id: this.ads.length + 1,
          ...ad
        })
      }
    },

    updateAd (id, updatedAd) {
      const index = this.ads.findIndex(ad => ad.id === id)
      if (index !== -1) {
        this.ads[index] = { ...this.ads[index], ...updatedAd }
      }
    },

    filterAds (title) {
      if (!title) {
        this.filteredAds = this.ads
      } else {
        this.filteredAds = this.ads.filter(ad => ad.title.includes(title))
      }
    }
  },

  getters: {
    getAds: (state) => state.filteredAds.length > 0 ? state.filteredAds : state.ads
  }
})
