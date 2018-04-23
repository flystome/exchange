<template>
  <div @click="promptEmpty" class="btc-ticket-replay">
    <div class="btc-block-container">
      <div class="btc-ticketReplay-header btc-marginB25">
        <router-link :to="`${ROUTER_VERSION}/ticket/open`">
          <basic-button :text="$t('ticket.return')">
          </basic-button>
        </router-link>
        <div class="btc-fr" v-if="state === 'open' && !loading">
        <basic-button :text="$t('ticket.reminder')" class="btc-marginR25">
        </basic-button>
        <basic-button @click.native="CloseTicket" :text="$t('ticket.close_ticket')">
        </basic-button>
        </div>
      </div>
      <template v-if="!loading">
        <div class="btc-ticketReplay-origin">
          <header>
            <strong>
              {{ title }}
            </strong>
            <span class="btc-font12 btc-color999 btc-fr">
              {{ created_at }}
            </span>
          </header>
          <article class="btc-marginT20 btc-marginB15">
            {{ content }}
          </article>
          <img :src="attachment_url">
        </div>
        <div class="btc-ticketReplay-replay btc-font12">
          <div class="btc-ticket-triangle">
            <a></a>
          </div>
          <div class="btc-ticketReplay-block" v-for="d in comments" :key="d.id">
            <section class="btc-paddingB15">
              <header :class="{'btc-ticketReplay-byReplay': d.reply_from_admin}">
                {{d.reply_from_admin ? $t('ticket.customer_service_reply') : $t('ticket.reply_to_customer_service')}} <span v-html="d.content"></span>
              </header>
              <img v-if="d.attachment_url" class="btc-marginT15"  :src="d.attachment_url" />
              <div class="btc-marginT15 btc-ticketReplay-byAdmin">
                <!-- <div v-if="d.reply_from_admin" class="btc-pointer btc-fl" @click="ShowReply(d)">
                  <i class="ticket-replay">
                  </i>
                  <span class="btc-link">
                    {{ $t('reply') }}
                  </span>
                </div> -->
                <div class="btc-fr">
                  {{ $moment(d.create_at).format('L H:mm:ss') }}
                </div>
              </div>
              <div class="clearfix">
              </div>
            </section>
          </div>
        </div>
      </template>
      <vue-simple-spinner class="btc-marginT100" size="88" v-else></vue-simple-spinner>
      <div v-if="!loading" class="btc-ticketReplay-textarea btc-marginT15 btc-font12">
        <div style="display:flex">
          {{ $t('ticket.reply_to_customer_service') }}
          <input v-model="context"  type="text" class="btc-marginL5"  v-focus>
        </div>
        <div class="btc-marginT15" style="position: relative;">
          <span class="btc-link btc-fl">
            <a>
              <i class="ticket-upload"></i>
              {{ $t('ticket.upload_photo') }}
            </a>
            <input type="file" ref='file' @change="AddFile">
          </span>
          <div class="btc-fl btc-ticket-delte" v-if="FileName !== ''">
            <div>
              {{ FileName }}
            </div>
            <i class="btc-ticket-newDelete btc-pointer" @click="DeleteFile"></i>
          </div>
          <news-prompt style="" class="btc-marginL25 btc-fl" :text='prompt'></news-prompt>
          <basic-button @click.native.stop="Reply" class="btc-fr" :text="$t('reply')"></basic-button>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Ticket',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      comments: '',
      title: '',
      content: '',
      attachment_url: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1524471843940&di=3dcf56289ef207e6a30be0037cfa1815&imgtype=0&src=http%3A%2F%2Fwww.zxin.net.cn%2FProduct%2FProductIntroPic%2F20154%2F130746649034475698.jpg",
      created_at: '',
      state: '',
      loading: false,
      id: '',
      FileName: '',
      prompt: '',
      context: '',
      ReplyState: true
    }
  },
  created () {
    this.GetComments(this.$route.query.id)
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    GetComments (id) {
      this.loading = true
      this._get({
        url: `/tickets/${id}.json`
      }, (d) => {
        d = d.data
        if (d.success) {
          this.loading = false
          d.success.ticket.comments.forEach((data) => {
            data.ReplyState = false
          })
          this.state = d.success.ticket.aasm_state
          this.id = d.success.ticket.id
          // this.attachment_url = d.success.ticket.attachment_url
          this.title = d.success.ticket.title
          this.content = d.success.ticket.content
          this.created_at = this.$moment(d.success.ticket.created_at).format('L H:mm:ss')
          this.comments = d.success.ticket.comments
          this.comments[0].attachment_url = this.attachment_url
          this.$nextTick(() => {
            this.$refs['file'].scrollIntoView({behavior: 'smooth', block: 'start'})
          })
        } else {
          this.$router.push(`${this.ROUTER_VERSION}/404`)
        }
      })
    },
    DeleteFile () {
      this.$refs['file'].value = ''
      this.FileName = ''
    },
    // ShowReply (d) {
    //   var state = d.ReplyState
    //   this.comments.forEach((d) => {
    //     d.ReplyState = false
    //   })
    //   this.context = ''
    //   d.ReplyState = !state
    // },
    promptEmpty () {
      this.prompt = ''
    },
    Reply () {
      var file = this.$refs['file'].files[0]
      if (this.context === '') {
        this.prompt = this.$t('ticket.reply_can_not_be_empty')
        return
      }
      var form = this.objectToFormData({
        comment: {
          content: this.context,
          attachment_file_attributes: {
            file: file
          }
        }
      }, new FormData(), '')
      this._post({
        url: `/tickets/${this.id}/comments.json`,
        data: form
      }, (d) => {
        console.log(d)
        if (d.data.success) {

        } else {
          this.PopupBoxDisplay({message: this.$t(`api_server.ticket.error_${d.data.error.code}`), type: 'error'})
        }
      })
    },
    AddFile (el) {
      if (el.target.files.length === 0) {
        this.FileName = ''
        return
      }
      if (el.target.files[0].size > 1 * 1024 * 1024) {
        this.prompt = `${this.$t('validate_identity.img_to_big')}1M`
        this.FileName = ''
        this.$refs.file.value = ''
      } else {
        var FileRead = new FileReader()
        FileRead.readAsDataURL(el.target.files[0])
        FileRead.onload = (d) => {
          this.FileName = this.$refs['file'].files[0].name
        }
      }
    },
    CloseTicket () {
      this._request({
        method: 'PATCH',
        url: `/tickets/${this.id}/close.json`
      }, (d) => {
        if (d.data.success) {

        } else {
          this.PopupBoxDisplay({message: this.$t(`api_server.ticket.error_1003`), type: 'error'})
        }
      })
    },
    ...mapMutations(['PopupBoxDisplay'])
  },
  computed: {
    ...mapGetters(['objectToFormData'])
  },
  watch: {
    $route (to, from) {
      if (to.name === 'Ticket') {
        this.GetComments(to.query.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './Ticket.scss'
</style>
