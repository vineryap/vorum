<template>
  <div class="forum-stats desktop-only">
    <hr />
    <ul>
      <li><i class="fa fa-user-circle-o"></i>47 users online</li>
      <!-- <li>
        <i class="fa fa-user-o"></i>{{ totalRegisteredUsers }}
        {{ formatNoun(totalRegisteredUsers, 'user', 'users') }} registered
      </li>
      <li>
        <i class="fa fa-comments-o"></i>{{ totalThreads }}
        {{ formatNoun(totalThreads, 'thread', 'threads') }}
      </li>
      <li>
        <i class="fa fa-comment-o"></i>{{ totalPosts }}
        {{ formatNoun(totalPosts, 'post', 'posts') }}
      </li> -->
    </ul>
  </div>
</template>

<script>
import { formatNoun } from '@/helpers'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      totalPosts: 'totalPosts',
      totalThreads: 'totalThreads',
      totalRegisteredUsers: 'totalUsers'
    })
  },
  methods: {
    formatNoun
  }
}
</script>

<style>
</style>
