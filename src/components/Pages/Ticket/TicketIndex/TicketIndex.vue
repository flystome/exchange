<template>
  <div class="btc-ticket-container">
    <header class="btc-ticket-header">
      <router-link :to="`${ROUTER_VERSION}/ticket/new`">
        <basic-button class="btc-fl btc-ticket-appButton" :text="$t('ticket.new_ticket')"></basic-button>
      </router-link>
      <div class="btc-ticket-slide">
        <menu-underline
        ref="menu"
        v-model='setp'
        :menu-index='setp'
        :underline-margin="'16px'"
        :menu-margin="'64px'"
        :menu-list="[$t('ticket.open_tickets'), $t('ticket.closed_tickets')]">
        </menu-underline>
      </div>
      <router-link :to="`${ROUTER_VERSION}/ticket/new`">
        <basic-button class="btc-fr" :text="$t('ticket.new_ticket')"></basic-button>
      </router-link>
    </header>
    <template v-if="!loading">
      <div v-if="setp === 0" class="btc-ticket" >
        <div @click="TicketDetails(d.id)" class="btc-ticket-block btc-pointer" v-for="d in openData" :key="d.id">
          <section class="btc-fl">
            <header>
              <strong>{{d.title}}</strong>
              <span class="btc-ticket-time">{{ $moment(d.created_at).format('L H:mm:ss') }}</span>
            </header>
            <article>
              {{ d.content }}
            </article>
          </section>
          <div v-if="d.choice" class="btc-ticket-select">
            <img src="~Img/form-select.png">
          </div>
        </div>
      </div>
      <div v-else class="btc-ticket">
        <div @click="TicketDetails(d.id)" class="btc-ticket-block btc-pointer" v-for="d in closedData" :key="d.id">
          <section class="btc-fl">
            <header>
              <strong>{{d.title}}</strong>
              <span class="btc-ticket-time">{{ $moment(d.created_at).format('L H:mm:ss') }}</span>
            </header>
            <article>
              {{ d.content }}
            </article>
          </section>
          <div v-if="d.choice" class="btc-ticket-select">
            <img src="~Img/form-select.png">
          </div>
        </div>
      </div>
    </template>
    <div class="text-center btc-marginT15 btc-paddingT50 btc-paddingB50" style="background:white" v-if="!loading && (setp === 0 ? openData.length === 0 : closedData.length === 0)">
      <strong>
        {{ $t('my_account.no_record') }}
      </strong>
    </div>
    <vue-simple-spinner class="btc-marginT100" size="88" v-if="loading"></vue-simple-spinner>
    <!-- <menu-underline
    :menu-list="[$t('ticket.open_tickets'), $t('ticket.closed_tickets')]">
    </menu-underline> -->
  </div>
</template>

<script>
export default {
  name: 'TicketIndex',
  created () {
    if (/open/.test(this.$route.path)) {
      this.getTickets(1, 'open')
    } else {
      this.getTickets(1, 'closed')
    }
  },
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      route: 'closed',
      loading: false,
      setp: 0,
      openData: '',
      closedData: ''
    }
  },
  mounted () {
    if (/closed/.test(this.$route.path)) {
      this.setp = 1
    } else {
      this.setp = 0
    }
  },
  methods: {
    getTickets (num, state) {
      this.loading = true
      this._get({
        url: '/tickets.json',
        data: {
          state: state,
          page: num
        }
      }, (d) => {
        this.loading = false
        d = d.data.success
        if (state === 'open') {
          this.openData = d.tickets
        } else {
          this.closedData = d.tickets
        }
      })
    },
    TicketDetails (id) {
      this.$router.push(`${this.ROUTER_VERSION}/ticket?id=${id}`)
    }
  },
  watch: {
    setp () {
      this.setp === 0 ? this.$router.push(`${this.ROUTER_VERSION}/ticket/open`) : this.$router.push(`${this.ROUTER_VERSION}/ticket/closed`)
    },
    $route (to, from) {
      if (from.name !== 'TicketIndex') {
        this.setp = 0
      }
      if (/closed/.test(to.path)) {
        if (this.closedData !== '') return
        this.getTickets(1, 'closed')
      } else {
        if (this.openData !== '') return
        this.getTickets(1, 'open')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./TicketIndex.scss"
</style>

<style lang="css">
.btc-ticket-container nav li {
  font-weight: 700
}
</style>
