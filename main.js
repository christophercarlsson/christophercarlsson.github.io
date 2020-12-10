let version = 1;

var vm = new Vue({
  el: ".container-fluid",

  data: {
    group: null,
    groupName: null,
    groups: [],
    trades: [],

    showStats: false,
    risk: null,
    money: null,
    tradeNotes: null,

    date: null,
    pair: null,
    direction: null,
    type: null,
    setup: null,
    entry: null,
    stop: null,
    profit: null,
    result: null,
    notes: null,
    before: null,
    after: null,

    pairs: [
      "AUDCAD",
      "AUDCHF",
      "AUDJPY",
      "AUDNZD",
      "AUDUSD",
      "CADCHF",
      "CADJPY",
      "CHFJPY",
      "EURAUD",
      "EURCAD",
      "EURCHF",
      "EURGBP",
      "EURNZD",
      "EURUSD",
      "EURJPY",
      "GBPAUD",
      "GBPCAD",
      "GBPCHF",
      "GBPJPY",
      "GBPNZD",
      "GBPUSD",
      "NZDCAD",
      "NZDCHF",
      "NZDJPY",
      "NZDUSD",
      "USDCAD",
      "USDCHF",
      "USDJPY",
    ],

    directions: [
      "Long",
      "Short",
    ],

    types: [
      "Continuation",
      "Reversal"
    ],

    setups: [
      "Break & retest",
      "Pause & go",
      "Double top",
      "Double bottom",
      "Tripple top",
      "Tripple bottom",
      "Deep pullback",
      "BOBBI"
    ],
  },

  created: function () {
    this.migrate();

    if (localStorage.getItem("trades") != null) {
      this.trades = JSON.parse(localStorage.getItem("trades"));
    }

    if (localStorage.getItem("groups") != null) {
      this.groups = JSON.parse(localStorage.getItem("groups"));
    }

    document.onkeypress = function (e) {
        e = e || window.event;
        if (e.keyCode == 13) vm.addTrade();
    };

    $(document).ready(() => {
      $(document).find('.cpop').popover({
        trigger: 'hover'
      })
    });
    

    if (typeof custom !== 'undefined') {
      this.pairs.push(...custom.customPairs);
      this.setups.push(...custom.customSetups);
    }
  },

  computed: {
    list: function() {
      if (this.group == null) {
        return [];
      }
      return this.trades.filter((trade) => trade.group == this.group).sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
      });
    },

    bestPairs: function() {
      return this.statistics(this.pairs, 'pair', true);
    },

    bestDirections: function() {
      return this.statistics(this.directions, 'direction', false);
    },

    bestTypes: function() {
      return this.statistics(this.types, 'type', false);
    },

    bestSetups: function() {
      return this.statistics(this.setups, 'setup', true);
    },

    bestHours: function() {
      let grouped = _.groupBy(this.list, (trade) => {
        return moment(trade.date).format('HH');
      });

      var result = [];
      for (var prop in grouped) {
        result.push({
          name: prop,
          total: grouped[prop].length,
          win: grouped[prop].filter((trade) => trade.result > 0).length,
          be: grouped[prop].filter((trade) => trade.result == 0).length,
          loss: grouped[prop].filter((trade) => trade.result < 0).length,
          r: _.round(grouped[prop].reduce((total, trade) => total + parseFloat(trade.result / trade.stop), 0), 2)
        });
      }

      return result.sort((a, b) => this.sort(a, b));
    },

    bestDay: function() {
      let grouped = _.groupBy(this.list, (trade) => {
        return moment(trade.date).format('dddd');
      });

      var result = [];
      for (var prop in grouped) {
        result.push({
          name: prop,
          total: grouped[prop].length,
          win: grouped[prop].filter((trade) => trade.result > 0).length,
          be: grouped[prop].filter((trade) => trade.result == 0).length,
          loss: grouped[prop].filter((trade) => trade.result < 0).length,
          r: _.round(grouped[prop].reduce((total, trade) => total + parseFloat(trade.result / trade.stop), 0), 2)
        });
      }

      return result.sort((a, b) => this.sort(a, b));
    },

    generalStats: function() {
      return [
        {
          name: "R",
          value: this.r
        },
        {
          name: "Account balance",
          value: this.money ? ((this.r * (this.risk / 100)) * this.money) + parseInt(this.money) : 0
        }
      ]
    },

    win: function () {
      return this.list.filter((trade) => trade.result >= 0).length;
    },

    r: function() {
      return _.round(this.list.reduce((total, trade) => total + parseFloat(trade.result / trade.stop), 0), 2)
    }
  },

  methods: {
    addTrade: function() {
      if (_.isEmpty(this.date)) {
        alert("Must enter a date");
        return;
      }

      if (_.isEmpty(this.pair)) {
        alert("Must enter a pair");
        return;
      }
      
      if (_.isEmpty(this.direction)) {
        alert("Must enter a direction");
        return;
      }

      if (_.isEmpty(this.type)) {
        alert("Must enter a type");
        return;
      }

      if (_.isEmpty(this.setup)) {
        alert("Must enter a setup");
        return;
      }

      if (_.isEmpty(this.entry) || !$.isNumeric(this.entry)) {
        alert("Must enter a valid entry price");
        return;
      }

      if (_.isEmpty(this.stop) || !$.isNumeric(this.stop)) {
        alert("Must enter a valid stop loss");
        return;
      }

      if (_.isEmpty(this.profit) || !$.isNumeric(this.profit)) {
        alert("Must enter a valid take profit");
        return;
      }

      if (_.isEmpty(this.result) || !$.isNumeric(this.result)) {
        alert("Must enter a valid result");
        return;
      }

      this.trades.push({
        id: this.id(),
        group: this.group,
        date: this.date,
        pair: this.pair,
        direction: this.direction,
        type: this.type,
        setup: this.setup,
        entry: this.entry,
        stop: this.stop,
        profit: this.profit,
        result: this.result,
        notes: this.notes,
        before: this.before,
        after: this.after,
        editing: false
      });

      this.direction  = null;
      this.type  = null;
      this.setup  = null;
      this.entry = null;
      this.stop = null;
      this.profit = null;
      this.result = null;
      this.notes = null;
      this.before = null;
      this.after = null;
      
      localStorage.setItem("trades", JSON.stringify(this.trades));
    },

    addGroup: function() {
      if (_.isEmpty(this.groupName)) {
        alert("Must enter a group name.");
        return;
      }

      if (this.groups.includes(this.groupName)) {
        alert("Name must be unique.");
        return;
      }

      this.groups.push(this.groupName);
      this.group = this.groupName;
      this.groupName = null;
      localStorage.setItem("groups", JSON.stringify(this.groups));
    },

    deleteTrade: function(tradeId) {
      if (confirm('Do you really want to remove this trade?')) {
        this.trades = this.trades.filter((trade) => tradeId != trade.id);
        localStorage.setItem("trades", JSON.stringify(this.trades));
      }
    },

    deleteGroup: function(groupName) {
      if (confirm('Do you really want to remove this session?')) {
        this.groups = this.groups.filter((group) => groupName != group);
        localStorage.setItem("groups", JSON.stringify(this.groups));
        this.group = null;
      }
    },

    editTrade: function(trade) {
      if (trade.editing) {
        trade.editing = !trade.editing;
        localStorage.setItem("trades", JSON.stringify(this.trades));
      } else {
        trade.editing = !trade.editing;
      }
    },

    showNotes: function(notes) {
      this.tradeNotes = notes;
      $(`#note-modal`).modal('show');
    },

    statistics: function(array, property, noZeros) {
      return array.map((prop) => {
        return {
          name: prop,
          total: this.list.filter((trade) => trade[property] == prop).length,
          win: this.list.filter((trade) => trade[property] == prop && trade.result > 0).length,
          be: this.list.filter((trade) => trade[property] == prop && trade.result == 0).length,
          loss: this.list.filter((trade) => trade[property] == prop && trade.result < 0).length,
          r: _.round(this.list.filter((trade) => trade[property] == prop).reduce((total, trade) => total + parseFloat(trade.result / trade.stop), 0), 2)
        };
      }).filter((row) => {
        if (noZeros) {
          return row.total != 0;
        }
        return true;
      }).sort((a, b) => this.sort(a, b));
    },

    sort: function(a, b) {
      if (a.r < b.r) return 1;
      if (a.r > b.r) return -1;
      return 0;
    },

    percent: function(num, tot) {
      return _.round(((num / tot) * 100) || 0, 2);
    },

    id: function() {
      let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let length = 8;
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    },

    migrate: function() {
      if (localStorage.getItem("version") == null) {
        localStorage.setItem("version", version);
      }

      let oldVersion = localStorage.getItem("version");
      if (oldVersion == version) {
        return;
      }

      // Execute migrations here

      localStorage.setItem("version", version);
    },
  }
});