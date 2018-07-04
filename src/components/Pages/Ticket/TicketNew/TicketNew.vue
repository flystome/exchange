<template>
  <div @keyup.enter="sumbit" @click="promptEmpty" class="ticket-new">
    <div class="container-block">
      <header>
        <strong>
          {{ $t('title.ticket_new') }}
        </strong>
      </header>
      <div>
        <div class="color999">
          {{ $t('ticket.ticket_describe') }}
        </div>
        <div class="ticket-from">
        <news-prompt style="display: block;margin-left:0;top: -10px;" class="marginL25" :text='prompt'></news-prompt>
          <basic-input v-model="newTicket.label" :placeholder="$t('ticket.title')">
          </basic-input>
          <div-contenteditable class="marginT15 ticket-editDiv" @keyup.enter.stop.native  v-model="newTicket.details" :placeholder="$t('ticket.detailed_description')">
            <span slot="placeholder">{{ $t('ticket.detailed_description') }}</span>
          </div-contenteditable>
          <div class="ticket-flex marginT15">
            <basic-input readonly="readonly">
              <basic-button :disabled='disabled' @click.native="$refs['file'].click()" class="link btn" slot="button" :text="$t('ticket.choose')">
                <!-- <input type="file" @change="addFile" ref="file" accept="image/jpeg,image/jpg" slot="file" slot-scope="props"> -->
              </basic-button>
            </basic-input>
            <input type="file" @change="addFile" ref="file" accept="image/jpeg,image/jpg" />
            <div class="ticket-files">
              <span>
                {{ $t('ticket.upload_attachment') }}
              </span>
              <div v-if="FileName !== ''">
                <div>
                  {{ this.FileName }}
                </div>
                <i class="ticket-newDelete" @click="DeleteFile"></i>
              </div>
            </div>
          </div>
          <div class="ticket-explain color999">
            {{ $t('ticket.upload_describe') }}
          </div>
          <div class="ticket-explain color999 paddingB45">
            <basic-button :disabled='disabled' @click.native.stop="sumbit" class="btn" :text="$t('submit')"></basic-button>
            <button @click="goTicket" class="white-btn">{{ $t('cancel') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '@/common/js/bus'
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
    goTicket () {
      if (this.disabled) return
      this.$router.push(`${this.ROUTER_VERSION}/ticket`)
    },
    sumbit () {
      if (this.disabled) return
      if (!(this.newTicket.label || this.newTicket.details)) {
        this.prompt = this.$t('ticket.no_empty')
        return
      }
      this.disabled = true
      var file = this.$refs['file'].files
      var fileObject = file[0] ? {
        attachment_file_attributes: {
          file: file[0]
        }
      } : undefined
      var xhrObj = {
        ticket: {
          title: this.newTicket.label,
          content: this.newTicket.details
        }
      }
      Object.assign(xhrObj.ticket, fileObject)
      var form = this.objectToFormData(xhrObj, new FormData(), '')
      this.prompt = ''
      this._post({
        url: '/tickets.json',
        data: form
      }, (d) => {
        this.disabled = false
        if (d.data.success) {
          this.$refs['file'].value = ''
          this.FileName = ''
          Object.assign(this.newTicket, {
            label: '',
            details: ''
          })
          bus.$emit('ticket-create', d.data.success.ticket)
          this.PopupBoxDisplay({message: this.$t(`api_server.ticket.success_200`), type: 'success', url: '/ticket/open'})
        } else {
          this.PopupBoxDisplay({message: this.$t('api_server.ticket.error_1004')})
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
  .ticket-new .edit-div{
    background: #f2f2f2;
    min-height: 200px;
    padding: 10px 8px;
    overflow: auto;
    max-height: 300px;
    border: 1px solid #dfe0e1;
  }
</style>
