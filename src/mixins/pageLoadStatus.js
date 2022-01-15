export default {
  data () {
    return {
      pageLoadStatus_pageReady: false
    }
  },
  methods: {
    pageLoadStatus_pageLoaded () {
      this.pageLoadStatus_pageReady = true
      this.$emit('pageReady')
    }
  }
}
