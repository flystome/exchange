<template>
  <div @click="promptEmpty" @keyup.enter="Reply" class="btc-ticket-replay">
    <div class="btc-block-container">
      <template v-if="!loading">
        <div class="btc-ticketReplay-header btc-marginB25">
          <basic-button @click.native="goPath(`/ticket/${state}`)" :text="$t('ticket.return')">
          </basic-button>
          <div class="btc-fr" v-if="state === 'open' && !loading">
          <basic-button :disabled='disabled' @click.native="Remind" :text="$t('ticket.reminder')" class="btn btc-marginR25">
          </basic-button>
          <basic-button class="btn" :disabled='disabled' @click.native="CloseTicket" :text="$t('ticket.close_ticket')">
          </basic-button>
          </div>
        </div>
        <div class="btc-ticketReplay-origin">
          <header>
            <strong v-text="title">
            </strong>
            <span v-text="created_at" class="btc-font12 btc-color999 btc-fr">
            </span>
          </header>
          <article v-text="content" class="btc-marginT20 btc-marginB15">
          </article>
          <img v-if="attachment_url" :src="attachment_url">
        </div>
        <div v-if="this.comments.length !== 0" class="btc-ticketReplay-replay btc-font12">
          <div class="btc-ticket-triangle">
            <a></a>
          </div>
          <div class="btc-ticketReplay-block" v-for="(d, index) in comments" :key="d.id">
            <section class="btc-paddingB30" :class="{'btc-ticket-BroderNone': index === comments.length - 1}">
              <header :class="{'btc-ticketReplay-byReplay': d.reply_from_admin}">
                <div>
                  {{d.reply_from_admin ? $t('ticket.customer_service_reply') : $t('ticket.reply_to_customer_service')}} <span v-text="d.content"></span>
                </div>
              </header>
              <img v-if="d.attachment_url" class="btc-marginT15"  :src="d.attachment_url" />
              <div class="btc-marginT15 btc-ticketReplay-byAdmin btc-color999">
                <!-- <div v-if="d.reply_from_admin" class="btc-pointer btc-fl" @click="ShowReply(d)">
                  <i class="ticket-replay">
                  </i>
                  <span class="btc-link">
                    {{ $t('reply') }}
                  </span>
                </div> -->
                <div class="btc-fr">
                  {{ $moment(d.created_at).format('L H:mm:ss') }}
                </div>
              </div>
              <div class="clearfix">
              </div>
            </section>
          </div>
        </div>
      </template>
      <vue-simple-spinner class="btc-marginT100 btc-marginB100" size="88" v-else></vue-simple-spinner>
      <div v-if="!loading && this.state !== 'closed'" class="btc-ticketReplay-textarea btc-marginT15 btc-font12">
        <div class="btc-ticket-flex" style="display:flex">
          {{ $t('ticket.reply_to_customer_service') }}
          <input v-model="context"  type="text" class="btc-marginL10"  v-focus>
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
            <div v-text="FileName">
            </div>
            <i class="btc-ticket-newDelete btc-pointer" @click="DeleteFile"></i>
          </div>
          <basic-button :disabled="disabled" @click.native.stop="Reply" class="btc-fr btn" :text="$t('reply')"></basic-button>
        </div>
        <div class="clearfix"></div>
      </div>
      <news-prompt style="" class="btc-marginL25 btc-fl" :text='prompt'></news-prompt>
    </div>
  </div>
</template>

<script>
import { bus } from '@/common/js/bus'
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  name: 'Ticket',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      comments: '',
      title: '',
      content: '',
      attachment_url: '',
      created_at: '',
      state: '',
      loading: false,
      id: '',
      FileName: '',
      prompt: '',
      context: '',
      ReplyState: true,
      disabled: false
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
          if (!d.success.ticket.has_more_unread) this.loginData.has_unread_tickets = false
          this.state = d.success.ticket.aasm_state
          this.id = d.success.ticket.id
          this.title = d.success.ticket.title
          this.content = d.success.ticket.content
          this.created_at = this.$moment(d.success.ticket.created_at).format('L H:mm:ss')
          this.comments = d.success.ticket.comments
          this.attachment_url = d.success.ticket.attachment_url
          this.$refs['file'] && this.$nextTick(() => {
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
      var fileObject = file ? {
        attachment_file_attributes: {
          file: file
        }
      } : undefined
      var xhrObj = {
        comment: {
          content: this.context
        }
      }
      Object.assign(xhrObj.comment, fileObject)
      var form = this.objectToFormData(xhrObj, new FormData(), '')
      this.disabled = true
      this._post({
        url: `/tickets/${this.id}/comments.json`,
        data: form
      }, (d) => {
        var context = this.context
        this.disabled = false
        if (d.data.success) {
          if (!fileObject) {
            this.comments.push({
              created_at: this.$moment(new Date()).format('L H:mm:ss'),
              content: this.context
            })
          } else {
            var img = new FileReader(file)
            img.readAsDataURL(file)
            img.onload = (data) => {
              var target = data.srcElement ? data.srcElement : data.target
              this.comments.push({
                created_at: this.$moment(new Date()).format('L H:mm:ss'),
                content: context,
                attachment_url: target.result
              })
            }
          }
          this.context = ''
          this.DeleteFile()
          // this.PopupBoxDisplay({message: this.$t(`api_server.ticket.success_200`), type: 'success', url: '/ticket/open'})
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
      this.disabled = true
      this._request({
        method: 'PATCH',
        url: `/tickets/${this.id}/close.json`
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          bus.$emit('ticket-closed', {
            id: this.id,
            title: this.title,
            created_at: this.created_at,
            content: this.content
          })
          this.PopupBoxDisplay({message: this.$t(`api_server.ticket.success_201`), type: 'success', url: '/ticket/open'})
        } else {
          this.PopupBoxDisplay({message: this.$t(`api_server.ticket.error_1003`), type: 'error'})
        }
      })
    },
    goPath (route) {
      if (this.disabled) return
      this.$router.push(`${this.ROUTER_VERSION}${route}`)
    },
    Remind () {
      this.disabled = true
      this._request({
        method: 'PATCH',
        url: `/tickets/${this.id}/remind.json`
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          this.PopupBoxDisplay({message: this.$t(`api_server.ticket.success_203`), type: 'success'})
        } else {
          this.PopupBoxDisplay({message: this.$t(`api_server.ticket.error_1005`), type: 'warn'})
        }
      })
    },
    ...mapMutations(['PopupBoxDisplay'])
  },
  computed: {
    ...mapState(['loginData']),
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
