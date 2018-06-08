<template>
  <div>
    <div class="btc-hint">
      <transition name="hint">
        <template v-if="tick">
          <div  :class="{'btc-hint-large': PopupBox.largeWidth}" class="text-center btc-hint-middle">
            <div>
              <i v-if="PopupBox.type === 'success' " class="Hint-success" />
              <i v-else-if="PopupBox.type === 'warn'" class="Hint-warn" />
              <self-building-square-spinner
              v-else-if="PopupBox.type === 'loading'"
              class="btc-hint-loading"
              :animation-duration="6000"
              :size="45"
              color="#3e81ff"
              />
              <i v-else class="Hint-error" />
            </div>
          <div v-html="PopupBox.message" style="padding-left:35px;padding-right:35px;margin-top: 15px;" :class="{'btc-paddingB45': !this.PopupBox.buttondisplay}">
          </div>
          <div v-if="this.PopupBox.buttondisplay" class="btc-hint-confirm">
            <span style="display:flex">
              <basic-button @click.native.stop="confirm" v-if='PopupBox.confirm'  class="btn"  :text='$t(`hint.yes`)'>
              </basic-button>
              <basic-button @click.native.stop="gopath" class="btn"  :text='buttonText' :class="{'btc-background-999': PopupBox.confirm}">
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
      this.tick = true
    }, 6)
  },
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION,
      HOST_URL: process.env.HOST_URL,
      tick: false
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
      this.tick = false
      setTimeout(() => {
        this.ChangePopupBox({
          confirm: false,
          buttonText: '',
          largeWidth: false
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
    transform: scale(.7)
  }
  45% {
    transform: scale(1.05);
  }
  80% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}
.btc-hint{
  margin-top: 203px;
  z-index: 3;
  .btc-hint-confirm{
    position: relative;
    bottom: -1px;
    .btc-basic-button{
      margin-top: 30px;
      outline: none;
    }
  }
  .btc-hint-middle{
    transition: all .4;
    background: #ffffff;
    position: relative;
    min-width: 264px;
    max-width: 264px;
    margin: 0 auto;
    // box-shadow:0 0 30px #bbbbbb;
    z-index: 99999;
    >div>div, >div>i{
      margin-top: 27px;
    }
  }
  .btc-hint-large{
    max-width: 399px;
  }
  .btc-background-999{
    background: #a5a5a5;
  }
  button{
    width: 100%;
  }
  .btc-hint-loading{
    margin: 0 auto;
    margin-bottom: 46px;
    top: 24px!important;
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

.hint-enter-to{
  animation: swal2-show .4s;
}

.hint-enter, .hint-leave-to {
  transform: scale(0);
  // animation: swal2-show 0.3s;
}
</style>
