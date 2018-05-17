<template>
  <div>
    <div class="btc-hint">
      <transition name="hint">
        <template v-if="b">
                  <div  class="text-center btc-hint-middle btc-paddingR30 btc-paddingL30">
          <div style="magin:auto 0">
            <i v-if="PopupBox.type === 'success' " class="Hint-success btc-marginT55 btc-marginB35" />
            <i v-else-if="PopupBox.type === 'warn'" class="Hint-warn btc-marginT55 btc-marginB35" />
            <self-building-square-spinner
            v-else-if="PopupBox.type === 'loading'"
            class="btc-marginT55 btc-marginB35 btc-hint-loading"
            :animation-duration="6000"
            :size="45"
            color="#3e81ff"
            />
            <i v-else class="Hint-error btc-marginT55 btc-marginB35" />
          </div>
          <div>
            {{this.PopupBox.message}}
          </div>
          <div class="btc-paddingB30">
            <span style="display:flex">
              <basic-button @click.native.stop="confirm" style="margin-right: 28px;" v-if='PopupBox.confirm'  class="btn btc-marginT50"  :text='$t(`hint.yes`)' :class="{'btc-hint-hidden': !this.PopupBox.buttondisplay}">
              </basic-button>
              <basic-button @click.native.stop="gopath"  class="btn btc-marginT50"  :text='buttonText' :class="{'btc-hint-hidden': !this.PopupBox.buttondisplay}">
              </basic-button>
            </span>
          </div>
        </div>
        </template>
      </transition>
    </div>
  </div>
</template>

<script>
import { bus } from '@/common/js/bus'
import { SelfBuildingSquareSpinner } from 'epic-spinners'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Hint',
  created () {
    setTimeout(() => {
      this.b = true
    }, 6)
  },
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      HOST_URL: process.env.HOST_URL,
      b: false
    }
  },
  methods: {
    confirm () {
      if (this.PopupBox.href) {
        this.$router.push(`${this.ROUTER_VERSION}${this.PopupBox.href}`)
        this.ChangePopupBox({
          href: '',
          status: false
        })
      } else {
        bus.$emit('Popbox-confirm')
        this.ChangePopupBox({
          status: false,
          confirm: false,
          buttonText: ''
        })
      }
    },
    gopath (href) {
      this.b = false
      setTimeout(() => {
        this.ChangePopupBox({
          confirm: false,
          buttonText: ''
        })
        if (this.PopupBox.url) {
          this.$router.replace(`${this.ROUTER_VERSION}${this.PopupBox.url}`)
        }
        this.ChangePopupBox({
          status: false
        })
      }, 50)
    },
    ...mapMutations(['PopupBoxDisplay', 'ChangePopupBox'])
  },
  computed: {
    buttonText () {
      return this.PopupBox.buttonText ? this.PopupBox.buttonText : this.$t('hint.confirm')
    },
    ...mapState(['PopupBox'])
  },
  components: {
    SelfBuildingSquareSpinner
  }
}
</script>

<style lang="scss" scoped>
@-webkit-keyframes swal2-show {
  0% {
    -webkit-transform: scale(0.7);
    transform: scale(0.7)
  }
  45% {
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
  }
  80% {
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.btc-hint{
  margin-top: 203px;
  z-index: 3;
  .btc-hint-middle{
    transition: all 0.23s;
    background: #ffffff;
    position: relative;
    width: 360px;
    margin: 0 auto;
    box-shadow:0 0 30px #bbbbbb;
    z-index: 99999;
  }
  .btc-hint-hidden{
    visibility: hidden;
  }
  button{
    width: 100%;
  }
  .btc-hint-loading{
    margin: 0 auto;
    margin-bottom: 78px;
    top: 45px!important;
    position: relative;
  }
}

// sprites
$sprite: (
  'warn': $hint-warn,
  'success': $hint-success,
  'error': $hint-error,
);

@each $key, $val in $sprite{
  .Hint-#{$key} {
    @include sprite(map-get($sprite, $key));
    display: inline-block;
  }
}

.hint-enter, .hint-leave-to {
  transform: scale(0);
}
</style>
