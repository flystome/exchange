<template>
  <div class="ticket-container">
    <header class="ticket-header">
      <router-link :to="`${ROUTER_VERSION}/ticket/new`">
        <basic-button class="fl ticket-appButton" :text="$t('ticket.new_ticket')"></basic-button>
      </router-link>
      <div class="ticket-slide">
        <keep-alive>
          <menu-underline
          ref="menu"
          :route="'TicketIndex'"
          v-model='setp'
          :menu-index='setp'
          :underline-margin="'16px'"
          :menu-margin="'64px'"
          :menu-list="[$t('ticket.open_tickets'), $t('ticket.closed_tickets')]">
          </menu-underline>
        </keep-alive>
      </div>
      <router-link :to="`${ROUTER_VERSION}/ticket/new`">
        <basic-button class="fr ticket-frbutton" :text="$t('ticket.new_ticket')"></basic-button>
      </router-link>
    </header>
    <template v-if="!loading">
      <div v-if="setp === 0" class="ticket" >
        <div @click="TicketDetails(d)" class="ticket-block pointer" v-for="d in openData" :key="d.id">
          <section class="fl">
            <header>
              <i v-if="d.unread" class="ticket-unread"></i>
              <strong v-text="d.title"></strong>
              <span class="ticket-time">{{ $moment(d.created_at).format('YYYY-MM-DD H:mm:ss') }}</span>
            </header>
            <article v-text="d.content">
            </article>
          </section>
        </div>
      </div>
      <div v-else class="ticket">
        <div @click="TicketDetails(d)" class="ticket-block pointer" v-for="d in closedData" :key="d.id">
          <section class="fl">
            <header>
              <strong v-text="d.title"></strong>
              <span class="ticket-time">{{ $moment(d.created_at).format('YYYY-MM-DD H:mm:ss') }}</span>
            </header>
            <article v-text="d.content">
            </article>
          </section>
        </div>
      </div>
    </template>
    <paginate
      class="fr"
      key='pagination'
      ref="pagination"
      :disabled="disabled"
      v-show="pagination > 1 && route === 'open'"
      :page-count="pagination"
      :page-range="3"
      :margin-pages="1"
      :click-handler="paging"
      :disabled-class='"disabled"'
      :prev-text="`${$t('form.previous')}`"
      :next-text="`${$t('form.next')}`"
      :page-class="'page-item'">
    </paginate>
    <paginate
      class="fr"
      key='pagination1'
      ref="pagination1"
      :disabled="disabled"
      v-show="pagination1 > 1 && route !== 'open'"
      :page-count="pagination1"
      :page-range="3"
      :margin-pages="1"
      :click-handler="paging"
      :disabled-class='"disabled"'
      :prev-text="`${$t('form.previous')}`"
      :next-text="`${$t('form.next')}`"
      :page-class="'page-item'">
    </paginate>
    <div class="text-center paddingT40 paddingB40" style="margin-top:8px;background:white" v-if="!loading && (setp === 0 ? openData.length === 0 : closedData.length === 0)">
      <strong>
        {{ $t('my_account.no_record') }}
      </strong>
    </div>
    <vue-simple-spinner class="marginT100" size="88" v-if="loading"></vue-simple-spinner>
    <!-- <menu-underline
    :menu-list="[$t('ticket.open_tickets'), $t('ticket.closed_tickets')]">
    </menu-underline> -->
  </div>
</template>

<script>
import { bus } from '@/common/js/bus'
export default {
  name: 'TicketIndex',
  created () {
    bus.$on('ticket-create', (d) => {
      if (this.$refs.pagination.selected === 0) {
        this.openData.unshift(d)
        if (this.openData.length === 21) {
          if (this.$refs.pagination.selected === this.pagination - 1) {
            this.pagination++
          }
          this.openData.pop()
        }
      } else {
        this.paging(1)
        this.$refs.pagination.selected = 0
      }
    })
    bus.$on('ticket-closed', (d) => {
      this.openData.forEach((o, index) => {
        if (o.id === d.id) {
          if (this.$refs.pagination.selected !== 0) {
            this.paging(this.$refs.pagination.selected--)
          } else {
            this.paging(1)
          }
        }
      })
      if (!this.closedData) return
      if (this.$refs.pagination1.selected === 0) {
        this.closedData.unshift(d)
        if (this.closedData.length === 21) {
          if (this.$refs.pagination1.selected === this.pagination1 - 1) {
            this.pagination1++
          }
          this.closedData.pop()
        }
      } else {
        this.getTickets(1, 'closed')
        this.$refs.pagination1.selected = 0
      }
    })
    if (/open/.test(this.$route.path)) {
      this.getTickets(1, 'open')
      this.route = 'open'
    } else {
      this.getTickets(1, 'closed')
      this.route = 'closed'
    }
  },
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      route: '',
      loading: false,
      setp: 0,
      openData: '',
      closedData: '',
      disabled: false,
      pagination: 0,
      pagination1: 0
    }
  },
  mounted () {
    if (/closed/.test(this.$route.path)) {
      this.setp = 1
      this.route = 'open'
    } else {
      this.setp = 0
      this.route = 'open'
    }
  },
  methods: {
    paging (num) {
      if (this.disabled) return
      this.getTickets(num, this.route)
    },
    getTickets (num, state) {
      this.disabled = true
      this.loading = true
      this._get({
        url: '/tickets.json',
        data: {
          state: state,
          page: num
        }
      }, (d) => {
        this.disabled = false
        this.loading = false
        d = d.data.success
        if (state === 'open') {
          this.openData = d.tickets
          this.pagination = d.total_pages
        } else {
          this.closedData = d.tickets
          this.pagination1 = d.total_pages
        }
      })
    },
    TicketDetails (d) {
      d.unread = false
      this.$router.push(`${this.ROUTER_VERSION}/ticket?id=${d.id}`)
    }
  },
  watch: {
    setp () {
      if (this.setp === 0) {
        this.$router.push(`${this.ROUTER_VERSION}/ticket/open`)
        this.route = 'open'
      } else {
        this.$router.push(`${this.ROUTER_VERSION}/ticket/closed`)
        this.route = 'closed'
      }
    },
    $route (to, from) {
      // if (from.name !== 'TicketIndex') {
      //   if (/closed/.test(to.path)) {
      //     this.setp = 1
      //   } else {
      //     this.setp = 0
      //   }
      // }
      if (to.name === 'TicketIndex') {
        if (/closed/.test(to.path)) {
          this.setp = 1
          this.route = 'closed'
          if (this.closedData !== '') return
          this.getTickets(1, 'closed')
        } else {
          this.setp = 0
          this.route = 'open'
          if (this.openData !== '') return
          this.getTickets(1, 'open')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./TicketIndex.scss";
.ticket-container nav li {
  font-weight: 700
}
</style>
