<template>
  <span :title="fullDateFormat">
    {{ relativeTimeFormat }}
  </span>
</template>

<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export default {
  props: {
    timestamp: {
      type: [Number, Object],
      required: true
    }
  },
  computed: {
    seconds () {
      return this.timestamp?.seconds || this.timestamp
    },
    relativeTimeFormat () {
      return dayjs.unix(this.seconds).fromNow()
    },
    fullDateFormat () {
      return dayjs.unix(this.seconds).format('llll')
    }
  }
}
</script>

<style>
</style>
