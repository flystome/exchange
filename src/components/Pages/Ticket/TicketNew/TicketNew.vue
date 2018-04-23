<template>
  <div @click="promptEmpty" class="btc-ticket-new">
    <div class="btc-container-block">
      <header>
        <strong>
          {{ $t('title.ticket_new') }}
        </strong>
      </header>
      <div>
        <div class="btc-color999">
          {{ $t('ticket.ticket_describe') }}
        </div>
        <div class="btc-ticket-from">
        <news-prompt style="display: block;margin-left:0;top: -10px;" class="btc-marginL25" :text='prompt'></news-prompt>
          <basic-input v-model="newTicket.label" :placeholder="$t('api.label')">
          </basic-input>
          <div-contenteditable class="btc-marginT15 btc-ticket-editDiv" v-model="newTicket.details" :placeholder="$t('ticket.detailed_description')">
            <span slot="placeholder">{{ $t('ticket.detailed_description') }}</span>
          </div-contenteditable>
          <div class="btc-ticket-flex btc-marginT15">
            <basic-input readonly="readonly">
              <basic-button :disabled='disabled' @click.native="upload" class="btc-link btn" slot="button" :text="$t('ticket.choose')">
                <input type="file" @change="addFile" ref="file" accept="image/jpeg,image/jpg" slot="file" slot-scope="props">
              </basic-button>
            </basic-input>
            <div class="btc-ticket-files">
              <span>
                {{ $t('ticket.upload_attachment') }}
              </span>
              <div v-if="FileName !== ''">
                <div>
                  {{ this.FileName }}
                </div>
                <i class="btc-ticket-newDelete" @click="DeleteFile"></i>
              </div>
            </div>
          </div>
          <div class="btc-ticket-explain btc-color999">
            {{ $t('ticket.upload_describe') }}
          </div>
          <div class="btc-ticket-explain btc-color999 btc-paddingB45">
            <basic-button :disabled='disabled' @click.native="sumbit" class="btn" :text="$t('submit')"></basic-button>
            <router-link :to="`${ROUTER_VERSION}/ticket`">
              <button class="btc-white-btn">{{ $t('cancel') }}</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'TicketNew',
  data () {
    return {
      newTicket: {
        label: '',
        details: '',
        attachment: ''
      },
      File: '',
      FileName: '',
      prompt: '',
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      disabled: false
    }
  },
  methods: {
    DeleteFile () {
      this.$refs['file'].value = ''
      this.File = ''
      this.FileName = ''
    },
    upload () {},
    promptEmpty () {
      this.prompt = ''
      this.File = ''
    },
    addFile (el) {
      if (el.target.files.length === 0) {
        this.File = ''
        this.FileName = ''
        return
      }
      if (el.target.files[0].size > 1 * 1024 * 1024) {
        this.prompt = `${this.$t('validate_identity.img_to_big')}1M`
        this.File = ''
        this.FileName = ''
        this.$refs.file.value = ''
      } else {
        var FileRead = new FileReader()
        FileRead.readAsDataURL(el.target.files[0])
        FileRead.onload = (d) => {
          this.FileName = this.$refs['file'].files[0].name
          this.File = this.$refs['file'].files[0]
        }
      }
    },
    sumbit () {
      var file = this.$refs['file'].files[0]
      var form = this.objectToFormData({
        ticket: {
          title: this.newTicket.label,
          content: this.newTicket.details,
          attachment_file_attributes: {
            file: file
          }
        }
      }, new FormData(), '')
      this._post({
        url: '/tickets.json',
        data: form
      }, (d) => {
        if (d.data.success) {

        } else {
          this.po({message: this.$t('ticket')})
        }
      })
    },
    ...mapMutations(['PopupBoxDisplay'])
  },
  computed: {
    ...mapGetters(['objectToFormData'])
  }
}
</script>

<style lang="scss" scoped>
@import './TicketNew.scss'
</style>

<style lang='css'>
  .btc-ticket-new .edit-div{
    background: #f2f2f2;
    min-height: 200px;
    padding: 10px 8px;
    overflow: auto;
    max-height: 300px;
    border: 1px solid #dfe0e1;
  }
</style>
