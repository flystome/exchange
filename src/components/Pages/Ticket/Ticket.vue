<template>
  <div>
    <header class="btc-ticket-header">
      <div class="btc-ticket-slide">
        <menu-underline
        ref="menu"
        v-model='setp'
        :underline-margin="'16px'"
        :menu-margin="'64px'"
        :menu-list="[$t('ticket.open_tickets'), $t('ticket.closed_tickets')]">
        </menu-underline>
      </div>
      <basic-button class="btc-fr" :text="$t('ticket.new_ticket')"></basic-button>
    </header>
    <template v-if="!loading">
      <div v-if="setp === 0" class="btc-ticket" >
        <div class="btc-ticket-block" v-for="d in xhrData" :key="d.id">
          <section class="btc-fl">
            <header>
              <strong>{{d.subject}}</strong>
              <span class="btc-ticket-time">{{ $moment(d.created_at).format('L H:mm:ss') }}</span>
            </header>
            <article>
              {{ d.message }}
            </article>
          </section>
          <div v-if="d.choice" class="btc-ticket-select">
            <img src="~Img/form-select.png">
          </div>
        </div>
      </div>
      <div v-else class="btc-ticket">
        <div class="btc-ticket-block" v-for="d in xhrDataa" :key="d.id">
          <section class="btc-fl">
            <header>
              <strong>{{d.subject}}</strong>
              <span class="btc-ticket-time">{{ $moment(d.created_at).format('L H:mm:ss') }}</span>
            </header>
            <article>
              {{ d.message }}
            </article>
          </section>
          <div v-if="d.choice" class="btc-ticket-select">
            <img src="~Img/form-select.png">
          </div>
        </div>
      </div>
    </template>
    <!-- <menu-underline
    :menu-list="[$t('ticket.open_tickets'), $t('ticket.closed_tickets')]">
    </menu-underline> -->
  </div>
</template>

<script>
export default {
  name: 'Ticket',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      route: 'closed',
      loading: false,
      setp: 0,
      xhrData: [
        {
          message: '123132',
          id: '123132',
          subject: '123132',
          created_at: 15561654654
        },
        {
          message: '123132',
          id: 'ddw',
          subject: '123132',
          created_at: 15561654654
        }
      ],
      xhrDataa: [
        {
          message: '12313dwadwadadwadadwd2',
          id: '123132',
          subject: '123awdwadadwadwdaaw132',
          created_at: 15561654654
        },
        {
          message: '1231awdwaddawdwada32',
          id: 'ddw',
          subject: '1231bbbb32',
          created_at: 15561654654
        }
      ]
    }
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
@import "./Ticket.scss"
</style>
