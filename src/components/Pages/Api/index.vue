<template>
  <div class="api-index">
    <div class="container-block">
      <header>
        <strong>
          {{ $t('api.api_key') }}
        </strong>
        <router-link :to="`${ROUTER_VERSION}/api/new`">
          <basic-button :text="$t('api.create_New_Key')"></basic-button>
        </router-link>
      </header>
      <div class="api-indexContain marginB30">
        <div class="marginB20">
          <strong>
            {{ $t('api.my_api_key') }}
          </strong>
        </div>
        <div class="marginT15 color999">
          {{ $t('api.key_describe') }}
        </div>
        <div class="api-index-key marginT30" v-if="api.apiData.length !== 0">
          <div class="color666 api-accesskey">
            <strong>
              {{ $t('api.mechanism') }}
            </strong>
            <strong>
              Access Key
            </strong>
          </div>
          <div class="marginT15 api-accesskey" v-for="(data, index) in api.apiData" :key="data.id">
            <span>
              {{ data.label }}
            </span>
            <span>
              {{ data.access_key }}
            </span>
            <span class="api-opreate">
             <span class="link" @click="editApi(data, index)">{{ $t('api.edit') }}</span> <span class="link">|</span> <a @click="marketIndex(data.id, index)" class="link">{{ $t('api.delete') }}</a>
            </span>
          </div>
        </div>
        <div v-if='api.apiData.length === 0 && loading !== true' class="api-norecord">
          {{ $t('my_account.no_record') }}
        </div>
        <div class="marginT30" v-if="loading === true">
          <vue-simple-spinner size="88"></vue-simple-spinner>
        </div>
      </div>
    </div>
    <div class="container-block">
      <header>
        <strong>
          {{ $t('api.application_binding') }}
        </strong>
      </header>
      <div class="api-indexContain marginB30">
        <div class="marginB20">
          <strong>
            {{ $t('api.bind_third_app') }}
          </strong>
        </div>
        <div class="marginT15 color999">
          {{ $t('api.manage_all_app') }}
        </div>
        <div class="api-index-key marginT30" v-if="apiDataa.length !== 0">
          <div class="color666 api-bindapp">
            <strong>
              {{ $t('api.application_name') }}
            </strong>
            <strong>
              {{ $t('api.automatic_expiration_time') }}
            </strong>
            <strong>
              {{ $t('api.entrustment_scope') }}
            </strong>
          </div>
          <div class="marginT15 api-bindapp" v-for="data in apiDataa" :key="data.g">
            <span>
              {{ data.g }}
            </span>
            <span>
              {{ data.key }}
            </span>
            <span>
              {{ data.c }}
            </span>
            <span class="api-opreate">
              <router-link class="link" :to="`${ROUTER_VERSION}/api/edit`">{{ $t('api.edit') }}</router-link> <span class="link">|</span> <a class="link">{{ $t('api.delete') }}</a>
            </span>
          </div>
        </div>
        <div v-else class="api-norecord">
          {{ $t('my_account.no_record') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '@/common/js/bus'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ApiIndex',
  created () {
    this._get({
      url: '/api_tokens.json'
    }, (d) => {
      this.loading = false
      if (d.data.success) this.api.apiData = d.data.success.api_tokens
    })
    bus.$on('Popbox-confirm', () => {
      this.deleteApi(this.apiId, this.apiIndex)
    })
  },
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      apiId: '',
      apiIndex: '',
      loading: true,
      apiDataa: [
        // {
        //   g: 'HotEx',
        //   key: '9999-12-31',
        //   c: 'dwdwwddwwdd'
        // },
        // {
        //   g: 'Weiliang',
        //   key: '0x0BC3dD2E1168774D50c74fCa0f0631C52F4Bd91A',
        //   c: 'dwdwwddwwdd'
        // }
      ]
    }
  },
  methods: {
    marketIndex (id, index) {
      this.apiId = id
      this.apiIndex = index
      this.PopupBoxDisplay({type: 'warn'})
      this.ChangePopupBox({
        message: this.$t('form.news.confirm'),
        confirm: true,
        buttonText: this.$t('hint.no'),
        buttondisplay: true
      })
    },
    editApi (data, index) {
      this.api.editId = data.id
      this.api.editIp = data.ip_whitelist
      this.api.editLabel = data.label
      this.api.editKey = data.access_key
      this.api.editIndex = index
      this.$router.push(`${this.ROUTER_VERSION}/api/edit`)
    },
    deleteApi (id, index) {
      var data = this.api.apiData.slice()
      this.api.apiData = []
      this.loading = true
      this.ChangePopupBox({
        buttonText: ''
      })
      this._delete({
        url: `/api_tokens/${id}.json`
      }, (d) => {
        this.api.apiData = data
        this.loading = false
        if (d.data.success) {
          this.api.apiData.splice(index, 1)
        } else {
          this.PopupBoxDisplay({message: this.$t('hint.server_exception'), type: 'error'})
        }
      })
    },
    ...mapMutations(['PopupBoxDisplay', 'ChangePopupBox'])
  },
  computed: {
    ...mapState(['api'])
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 766px){
  .api-index-key{
    .api-accesskey{
      >:nth-child(2){
        width: 50%!important
      }
    }
    .api-bindapp{
      >:nth-child(2){
        width: 29%!important;
      }
      >:nth-child(3){
        width:  27%!important;
      }
    }
  }
  .api .container-block{
    padding: 13px 10px 0 10px!important;
  }
}

@mixin api-list {
  display: inline-block;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  padding-right: 13px;
}

.api-index{
  .basic-button{
    padding: 5px 9px !important;
    min-width: initial !important;
    float: right;
    margin-top: -6px;
  }
  .api-indexContain{
    .api-index-key{
      font-size: 12px;
      >div{
        &:hover{
          .api-opreate{
            visibility: visible;
            opacity: 1;
          }
        }
        .api-opreate{
          visibility: hidden;
          float: right;
          opacity: 0;
          transition: all .23s;
        }
      }
      .api-accesskey{
        >:first-child{
          @include api-list;
          width: 21%;
        }
        >:nth-child(2){
          @include api-list;
          width: 65%;
        }
      }
      .api-bindapp{
        >:first-child{
          @include api-list;
          width: 21%;
        }
        >:nth-child(2){
          @include api-list;
          width: 44%;
        }
        >:nth-child(3){
          @include api-list;
          width: 20%;
        }
      }
    }
    .api-norecord{
      text-align: center;
      margin: 30px 0;
    }
  }
}
</style>
