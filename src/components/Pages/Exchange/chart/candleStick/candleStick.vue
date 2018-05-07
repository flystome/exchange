<template>
  <section id='candleStick'>
  </section>
</template>

<script>
const TradingView = require('Static/charting_library/charting_library.min.js')
require('Static/datafeeds/udf/dist/polyfills.js')
const Datafeeds = require('Static/datafeeds/udf/dist/bundle.js')

export default {
  name: 'candleStick',
  props: ['market'],
  data () {
    return {
      widget: null,
      symbolInfo: null,
      url: '',
      HOST_URL: process.env.HOST_URL,
      curMarket: ''
    }
  },
  mounted () {
    this.curMarket = this.$route.params.id
    this.createWidget()
  },
  watch: {
    '$route' (to, from) {
      this.curMarket = to.params.id
      this.createWidget()
    },
  },
  methods: {
    createWidget () {
      // let _this = this
      this.url = location.origin + '/static/charting_library/'
      this.cssUrl = location.origin + '/static/charting_library/static/style/selfTrading.scss'
      var udfDatafeed = new Datafeeds.UDFCompatibleDatafeed(this.HOST_URL)

      var widget = new TradingView.widget({
        // debug: true, // uncomment this line to see Library errors and warnings in the console
        autosize: true,
        symbol: this.curMarket,
        interval: '5',
        toolbar_bg: '#f4f7f9',
        container_id: 'candleStick',
        datafeed: udfDatafeed,
        library_path: this.url,
        custom_css_url: this.cssUrl,
        // locale: getParameterByName('lang') || 'en',
        // drawings_access: { type: 'black', tools: [ { name: 'Regression Trend' } ] },
        disabled_features: ['left_toolbar', 'header_saveload', 'compare_symbol', 'display_market_status', 'go_to_date', 'header_chart_type', 'header_compare', 'header_interval_dialog_button', 'header_resolutions', 'header_screenshot', 'header_symbol_search', 'header_undo_redo', 'legend_context_menu', 'show_hide_button_in_legend', 'show_interval_dialog_on_key_press', 'snapshot_trading_drawings', 'symbol_info', 'timeframes_toolbar', 'use_localstorage_for_settings', 'volume_force_overlay', 'hide_last_na_study_output', 'legend_context_menu', 'dont_show_boolean_study_arguments'],
        enabled_features: ['move_logo_to_main_pane', 'study_templates', 'adaptive_logo'],
        overrides: {
          'volumePaneSize': 'small',
          'paneProperties.background': '#101622',
          'paneProperties.vertGridProperties.color': '#273646',
          'paneProperties.horzGridProperties.color': '#273646',
          'paneProperties.crossHairProperties.color': '#ffffff',
          'paneProperties.crossHairProperties.style': 'border',
          'scalesProperties.lineColor': '#728eaa',
          'mainSeriesProperties.candleStyle.upColor': '#40b246',
          'mainSeriesProperties.candleStyle.downColor': '#e9454d',
          'mainSeriesProperties.candleStyle.borderUpColor': '#40b246',
          'mainSeriesProperties.candleStyle.borderDownColor': '#e9454d',
          'mainSeriesProperties.candleStyle.wickUpColor': '#40b246',
          'mainSeriesProperties.candleStyle.wickDownColor': '#e9454d',
          'mainSeriesProperties.candleStyle.drawWick': true,
          'mainSeriesProperties.candleStyle.drawBorder': true,
          'scalesProperties.showLeftScale': false,
          'scalesProperties.textColor': '#728eaa',
          'paneProperties.rightMargin': 10,
          'paneProperties.bottomMargin': 10,
          'mainSeriesProperties.showPriceLine': true,
          'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0.00)'
        },
        timezone: 'Asia/Shanghai',
        studies_overrides: {
          'volume.volume.color.0': '#40b246',
          'volume.volume.color.1': '#e9454d',
          'volume.volume.transparency': 100,
          'volume.show ma': false,
          'bollinger bands.median.color': '#33FF88',
          'bollinger bands.upper.linewidth': 7
        },
        debug: true,
        time_frames: [
          { text: '50y', resolution: '6M' },
          { text: '3y', resolution: 'W' },
          { text: '8m', resolution: 'D' },
          { text: '2m', resolution: 'D' },
          { text: '1m', resolution: '60' },
          { text: '1w', resolution: '30' },
          { text: '7d', resolution: '30' },
          { text: '5d', resolution: '10' },
          { text: '3d', resolution: '10' },
          { text: '2d', resolution: '5' },
          { text: '1d', resolution: '5' }
        ]
      })

      widget.onChartReady(function () {
        let chart = widget.chart()

        let mas = [{
          day: 5,
          color: '#c0a365'
        }, {
          day: 10,
          color: '#9856bb'
        }, {
          day: 30,
          color: '#3c91cc'
        }, {
          day: 60,
          color: '#3da235'
        }]
        let buttons = [{
          label: '分时',
          resolution: '1',
          chartType: 3
        }, {
          label: '1Min',
          resolution: '1'
        }, {
          label: '5Min',
          resolution: '5'
        }, {
          label: '15Min',
          resolution: '15'
        }, {
          label: '30Min',
          resolution: '30'
        }, {
          label: '1Hour',
          resolution: '60'
        }, {
          label: '4Hour',
          resolution: '240'
        }, {
          label: '1D',
          resolution: '1440'
        }, {
          label: '3D',
          resolution: '4320'
        }, {
          label: '1W',
          resolution: '10080'
        }]

        mas.forEach(item => {
          chart.createStudy('Moving Average', false, false, [item.day], entity => {
            // widget.MAStudies.push(entity)
          }, {'plot.color': item.color})
        })

        buttons.forEach((item, index) => {
          let button = widget.createButton()
          // item.resolution === widget.options.interval && updateSelectedIntervalButton(button)
          button.attr('data-resolution', item.resolution)
            .attr('data-chart-type', item.chartType === undefined ? 1 : item.chartType)
            .html('<span>' + item.label + '</span>')
            .on('click', function () {
              if (!button.hasClass('selected')) {
                let chartType = +button.attr('data-chart-type')
                let resolution = button.attr('data-resolution')

                if (chart.resolution() !== resolution) {
                  chart.setResolution(resolution)
                }
                if (chart.chartType() !== chartType) {
                  chart.setChartType(chartType)
                }
                updateSelectedIntervalButton(button)
              }
            })
        })
        function updateSelectedIntervalButton (button) {
          widget.selectedIntervalButton && widget.selectedIntervalButton.removeClass('selected')
          button.addClass('selected')
          widget.selectedIntervalButton = button
        }
      })
    }
  }
}
</script>

<style lang='scss'>
  @import './candleStick.scss'
</style>
