var SearchHead = (function () {
  var _this;
  var _data = {};
  var _createMenuUrl;
  var _$parent = $();
  var _searchData = [];

  var _suggestionData = [];

  var _focus = {
    currentIndex: -1,
    status: 'close',
  };

  return {
    init: function ($parent, data, createMenuUrl) {
      _this = this;
      _data = data;
      _createMenuUrl = createMenuUrl;
      _$parent = $parent;

      for (var prop in data) {
        var items = data[prop].items;

        this.makeSearchData(items);
      }

      this.render();
      this.cache();
      this.bindEvents();

      return this;
    },

    getTemplate: function () {
      return [
        '<div class="pull-left">',
          '<div class="input-group search-group">',
            '<input type="text" class="form-control" aria-label="Text input with dropdown button" placeholder="Search...">',
            '<button class="btn-link btnSearch"><i class="xi-search"></i><span class="sr-only">검색</span></button>',
            '<div class="search-list"></div>',
          '</div>',
        '</div>',
        '<div class="pull-right">',
          '<a href="' + _createMenuUrl + '" class="btn btn-primary pull-right">',
            '<i class="xi-plus"></i>',
            XE.Lang.trans('xe::addMenu'),
          '</a>',
        '</div>',
      ].join('\n');
    },

    render: function ($parent) {
      _$parent.append(_this.getTemplate());
    },

    cache: function (data) {
      this.$searchGroup = $('.search-group');
      this.$searchInput = $('.search-group > input');
      this.$btnLink = $('.btn-link');
      this.$searchList = $('.search-list');
    },

    bindEvents: function () {
      this.$searchInput.on('keyup', this.search);

      _$parent.on('click', '.btnSearch', function () {
        if (_focus.status === 'open' && _focus.currentIndex >= 0) {
          _this.moveToSelectedItem();
        }
      });

      _$parent.on('mouseenter', '.search-list li', function (e) {
        var $target = $(e.target);
        var index = _$parent.find('.search-list li').index($(this));

        _this.setFocus(index);
      });

      $(document).on('keydown', function (e) {
        var keyCode = e.keyCode;

        if (_focus.status === 'open') {
          switch (keyCode) {
            case 40:
            case 38:
              e.preventDefault();

              break;
          }
        }
      });

      $(document).on('keyup', function (e) {
        e.preventDefault();

        var keyCode = e.keyCode;

        if (_focus.status === 'open') {
          switch (keyCode) {
            //down
            case 40:
              _this.setFocus(++_focus.currentIndex);

              break;

            //up
            case 38:
              if (_focus.currentIndex != -1) {
                _this.setFocus(--_focus.currentIndex);
              }

              break;

            case 13:
              if (_focus.status === 'open' && _focus.currentIndex >= 0) {
                _this.moveToSelectedItem();
              }

              break;
          }
        }
      });
    },

    makeSearchData: function (items) {
      if (items && items instanceof Object) {
        for (var prop in items) {
          var item = items[prop];

          _searchData.push({
            id: item.id,
            title: XE.Lang.trans(item.title),
          });

          _this.makeSearchData(item.items);
        }
      }
    },

    search: function (e) {
      var value = e.target.value;
      var list = '';

      if (value.length > 1) {
        var suggestion = [];

        $.each(_searchData, function (idx, obj) {
          if (obj.title.indexOf(value) != -1) {
            suggestion.push(obj);
          }
        });

        _suggestionData = suggestion;

        if (suggestion.length > 0) {
          list += '<ul>';

          $.each(suggestion, function (idx, obj) {
            var title = obj.title.split(value).join('<em>' + value + '</em>');

            list +=   '<li data-id="' + obj.id + '"><a href="#">' + title + '</a></li>';
          });

          list += '</ul>';

          _this.$searchList.html(list);

          _this.toggleSuggestionByStatus('open');
        }

      } else {
        _this.toggleSuggestionByStatus('close');
      }
    },

    toggleSuggestionByStatus: function (status) {
      switch (status) {
        case 'open':
          _this.$searchGroup.addClass('open');
          _focus.status = 'open';

          break;

        case 'close':
          _this.$searchGroup.removeClass('open');
          _this.$searchList.empty();
          _suggestionData = [];
          _focus.currentIndex = -1;
          _focus.status = 'close';

          break;
      }
    },

    setFocus: function (index) {
      var $list = _this.$searchList.find('li');
      var currentIndex = index;

      $list.removeClass('on');

      if (index >= 0) {
        _this.$searchInput.blur();

        if (currentIndex > ($list.length - 1)) {
          currentIndex = 0;
        }

        $list.eq(currentIndex).addClass('on');

        _focus.currentIndex = currentIndex;

      } else {
        _this.$searchInput.focus();
      }

    },

    moveToSelectedItem: function () {
      var id = _$parent.find('li.on').data('id');

      $(document).scrollTop($('#item_' + id).offset().top);
      _this.toggleSuggestionByStatus('close');
    },
  };
})();
