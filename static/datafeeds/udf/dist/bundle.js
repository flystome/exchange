! function(e, t) {
  "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(e.Datafeeds = {})
}(this, function(e) {
  "use strict";
  var s = Object.setPrototypeOf || {
    __proto__: []
  }
  instanceof Array && function(e, t) {
    e.__proto__ = t
  } || function(e, t) {
    for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
  };
  var r = !1;

  function n(e) {
    if (r) {
      var t = new Date;
      console.log(t.toLocaleTimeString() + "." + t.getMilliseconds() + "> " + e)
    }
  }

  function c(e) {
    return void 0 === e ? "" : "string" == typeof e ? e : e.message
  }
  var i = function() {
      function e(e, t) {
        this._datafeedUrl = e, this._requester = t, this.prev_json = null, this.curResolution = 0, this.flag = !1, this.handleNewBar = null
      }
      return e.prototype.getBars = function(e, t) {
        var r = e.name + "_" + t;
        this.curResolution !== t && (this.flag = !1, this.prev_json = null, this.curResolution && this.getNewBar(e, t, r, this.handleNewBar), this.curResolution = t);
        var s = {
          symbol: e.ticker || "",
          resolution: t
        };
        return this.curResolution = t, this.flag ? this.createPromise(this.prev_json) : this.createPromise("api/v2/k_data", s)
      }, e.prototype.createPromise = function(e, t) {
        var u = this;
        if (!this.flag || this.prev_json) return new Promise(function(n, a) {
          u._requester.sendRequest(u._datafeedUrl, e, t).then(function(e) {
            if (0 !== e.data.length) {
              u.prev_json = e.prev_json, u.flag = !0;
              for (var t = [], r = e.data, s = r.length, o = 0; o < s; ++o) {
                var i = {
                  time: 1e3 * r[o].t,
                  close: Number(r[o].c),
                  open: Number(r[o].o),
                  high: Number(r[o].h),
                  low: Number(r[o].l),
                  volume: Number(r[o].v)
                };
                t.push(i)
              }
              n({
                bars: t,
                meta: {
                  noData: !1
                }
              })
            } else a(e.errmsg)
          }).catch(function(e) {
            var t = c(e);
            console.warn("HistoryProvider: getBars() failed, error=" + t), a(t)
          })
        })
      }, e.prototype.getNewBar = function(e, t, r, s) {
        var o = this;
        this.handleNewBar = s;
        var i = [],
          n = {
            noData: !1
          },
          a = this.createPush(e, t, this.curResolution);
        return new Promise(function(e, t) {
          a.bind("ticker", function(e) {
            i = 0 < i.length ? [i[i.length - 1]] : [];
            var t = {
              time: 1e3 * e.t,
              close: Number(e.c),
              open: Number(e.o),
              high: Number(e.h),
              low: Number(e.l),
              volume: Number(e.v)
            };
            i.push(t), s(r, {
              bars: i,
              meta: n
            }, o.resolution)
          })
        })
      }, e.prototype.createPush = function(e, t, r) {
        return t !== r && pusher.unsubscribe("market-" + e.ticker + "-ticker-" + r), pusher.subscribe("market-" + e.ticker + "-ticker-" + t)
      }, e
    }(),
    a = function() {
      function e(e, t) {
        this._subscribers = {}, this._requestsPending = 0, this._historyProvider = e, this.updateFrequency = t, this.oldResolution = 0, this.timer = setInterval(this._updateData.bind(this), t)
      }
      return e.prototype.subscribeBars = function(e, t, r, s) {
        this._subscribers.hasOwnProperty(s) ? n("DataPulseProvider: already has subscriber with id=" + s) : (this._subscribers[s] = {
          lastBarTime: null,
          listener: r,
          resolution: t,
          symbolInfo: e
        }, 0 !== this.oldResolution && t !== this.oldResolution && (this.timer = setInterval(this._updateData.bind(this), this.updateFrequency)), n("DataPulseProvider: subscribed for #" + s + " - {" + e.name + ", " + t + "}"))
      }, e.prototype.unsubscribeBars = function(e) {
        delete this._subscribers[e], n("DataPulseProvider: unsubscribed for #" + e)
      }, e.prototype._updateData = function() {
        var r = this;
        if (!(0 < this._requestsPending)) {
          this._requestsPending = 0;
          var e = function(t) {
              s._requestsPending += 1, s._updateDataForSubscriber(t).then(function() {
                r._requestsPending -= 1, n("DataPulseProvider: data for #" + t + " updated successfully, pending=" + r._requestsPending)
              }).catch(function(e) {
                r._requestsPending -= 1, n("DataPulseProvider: data for #" + t + " updated with error=" + c(e) + ", pending=" + r._requestsPending)
              })
            },
            s = this;
          for (var t in this._subscribers) e(t)
        }
      }, e.prototype._updateDataForSubscriber = function(e) {
        var t = this._subscribers[e];
        return this._historyProvider.getNewBar(t.symbolInfo, t.resolution, e, this._onSubscriberDataReceived.bind(this))
      }, e.prototype._onSubscriberDataReceived = function(e, t) {
        if (this._subscribers.hasOwnProperty(e)) {
          var r = t.bars;
          if (0 !== r.length) {
            var s = r[r.length - 1],
              o = this._subscribers[e];
            if (!(null !== o.lastBarTime && s.time < o.lastBarTime)) {
              if (null !== o.lastBarTime && s.time > o.lastBarTime) {
                if (r.length < 2) throw new Error("Not enough bars in history for proper pulse update. Need at least 2.");
                var i = r[r.length - 2];
                o.listener(i)
              }
              o.lastBarTime = s.time, o.listener(s)
            }
          }
        } else n("DataPulseProvider: Data comes for already unsubscribed subscription #" + e)
      }, e
    }(),
    u = function() {
      function e(e) {
        this._subscribers = {}, this._requestsPending = 0, this._quotesProvider = e, setInterval(this._updateQuotes.bind(this, 1), 1e4), setInterval(this._updateQuotes.bind(this, 0), 6e4)
      }
      return e.prototype.subscribeQuotes = function(e, t, r, s) {
        this._subscribers[s] = {
          symbols: e,
          fastSymbols: t,
          listener: r
        }, n("QuotesPulseProvider: subscribed quotes with #" + s)
      }, e.prototype.unsubscribeQuotes = function(e) {
        delete this._subscribers[e], n("QuotesPulseProvider: unsubscribed quotes with #" + e)
      }, e.prototype._updateQuotes = function(s) {
        var o = this;
        if (!(0 < this._requestsPending)) {
          var e = function(t) {
              i._requestsPending++;
              var r = i._subscribers[t];
              i._quotesProvider.getQuotes(1 === s ? r.fastSymbols : r.symbols).then(function(e) {
                o._requestsPending--, o._subscribers.hasOwnProperty(t) && (r.listener(e), n("QuotesPulseProvider: data for #" + t + " (" + s + ") updated successfully, pending=" + o._requestsPending))
              }).catch(function(e) {
                o._requestsPending--, n("QuotesPulseProvider: data for #" + t + " (" + s + ") updated with error=" + c(e) + ", pending=" + o._requestsPending)
              })
            },
            i = this;
          for (var t in this._subscribers) e(t)
        }
      }, e
    }();

  function d(e, t, r) {
    var s = e[t];
    return Array.isArray(s) ? s[r] : s
  }
  var t = function() {
    function e(e, t, r) {
      this._exchangesList = ["Hotex"], this._symbolsInfo = {}, this._symbolsList = [], this._datafeedUrl = e, this._datafeedSupportedResolutions = t, this._requester = r, this._readyPromise = this._init(), this._readyPromise.catch(function(e) {
        console.error("SymbolsStorage: Cannot init, error=" + e.toString())
      })
    }
    return e.prototype.resolveSymbol = function(t) {
      var r = this;
      return this._readyPromise.then(function() {
        var e = r._symbolsInfo[t];
        return void 0 === e ? Promise.reject("invalid symbol") : Promise.resolve(e)
      })
    }, e.prototype.searchSymbols = function(a, u, c, o) {
      var l = this;
      return this._readyPromise.then(function() {
        var i = [],
          n = 0 === a.length;
        a = a.toUpperCase();
        for (var e = function(e) {
            var t = l._symbolsInfo[e];
            if (void 0 === t) return "continue";
            if (0 < c.length && t.type !== c) return "continue";
            if (u && 0 < u.length && t.exchange !== u) return "continue";
            var r = t.name.toUpperCase().indexOf(a),
              s = t.description.toUpperCase().indexOf(a);
            if ((n || 0 <= r || 0 <= s) && !i.some(function(e) {
                return e.symbolInfo === t
              })) {
              var o = 0 <= r ? r : 8e3 + s;
              i.push({
                symbolInfo: t,
                weight: o
              })
            }
          }, t = 0, r = l._symbolsList; t < r.length; t++) {
          e(r[t])
        }
        var s = i.sort(function(e, t) {
          return e.weight - t.weight
        }).slice(0, o).map(function(e) {
          var t = e.symbolInfo;
          return {
            symbol: t.name,
            full_name: t.full_name,
            description: t.description,
            exchange: t.exchange,
            params: [],
            type: t.type,
            ticker: t.name
          }
        });
        return Promise.resolve(s)
      })
    }, e.prototype._init = function() {
      for (var e = this, t = [], r = {}, s = 0, o = this._exchangesList; s < o.length; s++) {
        var i = o[s];
        r[i] || (r[i] = !0, t.push(this._requestExchangeData(i)))
      }
      return Promise.all(t).then(function() {
        e._symbolsList.sort(), n("SymbolsStorage: All exchanges data loaded")
      })
    }, e.prototype._requestExchangeData = function(s) {
      var o = this;
      return new Promise(function(t, r) {
        o._requester.sendRequest(o._datafeedUrl, "api/v2/trading_views/symbol_info", {
          group: s
        }).then(function(e) {
          try {
            o._onExchangeDataReceived(s, e)
          } catch (e) {
            return void r(e)
          }
          t()
        }).catch(function(e) {
          n("SymbolsStorage: Request data for exchange '" + s + "' failed, reason=" + c(e)), t()
        })
      })
    }, e.prototype._onExchangeDataReceived = function(t, r) {
      var e = this,
        s = 0;
      try {
        for (var o = r.symbol.length, i = void 0 !== r.ticker; s < o; ++s) {
          var n = r.symbol[s],
            a = d(r, "exchange-listed", s),
            u = d(r, "exchange-traded", s),
            c = u + ":" + n,
            l = i ? d(r, "ticker", s) : n,
            h = {
              ticker: l,
              name: n,
              base_name: [a + ":" + n],
              full_name: c,
              listed_exchange: a,
              exchange: u,
              description: d(r, "description", s),
              has_intraday: f(d(r, "has-intraday", s), !1),
              has_no_volume: f(d(r, "has-no-volume", s), !1),
              minmov: d(r, "minmovement", s) || d(r, "minmov", s) || 0,
              minmove2: d(r, "minmove2", s) || d(r, "minmov2", s),
              fractional: d(r, "fractional", s),
              pricescale: d(r, "pricescale", s),
              type: d(r, "type", s),
              session: d(r, "session-regular", s),
              timezone: d(r, "timezone", s),
              supported_resolutions: f(d(r, "supported-resolutions", s), e._datafeedSupportedResolutions),
              force_session_rebuild: d(r, "force-session-rebuild", s),
              has_daily: f(d(r, "has-daily", s), !0),
              intraday_multipliers: f(d(r, "intraday-multipliers", s), ["1", "5", "15", "30", "60"]),
              has_weekly_and_monthly: d(r, "has-weekly-and-monthly", s),
              has_empty_bars: d(r, "has-empty-bars", s),
              volume_precision: f(d(r, "volume-precision", s), 0)
            };
          e._symbolsInfo[l] = h, e._symbolsInfo[n] = h, e._symbolsInfo[c] = h, e._symbolsList.push(n)
        }
      } catch (e) {
        throw new Error("SymbolsStorage: API error when processing exchange " + t + " symbol #" + s + " (" + r.symbol[s] + "): " + e.message)
      }
    }, e
  }();

  function f(e, t) {
    return void 0 !== e ? e : t
  }

  function l(e, t, r) {
    var s = e[t];
    return Array.isArray(s) ? s[r] : s
  }
  var o = function() {
    function e(e, t, r, s) {
      void 0 === s && (s = 1e4);
      var o = this;
      this._configuration = {
        supports_search: !1,
        supports_group_request: !0,
        supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
        supports_marks: !1,
        supports_timescale_marks: !1
      }, this._symbolsStorage = null, this._datafeedURL = e, this._requester = r, this._historyProvider = new i(e, this._requester), this._quotesProvider = t, this._dataPulseProvider = new a(this._historyProvider, s), this._quotesPulseProvider = new u(this._quotesProvider), this._oldResolution = 0, this._configurationReadyPromise = this._requestConfiguration().then(function(e) {
        null === e && (e = {
          supports_search: !1,
          supports_group_request: !0,
          supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
          supports_marks: !1,
          supports_timescale_marks: !1
        }), o._setupWithConfiguration(e)
      })
    }
    return e.prototype.onReady = function(e) {
      var t = this;
      this._configurationReadyPromise.then(function() {
        e(t._configuration)
      })
    }, e.prototype.getQuotes = function(e, t, r) {
      this._quotesProvider.getQuotes(e).then(t).catch(r)
    }, e.prototype.subscribeQuotes = function(e, t, r, s) {
      this._quotesPulseProvider.subscribeQuotes(e, t, r, s)
    }, e.prototype.unsubscribeQuotes = function(e) {
      this._quotesPulseProvider.unsubscribeQuotes(e)
    }, e.prototype.calculateHistoryDepth = function(e, t, r) {}, e.prototype.getMarks = function(e, t, r, s, o) {
      if (this._configuration.supports_marks) {
        var i = {
          symbol: e.ticker || "",
          from: t,
          to: r,
          resolution: o
        };
        this._send("marks", i).then(function(e) {
          if (!Array.isArray(e)) {
            for (var t = [], r = 0; r < e.id.length; ++r) t.push({
              id: l(e, "id", r),
              time: l(e, "time", r),
              color: l(e, "color", r),
              text: l(e, "text", r),
              label: l(e, "label", r),
              labelFontColor: l(e, "labelFontColor", r),
              minSize: l(e, "minSize", r)
            });
            e = t
          }
          s(e)
        }).catch(function(e) {
          n("UdfCompatibleDatafeed: Request marks failed: " + c(e)), s([])
        })
      }
    }, e.prototype.getTimescaleMarks = function(e, t, r, s, o) {
      if (this._configuration.supports_timescale_marks) {
        var i = {
          symbol: e.ticker || "",
          from: t,
          to: r,
          resolution: o
        };
        this._send("timescale_marks", i).then(function(e) {
          if (!Array.isArray(e)) {
            for (var t = [], r = 0; r < e.id.length; ++r) t.push({
              id: l(e, "id", r),
              time: l(e, "time", r),
              color: l(e, "color", r),
              label: l(e, "label", r),
              tooltip: l(e, "tooltip", r)
            });
            e = t
          }
          s(e)
        }).catch(function(e) {
          n("UdfCompatibleDatafeed: Request timescale marks failed: " + c(e)), s([])
        })
      }
    }, e.prototype.getServerTime = function(r) {
      this._configuration.supports_time && this._send("api/v2/trading_views/time").then(function(e) {
        var t = parseInt(e);
        isNaN(t) || r(t)
      }).catch(function(e) {
        n("UdfCompatibleDatafeed: Fail to load server time, error=" + c(e))
      })
    }, e.prototype.searchSymbols = function(t, e, r, s) {
      if (this._configuration.supports_search) {
        var o = {
          limit: 30,
          query: t.toUpperCase(),
          type: r,
          exchange: e
        };
        this._send("search", o).then(function(e) {
          if (void 0 !== e.s) return n("UdfCompatibleDatafeed: search symbols error=" + e.errmsg), void s([]);
          s(e)
        }).catch(function(e) {
          n("UdfCompatibleDatafeed: Search symbols for '" + t + "' failed. Error=" + c(e)), s([])
        })
      } else {
        if (null === this._symbolsStorage) throw new Error("UdfCompatibleDatafeed: inconsistent configuration (symbols storage)");
        this._symbolsStorage.searchSymbols(t, e, r, 30).then(s).catch(s.bind(null, []))
      }
    }, e.prototype.resolveSymbol = function(e, t, r) {
      var s = Date.now();
      function o(e) {
        t(e)
      }
      if (this._configuration.supports_group_request) {
        if (null === this._symbolsStorage) throw new Error("UdfCompatibleDatafeed: inconsistent configuration (symbols storage)");
        this._symbolsStorage.resolveSymbol(e).then(o).catch(r)
      } else {
        var i = {
          symbol: e
        };
        this._send("symbols", i).then(function(e) {
          void 0 !== e.s ? r("unknown_symbol") : o(e)
        }).catch(function(e) {
          n("UdfCompatibleDatafeed: Error resolving symbol: " + c(e)), r("unknown_symbol")
        })
      }
    }, e.prototype.getBars = function(e, t, r, s, o, i) {
      this._historyProvider.getBars(e, t).then(function(e) {
        o(e.bars, e.meta)
      }).catch(i)
    }, e.prototype.subscribeBars = function(e, t, r, s, o) {
      this._dataPulseProvider.subscribeBars(e, t, r, s)
    }, e.prototype.unsubscribeBars = function(e) {
      this._dataPulseProvider.unsubscribeBars(e)
    }, e.prototype._requestConfiguration = function() {
      return this._send("api/v2/trading_views/config").catch(function(e) {
        return n("UdfCompatibleDatafeed: Cannot get datafeed configuration - use default, error=" + c(e)), null
      })
    }, e.prototype._send = function(e, t) {
      return this._requester.sendRequest(this._datafeedURL, e, t)
    }, e.prototype._setupWithConfiguration = function(e) {
      if (void 0 === (this._configuration = e).exchanges && (e.exchanges = []), !e.supports_search && !e.supports_group_request) throw new Error("Unsupported datafeed configuration. Must either support search, or support group request");
      !e.supports_group_request && e.supports_search || (this._symbolsStorage = new t(this._datafeedURL, e.supported_resolutions || [], this._requester)), n("UdfCompatibleDatafeed: Initialized with " + JSON.stringify(e))
    }, e
  }();
  var h = function() {
      function e(e, t) {
        this._datafeedUrl = e, this._requester = t
      }
      return e.prototype.getQuotes = function(e) {
        var s = this;
        return new Promise(function(t, r) {
          s._requester.sendRequest(s._datafeedUrl, "quotes", {
            symbols: e
          }).then(function(e) {
            "ok" === e.s ? t(e.d) : r(e.errmsg)
          }).catch(function(e) {
            var t = c(e);
            n("QuotesProvider: getQuotes failed, error=" + t), r("network error: " + t)
          })
        })
      }, e
    }(),
    p = function() {
      function e(e) {
        e && (this._headers = e)
      }
      return e.prototype.sendRequest = function(e, t, r) {
        if (void 0 !== r) {
          var s = Object.keys(r);
          0 !== s.length && (t += "?"), t += s.map(function(e) {
            return encodeURIComponent(e) + "=" + encodeURIComponent(r[e].toString())
          }).join("&")
        }
        n("New request: " + t);
        var o = {
          credentials: "same-origin"
        };
        return void 0 !== this._headers && (o.headers = this._headers), fetch(e + "/" + t, o).then(function(e) {
          return e.text()
        }).then(function(e) {
          return JSON.parse(e)
        })
      }, e
    }(),
    _ = function(o) {
      function e(e, t) {
        void 0 === t && (t = 1e4);
        var r = new p,
          s = new h(e, r);
        return o.call(this, e, s, r, t) || this
      }
      return function(e, t) {
        function r() {
          this.constructor = e
        }
        s(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }(e, o), e
    }(o);
  e.UDFCompatibleDatafeed = _, Object.defineProperty(e, "__esModule", {
    value: !0
  })
});
