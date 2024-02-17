/**
worker 작업

@date
2014.01

@copyright
Copyright (c) Sung-min Yu.

@license
Dual licensed under the MIT and GPL licenses.

-
global 변수: self

-
사용가능한 기능
https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope
1. navigator 객체
2. location 객체(읽기전용)
3. XMLHttpRequest 함수
4. Base64 ASCII와 2진 데이터 간의 상호 변환을 위한 atob() 및 btoa() 함수
5. setTimeout() / clearTimeout() 및 setInterval() / clearInterval()
6. dump()
7. 애플리케이션 캐시
8. importScript() 메서드를 사용하는 외부 스크립트
9. 기타 웹워커 생성
*/

'use strict'; // ES5

// import
importScripts('worker.xhr.min.js');

// console
if (!self.console) {
  self.console = {
    log: function () {},
    dir: function () {},
  };
}

// 유효성 검사를 위한 공통 함수
function isValidBlock(grid, block, storage) {
  return (
    grid &&
    block &&
    grid in storage &&
    'blocks' in storage[grid] &&
    storage[grid]['blocks'][block]
  );
}

// url
/*var url_params = {};
if(location.search.substring(1) && 2 <= location.search.substring(1).split('=').length) {
	url_params = JSON.parse('{"' + decodeURI(location.search.substring(1) || '').replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
}
console.log(location);*/

// 전역변수
var initialGridKey = 'ysm'; // 초기 그리드 키 값
var network = navigator && 'onLine' in navigator ? navigator.onLine : true; // 통신연결 (온라인: true, 오프라인: false)
var server = '//' + self.location.host; // 특정 서버로 연결(포트, 호스트 등 변경 또는 테스트시)
var regexp = {
  // 정규식
  //main_grid: /ysm/i, // main grid 키
  main_grid: new RegExp(initialGridKey, 'i'),
  tag: /<(\w+)[^>]*>/,
  num_unit: /^([0-9]+)(\D+)$/i, // 단위
  text: /^(\D+)$/i, // 텍스트
  num: /^[+-]?\d+(\.\d+)?$/, // 숫자
  trim: /(^\s*)|(\s*$)/g, // 양쪽 여백
};
var debug = {
  // debug
  is: false, // debug 사용여부
  log: function (name, value) {
    if (!console || !console.log) {
      return;
    } else if (typeof value === 'undefined') {
      console.log('----------【 ' + name + ' 】----------');
    } else {
      console.log('----------【' + name);
      console.log(value);
      console.log('】----------');
    }
  },
  dir: function (name, value) {
    // IE는 워커 console.dir 지원하지 않을 수 있음
    if (!console || !console.log) {
      return;
    } else if (typeof value === 'undefined') {
      console.log('----------【');
      console.dir(name);
      console.log('】----------');
    } else {
      console.log('----------【' + name);
      console.dir(value);
      console.log('】----------');
    }
  },
};
var setTemporarilyTitle = function (form) {
  // 기본 타이틀 설정
  var title = 'Title';
  switch (form) {
    case 'folder':
    case 'story':
    case 'plot':
    case 'news':
      title = form;
      break;
  }
  return title;
};
var instance = {}; // instance

// 데이터 관리 (node.js 은 I/O에 최적화 되어 있다.)
instance['data'] = (function () {
  function GridData() {
    var that = this;
    that.storage = {
      /*
			// storage 인터페이스 (아래 데이터 인터페이스가 row, col 위치 설정 후 화면으로 바로 전달됨)
			// grid key 와 column_count 값을 고유해야 한다. (즉, column_count 가 다른 동일 grid key 데이터를 불러오면 안된다)
			"grid key": {
				"parent": "현재 grid의 부모 grid (폴더와 같이 연결된 grid key 값)", 
				"grid": "grid key",
				"column_count": "grid 해상도에 따라 가로로 들어갈 수 있는 블록 개수",
				"blocks": {
					"block key": {"block": "block key", "form": "block 종류", "icon": "아이콘", "title": "block 타이틀", "height_size": 1, "width_size": 1, "slide": "slide index(1부터 시작)", "row": 0, "col": 0}
					...
				},
				"time": "grid 최근수정일"
			};
			*/
    };
  }
  // grid column_count 에 가능한 블록인지 검사
  GridData.prototype.getFilterBlocks = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var column_count =
      parameter['column_count'] && Number(parameter['column_count']); // grid column_count
    var blocks = parameter['blocks'] || {};

    var key;
    var result = {};
    for (key in blocks) {
      if (blocks[key]['width_size'] <= column_count) {
        result[key] = blocks[key];
      }
    }

    return result;
  };
  // 서버에서 해당 grid 데이터를 불러온다.
  GridData.prototype.getSelectGrid = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var parent = parameter['parent'] || ''; // parent grid key
    var grid = parameter['grid']; // grid key
    var column_count =
      parameter['column_count'] && Number(parameter['column_count']); // grid column_count
    var callback = parameter['callback'] || function () {}; // callback
    var is_sync = parameter['is_sync']; // 서버와 동기화 여부 - 서버와 지속적으로 통신하며, 변경된 내역(다른 접속한 곳에서 변경건)이 있는지 검사하여 맞춘다.
    var setMarketBlock = function (data) {
      // market
      var is = false;
      var key;
      for (key in data['blocks']) {
        if (data['blocks'][key].form === 'market') {
          is = true;
          break;
        }
      }
      if (is === false) {
        data['blocks']['market0123456789abcdefgh'] = {
          block: 'market0123456789abcdefgh',
          form: 'market',
          icon: '',
          title: 'market',
          height_size: 1,
          width_size: 1,
          slide: 1,
          row: 0,
          col: 0,
        };
      }
    };
    // 유효성 검사
    if (!grid || !column_count) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
      /*}else if(!parent && !regexp.main_grid.test(grid)) { // mian grid 가 아닌 경우, parent 값은 필수값이 된다.
			return false;
		*/
    } else if (parent && typeof that['storage'][parent] !== 'object') {
      // parent grid 가 data storage 에 존재하지 않을 경우 (parent grid가 먼저 로드된 후, 이에 속한 하위 grid 가 로드되기 때문에 검사한다.)
      console.log('[worker 오류!] storage');
      return false;
    } else if (
      grid in that['storage'] &&
      that['storage'][grid]['column_count'] == column_count
    ) {
      // 기존 load 된 grid
      return callback(that['storage'][grid]['blocks']);
    }

    //if(network === true) {
    if (!network || location.hostname === 'localhost') {
      console.log('[worker 정보] 테스트 데이터');
      // 테스트 데이터
      (function () {
        var mongodb = {
          parent: parent,
          grid: grid,
          column_count: column_count, // column_count 는 몽고db에서 관련 데이터를 모두 가져와 조립한 후 사용자에게 전달하기 전 단계에서 포함된다.
          blocks: {},
          time: '',
        };

        // min (포함) 과 max (포함) 사이의 임의 정수를 반환
        // Math.round() 를 사용하면 고르지 않은 분포를 얻게된다!
        function getRandomIntInclusive(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        var i = 0;
        var max = 50;
        var form = ['story', 'plot'];
        var temp = '';
        var width, height;
        var slide;

        // 테스트를 위한 임의 블록
        for (; i < max; i++) {
          temp = form.length ? form[getRandomIntInclusive(0, 1)] : 'story';
          if (temp) {
            width = 1;
            height = 1;
            if (temp !== 'story') {
              width = getRandomIntInclusive(2, 6);
              height = getRandomIntInclusive(2, 6);
            }
            slide = getRandomIntInclusive(1, 5);
            mongodb['blocks']['test' + i] = {
              block: 'test' + i,
              form: temp,
              story: '',
              title: 'test' + i,
              height_size: height,
              width_size: width,
              slide: slide,
              row: 0,
              col: 0,
            };
          }
        }

        // block 필터
        mongodb['blocks'] = that.getFilterBlocks({
          column_count: column_count,
          blocks: mongodb['blocks'],
        });
        if (!parent && regexp.main_grid.test(grid)) {
          setMarketBlock(mongodb);
        }

        //
        that['storage'][grid] = {};
        that['storage'][grid] = mongodb;
      })();
    } else {
      // xhr 통신
      xhr({
        url: server + '/data/grid',
        type: 'GET',
        data: {
          parent: parent,
          grid: grid,
          column_count: column_count,
        },
        success: function (data) {
          //console.log(data);

          // block 필터
          data['blocks'] = that.getFilterBlocks({
            column_count: column_count,
            blocks: data['blocks'],
          });
          if (!parent && regexp.main_grid.test(grid)) {
            setMarketBlock(data);
          }

          //
          that['storage'][grid] = {};
          that['storage'][grid] = data; // mongodb 에서 받아온 데이터 삽입
        },
        error: function () {},
      });
    }

    return callback(that['storage'][grid]['blocks']);
  };
  // 서버에서 해당 grid 데이터를 불러오는 것이 아니라 storage 단에 해당 grid 를 만든다.
  GridData.prototype.setCreateGrid = function (parameter) {
    // storgae 에 없는 grid만 생성가능하다.
    var that = this;

    // parameter
    var parameter = parameter || {};
    var parent = parameter['parent'] || ''; // parent grid key
    var grid = parameter['grid']; // grid key
    var column_count =
      parameter['column_count'] && Number(parameter['column_count']); // grid column_count
    var blocks =
      (typeof parameter['blocks'] === 'object' &&
        Object.keys(parameter['blocks']).length > 0 &&
        parameter['blocks']) ||
      {}; // blocks 리스트
    var callback = parameter['callback'] || function () {}; // callback

    // 유효성 검사
    if (!grid || !column_count) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
      /*}else if(!parent && !regexp.main_grid.test(grid)) { // mian grid 가 아닌 경우, parent 값은 필수값이 된다.
			return false;
		*/
    } else if (parent && typeof that['storage'][parent] !== 'object') {
      // parent grid 가 data storage 에 존재하지 않을 경우
      console.log('[worker 오류!] parent storage');
      return false;
    } else if (
      grid in that['storage'] &&
      that['storage'][grid]['column_count'] == column_count
    ) {
      // storage 에 해당 grid 가 이미 존재하는지 확인
      console.log('[worker 오류!] grid storage');
      return false;
    }

    that['storage'][grid] = {
      parent: parent,
      grid: grid,
      column_count: column_count,
      blocks: blocks,
      time: '',
    };

    // 온/오프라인 확인
    if (network === true) {
      /*
			폴더 grid 를 생성할 경우 
			xhr 응답이 늦어지는 상태에서 사용자가 블록을 다른 곳으로 이동하거나 할 경우
			동기화에 문제가 발생할 수 있다.
			*/
      // xhr 통신
      /*xhr({
				'url': server + '/data/grid',
				'type': 'POST',
				'timeout': 2000, // milliseconds
				'data': {
					'parent': parent,
					'grid': grid,
					'column_count': column_count,
					'blocks': JSON.stringify(blocks)
				},
				'success': function(data) {
					
				},
				'error': function() {
					
				}
			});*/
    }

    return callback(that['storage'][grid]['blocks']);
  };
  // 서버와 storage 단 데이터를 동기화한다.
  GridData.prototype.setUpdateGrid = function setUpdateGrid(parameter) {
    var that = this;
    var is = false;

    // 온/오프라인 확인
    if (network === true) {
      // xhr 통신
      xhr({
        url: server + '/data/grid',
        type: 'PUT',
        timeout: 2000, // milliseconds
        data: {
          storage: JSON.stringify(that['storage']),
        },
        success: function (data) {
          if (typeof data === 'object' && data['status'] === 'success') {
            is = true;
          }
        },
        error: function () {
          //that.setUpdateGrid.apply(that, Array.prototype.slice.call(arguments));
          that.setUpdateGrid(parameter);
        },
      });
    } else {
      // 테스트
      is = true;
    }

    return is;
  };
  GridData.prototype.setDeleteGrid = function setDeleteGrid(parameter) {
    // storage 에 존재하는 grid만 삭제가능하다.
    var that = this;

    // parameter
    var parameter = parameter || {};
    var parent = parameter['parent'] || ''; // parent grid key
    var grid = parameter['grid']; // grid key
    var is = false;

    // 유효성 검사
    if (
      !grid ||
      regexp.main_grid.test(grid) ||
      (typeof that['storage'][grid] === 'object' &&
        typeof that['storage'][grid]['blocks'] === 'object' &&
        Object.keys(that['storage'][grid]['blocks']).length > 0)
    ) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    } else if (parent && typeof that['storage'][parent] !== 'object') {
      // parent grid 가 data storage 에 존재하지 않을 경우
      console.log('[worker 오류!] parent storage');
      return false;
    }

    // 온/오프라인 확인
    if (network === true) {
      // xhr 통신
      xhr({
        url: server + '/data/grid',
        type: 'DELETE',
        timeout: 2000, // milliseconds
        data: {
          grid: grid,
        },
        success: function (data) {
          if (
            typeof data === 'object' &&
            data['status'] === 'success' &&
            delete that['storage'][grid]
          ) {
            is = true;
          }
        },
        error: function () {},
      });
    } else {
      // 테스트
      if (delete that['storage'][grid]) {
        is = true;
      }
    }

    return is;
  };
  // block 정보
  GridData.prototype.getSelectBlock = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid']; // grid key
    var block = parameter['block']; // block key

    // 유효성 검사
    if (
      grid &&
      block &&
      grid in that['storage'] &&
      'blocks' in that['storage'][grid] &&
      block in that['storage'][grid]['blocks']
    ) {
      return that['storage'][grid]['blocks'][block];
    } else {
      console.log('[worker 오류!] storage');
      return false;
    }
  };
  // block 생성/추가
  GridData.prototype.setCreateBlock = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid']; // grid key
    var block = parameter['block']; // block key
    var form = parameter['form']; // block 종류

    var title = parameter['title'] || setTemporarilyTitle(form); // folder 경우
    var article = parameter['article'] || ''; // news 경우
    var template = parameter['template'] || ''; // news 경우
    var height_size =
      parameter['height_size'] && Number(parameter['height_size']); // folder, news 경우
    var width_size = parameter['width_size'] && Number(parameter['width_size']); // folder, news 경우

    var column_count =
      (/^\d+$/.test(parameter['column_count']) && parameter['column_count']) ||
      ''; // grid column_count
    var slide = parameter['slide']; // slide index
    var row = parameter['row'] && Number(parameter['row']);
    var col = parameter['col'] && Number(parameter['col']);

    var callback = parameter['callback'] || function () {}; // callback

    // 유효성 검사
    if (
      !grid ||
      !block ||
      !form ||
      !slide ||
      !(grid in that['storage']) ||
      !('blocks' in that['storage'][grid])
    ) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    }

    // grid 별로 중복되는 블록키가 있는지 검사
    var key;
    for (key in that['storage']) {
      if (
        that['storage'].hasOwnProperty(key) &&
        that['storage'][key]['blocks'] &&
        block in that['storage'][key]['blocks']
      ) {
        console.log('[worker 오류!] overlap');
        return false;
      }
    }

    // data storage 에 block 정보 추가 (서버와 통신 후 데이터가 갱신될 수 있음)
    that['storage'][grid]['blocks'][block] = {
      block: block,
      form: form,
      title: title,
      article: article,
      template: template,
      height_size: height_size || 1,
      width_size: width_size || 1,
      slide: slide,
      row: row,
      col: col,
    };

    switch (form) {
      case 'folder':
        break;
      case 'story':
      case 'plot':
      case 'news':
        // 온/오프라인 확인
        if (network === true) {
          // 유료 story, plot 의 경우 결제 내역확인 후 반환
          // 서버에 연결하여 해당 plot 존재여부를 확인한 후 콜백된다. (height_size, width_size 정보가 포함된것 반환)
          // xhr 통신
          xhr({
            url: server + '/data/block',
            type: 'POST',
            //'async': true, // 비동기 처리
            data: {
              grid: grid,
              block: block,
              form: form,
              title: title,
              article: article,
              template: template,
              height_size: height_size || 1,
              width_size: width_size || 1,
              column_count: column_count,
              slide: slide,
              row: row,
              col: col,
            },
            success: function (data) {
              if (typeof data === 'object' && block == data['block']) {
                // data storage 정보를 서버측 정보로 덮어쓰기
                that['storage'][grid]['blocks'][data['block']] = {};
                that['storage'][grid]['blocks'][data['block']] = data;
              }
            },
            error: function () {},
          });
        }
        break;
      default:
        console.log('[worker 오류!] form');
        return false;
    }

    return callback(that['storage'][grid]['blocks'][block]);
  };
  // block 정보 수정
  GridData.prototype.setUpdateBlock = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid']; // grid key
    var block = parameter['block']; // block key
    var data = parameter['data'] || {}; // block update data (수정할 부분의 key: value)

    // 유효성 검사
    if (
      !grid ||
      !block ||
      !(grid in that['storage']) ||
      !('blocks' in that['storage'][grid]) ||
      !that['storage'][grid]['blocks'][block]
    ) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    }

    var key;
    for (key in data) {
      if (data.hasOwnProperty(key)) {
        // 현재 보유한 key에 대해서만 수정가능 (추가 불가능)
        //console.log('[worker 정보] ' + block + ' 값수정 ' + key + ': ' + data[key]);
        that['storage'][grid]['blocks'][block][key] = data[key];
      }
    }

    return that['storage'][grid]['blocks'][block];
  };
  GridData.prototype.setDeleteBlock = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid']; // grid key
    var block = parameter['block']; // block key
    var form = parameter['form']; // block 종류
    var is = false;

    // 유효성 검사
    if (
      !grid ||
      !block ||
      !form ||
      !(grid in that['storage']) ||
      !('blocks' in that['storage'][grid]) ||
      !that['storage'][grid]['blocks'][block]
    ) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    }

    // 온/오프라인 확인
    if (network === true) {
      // xhr 통신
      xhr({
        url: server + '/data/block',
        type: 'DELETE',
        timeout: 2000, // milliseconds
        data: {
          grid: grid,
          block: block,
          form: form,
        },
        success: function (data) {
          if (
            typeof data === 'object' &&
            data['status'] === 'success' &&
            delete that['storage'][grid]['blocks'][block]
          ) {
            is = true;
          }
        },
        error: function () {},
      });
    } else {
      // 테스트
      if (delete that['storage'][grid]['blocks'][block]) {
        is = true;
      }
    }

    return is;
  };
  // block 이동
  GridData.prototype.setMoveBlock = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var block = parameter['block']; // block key
    var before = parameter['before']; // 이전 위치 정보값 grid, slide
    var after = parameter['after']; // 다음 위치 정보값 grid, slide

    // 필수값 검사
    if (!block || !before || !after || !before['grid'] || !after['grid']) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    } else if (
      !that['storage'][before['grid']] ||
      !that['storage'][before['grid']]['blocks'] ||
      !that['storage'][before['grid']]['blocks'][block]
    ) {
      console.log('[worker 오류!] before storage');
      return false;
    } else if (
      !that['storage'][after['grid']] ||
      !that['storage'][after['grid']]['blocks']
    ) {
      console.log('[worker 오류!] after storage');
      return false;
    } else if (
      !that['storage'][before['grid']]['blocks'][block]['block'] ||
      !that['storage'][before['grid']]['blocks'][block]['form'] ||
      !that['storage'][before['grid']]['blocks'][block]['slide'] ||
      !('row' in that['storage'][before['grid']]['blocks'][block]) ||
      !('col' in that['storage'][before['grid']]['blocks'][block]) ||
      !that['storage'][before['grid']]['blocks'][block]['height_size'] ||
      !that['storage'][before['grid']]['blocks'][block]['width_size']
    ) {
      console.log('[worker 오류!] 필수값');
      return false;
    } else if (before['grid'] == after['grid']) {
      return true;
    }

    // 해당 block 이 여러개 존재하는지 검사
    var key;
    for (key in that['storage']) {
      if (
        key != before['grid'] &&
        that['storage'][key]['blocks'] &&
        block in that['storage'][key]['blocks']
      ) {
        console.log('[worker 오류!] 중복된 block 존재');
        return false;
      }
    }

    var data = JSON.parse(
      JSON.stringify(that['storage'][before['grid']]['blocks'][block]),
    ); // deep copy
    if (delete that['storage'][before['grid']]['blocks'][block]) {
      that['storage'][after['grid']]['blocks'][block] = data;
      return that['storage'][after['grid']]['blocks'][block];
    } else {
      console.log('[worker 오류!] delete');
      return false;
    }
  };
  return new GridData();
})();

// structure
// viewport, movement 등 grid 의 설계(또는 구조) - grid 내부 block 들의 위치 맵
instance['structure'] = (function () {
  function GridStructure() {
    var that = this;

    // storage (겹치지 않고 grid를 그리기 위해 필요한 맵)
    that.storage = {
      /*
			// 메인도 폴더키를 생성하여 관리(data-type="grid" data-key="folder key")하도록 하자
			// 화면에 그려진 grid(block) 정보
			"viewport": {
				"grid key": {
					// slide 1 (연관배열 방식)
					"1": {
						// row - 1 번 index 부터 시작
						"1": {
							// col - 1 번 index 부터 시작
							"1": {"block": "9de2", "slide": "", "row": 0, "col": 0, "height_size": 1, "width_size": 1},
							"2": {},
							"3": {}
						},
						"2": {
							// col
							"1": {},
							"2": {},
							"3": {}
						}
					},
					// slide 2 (연관배열 방식)
					"2": {
						// row - 1 번 index 부터 시작
						"1": {
							// col - 1 번 index 부터 시작
							"1": {},
							"2": {},
							"3": {}
						},
						"2": {
							// col
							"1": {},
							"2": {},
							"3": {}
						}
					}
				}
			},
			// 블록 이동이 발생했을 때 임시로 저장되는 grid 정보
			"movement": {
				"grid key": {

				}
			},
			// grid 단 수
			"column_count": {
				"grid key": "가로로 들어갈 수 있는 block 개수(width grid 사이즈)"
			}
			*/
      viewport: {},
      movement: {},
      column_count: {},
    };
  }
  // viewport storage 에 중복되지 않고 들어갈 수 있는 row(세로), col(가로) 값 반환
  GridStructure.prototype.getPossibleViewport = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid']; // grid key
    var column_count =
      parameter['column_count'] || that['storage']['column_count'][grid]; // grid 의 가로 블록크기(개수)
    var slide = parameter['slide']; // slide index
    var height_size =
      parameter['height_size'] && Number(parameter['height_size']); // block height size
    var width_size = parameter['width_size'] && Number(parameter['width_size']); // block width size

    // 유효성 검사
    if (!grid || !column_count || !slide || !height_size || !width_size) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    }

    // 초기값
    var row = 1;
    var col = 1;
    var y = 0;
    var x = 0;
    var max1 = 0;
    var max2 = 0;

    // 중복검사
    overlapped: while (true) {
      // 1.
      // row(세로), col(가로) 영역에 이미 다른 element 가 있는지 확인하여,
      // 해당 element 의 width_size 만큼 col(가로) 값을 이동 시킨다.
      if (
        that['storage']['viewport'][grid] &&
        that['storage']['viewport'][grid][slide] &&
        that['storage']['viewport'][grid][slide][row] &&
        that['storage']['viewport'][grid][slide][row][col]
      ) {
        col += Number(
          that['storage']['viewport'][grid][slide][row][col]['width_size'],
        );

        // 로그
        //console.log('col 변경: ' + col);
        continue overlapped;
      }

      // 2.
      // col(가로) 값이 가로로 들어갈 수 있는 최대크기(column_count)를 넘으면,
      // row(세로) 값을 증가(한칸아래로 이동)시켜 검사한다.
      if (col + width_size - 1 > column_count) {
        row += 1;
        col = 1;

        // 로그
        //console.log('row 변경: ' + row);
        //console.log('col 변경: ' + col);
        continue overlapped;
      }

      // 3.
      // row(세로), col(가로) 확인
      for (y = row, max1 = row + height_size; y < max1; y++) {
        for (x = col, max2 = col + width_size; x < max2; x++) {
          // 현재 block 의 width_size, height_size 영역에 중복되는 block 이 존재할 경우 col(가로) 값을 변경한다.
          if (
            that['storage']['viewport'][grid] &&
            that['storage']['viewport'][grid][slide] &&
            that['storage']['viewport'][grid][slide][y] &&
            that['storage']['viewport'][grid][slide][y][x]
          ) {
            col += 1; // 존재하면 col(가로) 한칸 이동

            // 로그
            //console.log('continue');
            continue overlapped;
          }
        }
      }

      break;
    }

    // 로그
    //console.log('row(세로): ' + row + ', col(가로): ' + col);

    return { row: row, col: col };
  };
  // movement storage 에서 해당 검색조건에 중복되는 블록정보와 겹치지지 않도록 이동해야할 row 값 반환
  GridStructure.prototype.getPossibleMovement = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid']; // grid key
    var slide = parameter['slide']; // slide index
    var row = parameter['row'] && Number(parameter['row']);
    var col = parameter['col'] && Number(parameter['col']);
    var height_size =
      parameter['height_size'] && Number(parameter['height_size']);
    var width_size = parameter['width_size'] && Number(parameter['width_size']);

    // 유효성 검사
    if (!grid || !slide || !row || !col || !height_size || !width_size) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    }

    var result = {
      bool: false, // false: 겹침없음, true: 겹침있음
      row: 0, // 겹치는 block이 존재할 경우, 겹치지 않도록 이동해야할 row(세로) 값
    };

    // 검사 영역 초기값
    var min_row = row; // 검색 시작 row
    var max_row = min_row + height_size; // 검색 종료 row
    var min_col = col; // 검색 시작 col
    var max_col = min_col + width_size; // 검색 종료 col

    // 반복문 초기값
    var y, x;

    overlapped: while (true) {
      for (y = min_row; y < max_row; y++) {
        // row (세로)
        for (x = min_col; x < max_col; x++) {
          // col (가로)
          if (
            grid in that['storage']['movement'] &&
            slide in that['storage']['movement'][grid] &&
            y in that['storage']['movement'][grid][slide] &&
            x in that['storage']['movement'][grid][slide][y]
          ) {
            // that['storage']['movement']
            result['bool'] = true;
            // 겹치는 블록이 있을 경우, 겹치지 않고 들어갈 수 있는 row(세로) 값도 함께 구한다.
            min_row =
              Number(that['storage']['movement'][grid][slide][y][x]['row']) +
              Number(
                that['storage']['movement'][grid][slide][y][x]['height_size'],
              );
            max_row = min_row + height_size;
            continue overlapped;
          }
        }
      }
      result['row'] = min_row;
      break;
    }

    return result;
  };
  // 현재위치 row(세로)값 상단에 블록이 들어갈 수 있는 공간이 있는지 확인 한다.
  GridStructure.prototype.getPossibleTopEmpty = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid']; // grid key
    var slide = parameter['slide']; // slide index
    var row = parameter['row'] && Number(parameter['row']);
    var col = parameter['col'] && Number(parameter['col']);
    var height_size =
      parameter['height_size'] && Number(parameter['height_size']);
    var width_size = parameter['width_size'] && Number(parameter['width_size']);

    // 유효성 검사
    if (!grid || !slide || !row || !col || !height_size || !width_size) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    }

    var result = {
      bool: false, // false: 공간없음, true: 공간있음
      row: 0, // 겹치는 block이 존재할 경우, 겹치지 않도록 이동해야할 row(세로) 값
    };

    // 검사 영역 초기값
    var min_row = 1;
    var max_row = row - 1;
    var min_col = col;
    var max_col = col + width_size;

    // 반복문 초기값
    var temp, y, x;

    // 해당 블록의 위치부터 위로 올라가며 검사 - row(세로) 한칸씩 올라가며, 현재 block 이 들어갈 공간이 있는지 검사
    outerwhile: while (max_row >= min_row) {
      // 최소영역 이내검사

      // row(max_row) 가 위로 올라가며, block 높이 만큼 반복문을 돌기 위한 값
      temp = max_row + height_size;

      rowfor: for (y = max_row; y < temp; y++) {
        // row

        colfor: for (x = min_col; x < max_col; x++) {
          // col

          // 로그
          //console.log('for[' + y + '][' + x + ']');

          // viewport storage 검사
          if (
            grid in that['storage']['viewport'] &&
            slide in that['storage']['viewport'][grid] &&
            y in that['storage']['viewport'][grid][slide] &&
            x in that['storage']['viewport'][grid][slide][y]
          ) {
            // that['storage']['viewport']
            // 현재 block 정보가 검사 block 정보와 다른 경우
            if (
              that['storage']['viewport'][grid][slide][y][x]['row'] != row ||
              that['storage']['viewport'][grid][slide][y][x]['col'] != col
            ) {
              // 로그
              //console.log('that['storage']['viewport']: [' + y + '][' + x + ']');
              max_row -= 1;
              continue outerwhile;
            }
          }

          // movement storage 검사
          if (
            grid in that['storage']['movement'] &&
            slide in that['storage']['movement'][grid] &&
            y in that['storage']['movement'][grid][slide] &&
            x in that['storage']['movement'][grid][slide][y]
          ) {
            // that['storage']['movement']
            // 로그
            //console.log('that['storage']['movement']: [' + y + '][' + x + ']');
            max_row -= 1;
            continue outerwhile;
          }
        }
      }

      // 반환정보
      result['bool'] = true;
      result['row'] = max_row;

      max_row -= 1;
    }

    return result;
  };
  // row(세로), col(가로) 위치에 겹치는 block 이 있는지 검사 (동일한 block key는 제외)
  GridStructure.prototype.isOverlapBlock = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid']; // grid key
    var block = parameter['block']; // block key
    var slide = parameter['slide']; // slide index
    var row = parameter['row'] && Number(parameter['row']);
    var col = parameter['col'] && Number(parameter['col']);
    var height_size =
      parameter['height_size'] && Number(parameter['height_size']);
    var width_size = parameter['width_size'] && Number(parameter['width_size']);

    // 유효성 검사
    if (
      !grid ||
      !block ||
      !slide ||
      !row ||
      !col ||
      !height_size ||
      !width_size
    ) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    }

    // 검사 영역 초기값
    var max1 = row + height_size;
    var max2 = col + width_size;

    // 반복문 초기값
    var y, x;

    //console.log('[worker 정보] 중복검사 대상정보', parameter);
    //console.log('storage', that['storage']);
    //console.log('반복문 max1(row): ' + max1, ', max2(col): ' + max2);

    // block 시작점 검사
    if (
      grid in that['storage']['viewport'] &&
      slide in that['storage']['viewport'][grid] &&
      row in that['storage']['viewport'][grid][slide] &&
      col in that['storage']['viewport'][grid][slide][row] &&
      that['storage']['viewport'][grid][slide][row][col]['block'] != block
    ) {
      // 다른 블록 존재함
      console.log('[worker 경고!] overlap');
      return false;
    }

    // block 영역 검사
    for (y = row; y < max1; y++) {
      for (x = col; x < max2; x++) {
        //console.log('[worker 정보] 검사영역 row: ' + y + ', col: ' + x);
        if (
          grid in that['storage']['viewport'] &&
          slide in that['storage']['viewport'][grid] &&
          y in that['storage']['viewport'][grid][slide] &&
          x in that['storage']['viewport'][grid][slide][y] &&
          that['storage']['viewport'][grid][slide][y][x]['block'] != block
        ) {
          // 다른 블록 존재함
          console.log('[worker 경고!] overlap');
          return false;
        }
      }
    }

    return true;
  };
  // viewport slide 생성
  GridStructure.prototype.setCreateSlide = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid'];
    var slide = parameter['slide'];

    // 유효성 검사
    if (
      !grid ||
      !slide ||
      !that['storage']['viewport'] ||
      !that['storage']['viewport'][grid] ||
      typeof that['storage']['viewport'][grid][slide] === 'object'
    ) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    } else {
      // 생성
      that['storage']['viewport'][grid][slide] = {};
      return true;
    }
  };
  // viewport slide 삭제
  GridStructure.prototype.setDeleteLastSlide = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid'];

    // 유효성 검사
    if (
      !grid ||
      !that['storage']['viewport'] ||
      !that['storage']['viewport'][grid]
    ) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    }

    // 마지막 슬라이드 index 값
    var last =
      Math.max.apply(null, Object.keys(that['storage']['viewport'][grid])) || 0;
    var min = 2; // 최소 삭제 슬라이드 범위
    var arr = []; // 반환값 - 삭제한 슬라이드 index 리스트
    if (!last || last < min) {
      console.log('[worker 오류!] 범위');
      return false;
    }

    // 마지막 slide 부터 바로전 슬라이드를 검사하며, 비어있는지 확인하여 삭제한다.
    // 반환값은 삭제한 슬라이드 index 리스트
    for (; min <= last; last--) {
      if (
        !that['storage']['viewport'][grid][last] ||
        Object.keys(that['storage']['viewport'][grid][last]).length > 0
      ) {
        break;
      } else if (!delete that['storage']['viewport'][grid][last]) {
        // 제거
        break;
      }
      arr.push(last);
    }

    return arr;
  };
  // viewport 또는 movement 에 block 삽입
  GridStructure.prototype.setInsertBlock = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var storage = parameter['storage']; // storage 구분값
    var grid = parameter['grid']; // grid key
    var block = parameter['block']; // block key
    var slide = parameter['slide']; // slide index
    var row = parameter['row'] && Number(parameter['row']);
    var col = parameter['col'] && Number(parameter['col']);
    var height_size =
      parameter['height_size'] && Number(parameter['height_size']);
    var width_size = parameter['width_size'] && Number(parameter['width_size']);

    // 유효성 검사
    if (
      !/(viewport|movement)/.test(storage) ||
      !grid ||
      !block ||
      !slide ||
      !row ||
      !col ||
      !height_size ||
      !width_size
    ) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    }

    var storage = that['storage'][storage]; // storage
    if (!storage[grid]) {
      storage[grid] = {};
    }
    if (!storage[grid][slide]) {
      storage[grid][slide] = {};
    }

    // 가로, 세로 영역에 block 정보 삽입
    var y, x;
    var range1 = row + height_size; // 가로범위
    var range2 = col + width_size; // 세로범위
    var is = true;
    for (y = row; y < range1; y++) {
      // row
      if (!storage[grid][slide][y]) {
        storage[grid][slide][y] = {};
      }
      for (x = col; x < range2; x++) {
        // col
        if (
          grid in storage &&
          slide in storage[grid] &&
          y in storage[grid][slide] &&
          x in storage[grid][slide][y] &&
          storage[grid][slide][y][x]['block'] != block
        ) {
          console.log('[worker 오류!] 중복', storage[grid][slide][y][x]);
          debugger;
          is = false;
        } else {
          // 추가 (얕은복사/깊은복사 구분하여 실행하자. 주소복사/값복사)
          //storage[grid][slide][y][x] = JSON.parse(JSON.stringify(data));
          storage[grid][slide][y][x] = {
            block: block,
            slide: slide,
            row: row,
            col: col,
            height_size: height_size,
            width_size: width_size,
          };
        }
      }
    }

    return is;
  };
  // viewport 또는 movement 의 block 삭제
  GridStructure.prototype.setDeleteBlock = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var storage = parameter['storage']; // storage 구분값
    var grid = parameter['grid'];
    var block = parameter['block']; // block key
    var slide = parameter['slide']; // slide index
    var row = parameter['row'] && Number(parameter['row']);
    var col = parameter['col'] && Number(parameter['col']);
    var height_size =
      parameter['height_size'] && Number(parameter['height_size']);
    var width_size = parameter['width_size'] && Number(parameter['width_size']);

    // 유효성 검사
    if (
      !/^(viewport|movement)/.test(storage) ||
      !grid ||
      !block ||
      !slide ||
      !row ||
      !col ||
      !height_size ||
      !width_size ||
      !that['storage'][storage] ||
      !that['storage'][storage][grid] ||
      !that['storage'][storage][grid][slide]
    ) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    }

    storage = that['storage'][storage]; // storage

    // 가로, 세로 영역에서 block 정보 삭제
    var y, x;
    var range1 = row + height_size; // 가로범위
    var range2 = col + width_size; // 세로범위
    var is = true;
    for (y = row; y < range1; y++) {
      // row
      for (x = col; x < range2; x++) {
        // col
        if (
          grid in storage &&
          slide in storage[grid] &&
          y in storage[grid][slide] &&
          x in storage[grid][slide][y] &&
          storage[grid][slide][y][x]['block'] == block
        ) {
          // 삭제
          delete storage[grid][slide][y][x];
        } else {
          is = false;
        }
      }
    }

    return is;
  };
  return new GridStructure();
})();

// controller
// Data, Structure 통합 제어
instance['controller'] = (function () {
  function GridController() {
    this.storage = {};
    this.storage['data'] = instance['data']['storage']; // 서버 데이터
    this.storage['structure'] = instance['structure']['storage']; // grid map 데이터
  }
  // grid select, create 작업 (viewport 도 여기서 생성)
  GridController.prototype.grid = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var mode = parameter['mode']; // select, create 작업구분
    var parent = parameter['parent'] || ''; // parent grid key
    var grid = parameter['grid']; // grid key
    var column_count = parameter['column_count']; // grid column_count
    var blocks =
      Array.isArray(parameter['blocks']) &&
      parameter['blocks'].length > 0 &&
      parameter['blocks']; // grid 생성시 해당 grid에 넣을 block 리스트

    /*
		-
		blocks 파라미터값 구조 (grid에 넣을 block 리스트)
		'blocks': [
			{'grid': '기존 grid key', 'block': 'block key'},
			{'grid': '기존 grid key', 'block': 'block key'},
			...
		]
		*/

    // 유효성 검사
    if (!/select|create/.test(mode) || !grid || !column_count) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
      /*}else if(!parent && !regexp.main_grid.test(grid)) { // mian grid 가 아닌 경우, parent 값은 필수값이 된다.
			return false;
		*/
    } else if (parent && typeof that.storage['data'][parent] !== 'object') {
      // parent grid 가 data storage 에 존재하지 않을 경우
      console.log('[worker 오류!] storage');
      return false;
    }

    // structure 에는 없는데 viewport 에는 존재 (structure <-> viewport 데이터 동기화 문제발생)
    if (
      grid in that.storage['structure']['viewport'] &&
      typeof that.storage['data'][grid] !== 'object'
    ) {
      //console.log('[worker 정보] viewport 제거');
      delete that.storage['structure']['viewport'][grid];
    }

    // 신규 grid 에 포함되는 block 검증
    var index;
    var checkup = {}; // blocks 파라미터 검사 통과한 리스트
    var temp = {};
    if (blocks) {
      // 검사
      for (index in blocks) {
        // data storage check
        if (
          !blocks[index] ||
          !blocks[index]['grid'] ||
          !blocks[index]['block']
        ) {
          console.log('[worker 오류!] block');
          return false;
        } else if (
          typeof that.storage['data'][blocks[index]['grid']] !== 'object' ||
          Object.keys(that.storage['data'][blocks[index]['grid']]).length ===
            0 ||
          typeof that.storage['data'][blocks[index]['grid']]['blocks'][
            blocks[index]['block']
          ] !== 'object' ||
          Object.keys(
            that.storage['data'][blocks[index]['grid']]['blocks'][
              blocks[index]['block']
            ],
          ).length === 0
        ) {
          console.log('[worker 오류!] block');
          return false;
        }
        // data storage 에 저장된 block 원본 정보
        temp =
          that.storage['data'][blocks[index]['grid']]['blocks'][
            blocks[index]['block']
          ];
        if (!temp) {
          console.log('[worker 오류!] block');
          return false;
        }
        // viewport storage check (viewport 저장된 정보가 없거나 block key 가 다른경우)
        if (
          typeof that.storage['structure']['viewport'][
            blocks[index]['grid']
          ] !== 'object' ||
          !that.storage['structure']['viewport'][blocks[index]['grid']][
            temp['slide']
          ] ||
          !that.storage['structure']['viewport'][blocks[index]['grid']][
            temp['slide']
          ][temp['row']] ||
          !that.storage['structure']['viewport'][blocks[index]['grid']][
            temp['slide']
          ][temp['row']][temp['col']] ||
          that.storage['structure']['viewport'][blocks[index]['grid']][
            temp['slide']
          ][temp['row']][temp['col']]['block'] != blocks[index]['block']
        ) {
          console.log('[worker 오류!] block');
          return false;
        }
        // block 원본 복사
        checkup[blocks[index]['block']] = JSON.parse(
          JSON.stringify(
            that.storage['data'][blocks[index]['grid']]['blocks'][
              blocks[index]['block']
            ],
          ),
        );
        // block 위치 초기화
        checkup[blocks[index]['block']]['slide'] = 1;
        checkup[blocks[index]['block']]['row'] = 0;
        checkup[blocks[index]['block']]['col'] = 0;
      }
      // 비교 (요청 리스트 개수와 검사된 개수)
      if (blocks.length !== Object.keys(checkup).length) {
        console.log('[worker 오류!] length');
        return false;
      }
      // 기존 block 정보 삭제
      for (index in blocks) {
        // data storage 에 저장된 block 원본 정보
        temp =
          that.storage['data'][blocks[index]['grid']]['blocks'][
            blocks[index]['block']
          ];
        if (!temp) {
          console.log('[worker 오류!] block');
          return false;
        }
        // viewport storage
        if (
          !instance['structure'].setDeleteBlock({
            storage: 'viewport',
            grid: blocks[index]['grid'],
            block: blocks[index]['block'],
            slide: temp['slide'],
            row: temp['row'],
            col: temp['col'],
            height_size: temp['height_size'],
            width_size: temp['width_size'],
          })
        ) {
          continue;
        }
        // data storage
        if (
          !delete that.storage['data'][blocks[index]['grid']]['blocks'][
            blocks[index]['block']
          ]
        ) {
          continue;
        }
      }
    }

    // blocks 콜백 / 조립
    var setResult = function (blocks) {
      var keys;
      var slide, block;
      var possible = {};
      var slide_last_row = {};
      var row, col;

      // viewport grid 생성
      if (
        grid &&
        typeof that.storage['structure']['viewport'][grid] !== 'object'
      ) {
        that.storage['structure']['viewport'][grid] = {};
        that.storage['structure']['viewport'][grid]['1'] = {}; // 최소 슬라이드 1개
        that.storage['structure']['column_count'][grid] = column_count; // column_count 저장
      }

      // grid 내부 block 리스트
      if (
        blocks &&
        typeof blocks === 'object' &&
        Object.keys(blocks).length > 0
      ) {
        console.log('[worker 정보] blocks', blocks);

        // viewport block 삽입
        keys = Object.keys(blocks); // block key 리스트
        while (keys.length) {
          //
          block = keys.shift(); // 순차적으로 블록위치(정렬) 확인
          slide = blocks[block]['slide'] || 1;
          row = 0;
          col = 0;

          // viewport grid의 slide 생성
          if (
            typeof that.storage['structure']['viewport'][grid][slide] !==
            'object'
          ) {
            that.storage['structure']['viewport'][grid][slide] = {};
          }

          // 필수값 확인 및 grid의 column_count 보다 큰 block 은 삭제한다.
          if (
            !blocks[block]['form'] ||
            !blocks[block]['height_size'] ||
            !blocks[block]['width_size'] ||
            column_count < blocks[block]['width_size']
          ) {
            instance['data'].setDeleteBlock({
              grid: grid,
              block: block,
              form: blocks[block]['form'],
            });
            continue;
          }

          // 수동정렬
          if (blocks[block]['row'] && blocks[block]['col']) {
            console.log(
              '[worker 정보] 수동정렬 row/col',
              [blocks[block]['row'], blocks[block]['col']].join('/'),
            );
            //console.log('row', blocks[block]['row']);
            //console.log('col', blocks[block]['col']);
            row = blocks[block]['row'];
            col = blocks[block]['col'];
          }

          // 자동정렬
          if (!blocks[block]['row'] || !blocks[block]['col']) {
            possible = instance['structure'].getPossibleViewport({
              grid: grid,
              column_count: column_count,
              slide: slide,
              height_size: blocks[block]['height_size'],
              width_size: blocks[block]['width_size'],
            });
            if (possible && possible['row'] && possible['col']) {
              row = possible['row'];
              col = possible['col'];
            }
            console.log(
              '[worker 정보] 자동정렬 row/col',
              [possible['row'], possible['col']].join('/'),
            );
            //console.log('row', possible['row']);
            //console.log('col', possible['col']);
          }

          // viewport, movement 중복검사
          if (!row || !col) {
            console.log('[worker 정보] 정렬 재검사');
            keys.push(block); // 재검사를 해야하는 block
            continue;
          } else if (
            !instance['structure'].isOverlapBlock({
              grid: grid,
              block: block,
              slide: slide,
              row: row,
              col: col,
              height_size: blocks[block]['height_size'],
              width_size: blocks[block]['width_size'],
            })
          ) {
            console.log(
              '[worker 경고!] 중복검출 grid/block/slide/row/col/height_size/width_size',
              [
                grid,
                block,
                slide,
                row,
                col,
                blocks[block]['height_size'],
                blocks[block]['width_size'],
              ].join('/'),
            );

            // 중복값이 있을 경우 (수동정렬에서 겹치는 것을 마지막에 정렬하는 것은 다른 정상적 수동정렬 블록에 영향을 미치지 않게 하기위함)
            if (
              !instance['data'].setUpdateBlock({
                grid: grid,
                block: block,
                data: { row: 0, col: 0 },
              })
            ) {
              console.log('[worker 오류!] overlap');
              return false;
            }
            keys.push(block);
            continue;
          }

          // DB 데이터 수정
          if (
            !instance['data'].setUpdateBlock({
              grid: grid,
              block: block,
              data: { row: row, col: col },
            })
          ) {
            console.log('[worker 오류!] update block');
            return false;
          }

          // 해당 block 정보를 viewport 에 추가 (isEqualBlock 로 해당 블록 viewport 존재확인 후 삽입하는 것이 더 안전함)
          if (
            !instance['structure'].setInsertBlock({
              storage: 'viewport',
              grid: grid,
              block: block,
              slide: slide,
              row: row,
              col: col,
              height_size: blocks[block]['height_size'],
              width_size: blocks[block]['width_size'],
            })
          ) {
            console.log(
              '[worker 오류!] insert block (해당 block 정보를 viewport 에 추가오류)',
              [
                grid,
                block,
                slide,
                row,
                col,
                blocks[block]['height_size'],
                blocks[block]['width_size'],
              ].join('/'),
            );
            /*console.log("grid", grid);
						console.log("block", block);
						console.log("slide", slide);
						console.log("row", row);
						console.log("col", col);
						console.log("height_size", blocks[block]['height_size']);
						console.log("width_size", blocks[block]['width_size']);*/
            return false;
          }

          // 해당 slide의 마지막 row 값 저장 (slide 의 높이값을 구하기 위함)
          //slide_last_row[slide] = Object.keys(that.storage['structure']['viewport'][grid][slide]).pop() || 0;
          slide_last_row[slide] =
            Math.max.apply(
              null,
              Object.keys(that.storage['structure']['viewport'][grid][slide]),
            ) || 0;
        } // while
      } // if

      //console.dir(that.storage);

      // slide_total: 슬라이드 개수, slide_last_row: 슬라이드의 마지막 row, blocks: 해당 그리드에 삽입될 블록 데이터
      return {
        slide_total:
          Math.max.apply(
            null,
            Object.keys(that.storage['structure']['viewport'][grid]),
          ) || 0,
        slide_last_row: slide_last_row,
        blocks: blocks,
      };
    };

    switch (mode) {
      case 'select':
        return instance['data'].getSelectGrid({
          parent: parent,
          grid: grid,
          column_count: column_count,
          callback: setResult,
        });
      case 'create':
        return instance['data'].setCreateGrid({
          parent: parent,
          grid: grid,
          column_count: column_count,
          blocks: checkup,
          callback: setResult,
        });
      default:
        console.log('[worker 경고!] ' + mode);
        break;
    }

    console.log('[worker 경고!] return');
    return false;
  };
  GridController.prototype.setUpdateGrid = function (parameter) {
    // 서버와 통신
    var that = this;

    // parameter
    var parameter = parameter || {};

    return instance['data'].setUpdateGrid(parameter);
  };
  // grid delete (viewport 도 여기서 삭제)
  GridController.prototype.setDeleteGrid = function (parameter) {
    // 서버와 통신
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid'];

    // 유효성 검사
    if (!grid || regexp.main_grid.test(grid)) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    } else if (
      typeof that.storage['structure']['viewport'][grid] === 'object'
    ) {
      // viewport grid 삭제
      delete that.storage['structure']['viewport'][grid];
      delete that.storage['structure']['column_count'][grid];
    }

    return instance['data'].setDeleteGrid(parameter);
  };
  // grid 동기화
  GridController.prototype.setSyncGrid = function (parameter) {
    var that = this;

    // storage 에 존재하는 grid 목록을 서버로 보낸다.
    // 해당 grid 중 수정된 grid 정보와 grid 내부 block 정보를 워커가 반환한다.
    // 워커 데이터를 받고, 해당 grid 를 다시 그린다. (변경된 grid의 viewport 등도 다시 넣는다.)

    // 반환값: 변경된 grid 리스트와 grid 내부 block 데이터
  };
  // block 생성/추가
  GridController.prototype.setCreateBlock = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid']; // grid key
    var block = parameter['block']; // block key
    var form = parameter['form']; // block 종류

    var title = parameter['title'] || setTemporarilyTitle(form); // folder 경우
    var article = parameter['article'] || ''; // news 경우 documents 또는 news 고유값
    var template = parameter['template'] || ''; // news 경우 template 고유값
    var height_size =
      parameter['height_size'] && Number(parameter['height_size']); // folder, news 경우
    var width_size = parameter['width_size'] && Number(parameter['width_size']); // folder, news 경우

    var column_count =
      (/^\d+$/.test(parameter['column_count']) && parameter['column_count']) ||
      ''; // grid column_count
    var slide = parameter['slide']; // slide index
    var row = (parameter['row'] && Number(parameter['row'])) || 1; // 지정된 row 에 추가할 경우
    var col = (parameter['col'] && Number(parameter['col'])) || 1; // 지정된 col 에 추가할 경우

    // 유효성 검사
    if (!grid || !block || !form || !slide) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    }

    return instance['data'].setCreateBlock({
      grid: grid,
      block: block,
      form: form,
      title: title,
      article: article,
      template: template,
      height_size: height_size,
      width_size: width_size,
      column_count: column_count,
      slide: slide,
      row: row,
      col: col,
      callback: function (data) {
        if (
          !data ||
          !data['block'] ||
          !data['form'] ||
          !data['slide'] ||
          !data['row'] ||
          !data['col'] ||
          !data['height_size'] ||
          !data['width_size']
        ) {
          console.log('[worker 오류!] data 필수값');
          console.dir(data);
          return false;
        } else if (
          !instance['structure'].setInsertBlock({
            storage: 'movement',
            grid: grid,
            block: data['block'],
            slide: data['slide'],
            row: data['row'],
            col: data['col'],
            height_size: data['height_size'],
            width_size: data['width_size'],
          })
        ) {
          console.log('[worker 오류!] insert block');
          console.log('grid', grid);
          console.log('data', data);
          return false;
        }

        var key,
          result = {};

        // block 데이터에 정렬 데이터 포함하여 반환
        result = that.setRealignBlock({ grid: grid, slide: slide }); // 해당 슬라이드 블록 재정렬 (새로추가되는 블록으로 인해 기존블록들 위치 변경가능성이 있기 때문에 재정렬한다.)
        for (key in data) {
          result[key] = data[key];
        }

        return result;
      },
    });
  };
  GridController.prototype.setDeleteBlock = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid']; // grid key
    var block = parameter['block']; // block key
    var form = parameter['form']; // block 종류

    // 유효성 검사
    if (
      !that.storage['data'][grid] ||
      !that.storage['data'][grid]['blocks'][block]
    ) {
      // data storage 존재여부
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    }

    // 데이터 검사
    switch (form) {
      case 'folder':
        // folder 내부에 블록이 있을경우 삭제불가능
        if (
          typeof that.storage['data'][block] === 'object' &&
          Object.keys(that.storage['data'][block]['blocks']).length > 0
        ) {
          console.log('[worker 오류!] folder 내부 block 존재');
          return false;
        } else if (!that.setDeleteGrid({ grid: block })) {
          console.log('[worker 오류!] folder grid');
          return false;
        }
        break;
    }

    var data = JSON.parse(
      JSON.stringify(that.storage['data'][grid]['blocks'][block]),
    );
    var key,
      result = {};
    /*
		if(instance['structure'].setDeleteBlock({
			"storage": 'viewport', 
			"grid": grid, 
			"block": block, 
			"slide": data['slide'], 
			"row": data['row'],
			"col": data['col'],
			"height_size": data['height_size'],
			"width_size": data['width_size']
		})) {
			if(instance['data'].setDeleteBlock({
				"grid": grid, 
				"block": block,
				"form": that.storage['data'][grid]['blocks'][block]['form']
			})) {
				// block 데이터에 정렬 데이터 포함하여 반환
				result = that.setRealignBlock({'grid': grid, 'slide': data['slide']}); // 해당 슬라이드 블록 재정렬
				for(key in data) {
					result[key] = data[key];
				}
				return result;
			}
		}
		*/
    if (
      instance['data'].setDeleteBlock({
        // 데이터를 먼저 삭제하는 이유는 서버측에서 삭제가 불가능 하다는 판단을 할 수 있기 때문이다.
        grid: grid,
        block: block,
        form: that.storage['data'][grid]['blocks'][block]['form'],
      })
    ) {
      if (
        instance['structure'].setDeleteBlock({
          storage: 'viewport',
          grid: grid,
          block: block,
          slide: data['slide'],
          row: data['row'],
          col: data['col'],
          height_size: data['height_size'],
          width_size: data['width_size'],
        })
      ) {
        // block 데이터에 정렬 데이터 포함하여 반환
        result = that.setRealignBlock({ grid: grid, slide: data['slide'] }); // 해당 슬라이드 블록 재정렬
        for (key in data) {
          result[key] = data[key];
        }
        return result;
      }
    }

    console.log('[worker 경고!] return');
    return false;
  };
  GridController.prototype.setMoveBlock = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var drag =
      (Array.isArray(parameter['drag']) &&
        parameter['drag'].length > 0 &&
        parameter['drag']) ||
      [];

    /*
		-
		drag 파라미터값 구조
		'drag': [
			{'grid': '기존 grid key', 'block': 'block key', 'slide': '', 'move': {'grid': '이동 grid key', 'slide': '', 'row': '', 'col': ''}},
			{'grid': '기존 grid key', 'block': 'block key', 'slide': '', 'move': {'grid': '이동 grid key', 'slide': '', 'row': '', 'col': ''}},
			...
		]
		*/

    //console.log('drag move block');
    //console.dir(drag);

    // 전체 유효성 검사
    var i, max;
    var checkup = [];
    var result = {},
      temp = {};
    var data; // 블록정보
    for (i = 0, max = drag.length; i < max; i++) {
      if (!drag[i]['grid'] || !drag[i]['block'] || !drag[i]['slide']) {
        // 필수값 체크 (현재 위치)
        console.log('[worker 오류!] 1');
        continue;
      } else if (
        typeof drag[i]['move'] !== 'object' ||
        !drag[i]['move']['grid'] ||
        !drag[i]['move']['slide'] ||
        !drag[i]['move']['row'] ||
        !drag[i]['move']['col']
      ) {
        // 필수값 체크 (이동 위치)
        console.log('[worker 오류!] 2');
        continue;
      } else if (
        !that.storage['structure']['viewport'][drag[i]['grid']] ||
        !that.storage['structure']['viewport'][drag[i]['grid']][
          drag[i]['slide']
        ]
      ) {
        // 현재위치 정보 viewport 존재여부
        console.log('[worker 오류!] 3');
        continue;
      } else if (
        !that.storage['structure']['viewport'][drag[i]['move']['grid']]
      ) {
        // 이동위치 grid 정보가 viewport 존재여부
        console.log('[worker 오류!] 4');
        continue;
      } else if (
        !that.storage['data'][drag[i]['grid']] ||
        !that.storage['data'][drag[i]['grid']]['blocks'][drag[i]['block']] ||
        that.storage['data'][drag[i]['grid']]['blocks'][drag[i]['block']][
          'slide'
        ] != drag[i]['slide']
      ) {
        // 현재위치 정보 data storage 존재여부
        console.log('[worker 오류!] 5');
        continue;
      } else if (!that.storage['data'][drag[i]['move']['grid']]) {
        // 이동위치 grid 정보가 data storage 존재여부
        console.log('[worker 오류!] 6');
        continue;
      } else if (
        Number(drag[i]['move']['col']) +
          Number(
            that.storage['data'][drag[i]['grid']]['blocks'][drag[i]['block']][
              'block_width_size'
            ],
          ) -
          1 >
        (that.storage['structure']['column_count'][drag[i]['move']['grid']] ||
          0)
      ) {
        // 이동할(after) col 값이 최대 가로 grid 영역을 초과했을 경우
        console.log('[worker 오류!] 7');
        continue;
      }

      checkup.push(drag[i]);
    }
    result['checkup'] = checkup;

    /*
		-
		반환값 구조 설계 (grid, slide 를 object 의 key 로 잡으면, drag 배열의 반복문에서 가장최근 정렬된 grid의 값으로 덮어쓰기되므로 해당 grid, slide 의 가장마지막 정렬된 최신값을 가져갈 수 있다.)
		result[checkup] = '필터링된 리스트';
		result[grid][slide] = {
			'slide_last_row': '',
			'realign': ''
		};
		return result;
		*/

    for (i = 0, max = checkup.length; i < max; i++) {
      data = JSON.parse(
        JSON.stringify(
          that.storage['data'][checkup[i]['grid']]['blocks'][
            checkup[i]['block']
          ],
        ),
      );

      // 해당 block 정보를 viewport 에서 삭제
      if (
        instance['structure'].setDeleteBlock({
          storage: 'viewport',
          grid: checkup[i]['grid'],
          block: data['block'],
          slide: data['slide'],
          row: data['row'],
          col: data['col'],
          height_size: data['height_size'],
          width_size: data['width_size'],
        })
      ) {
        // 해당 block 정보를 movement 에 추가
        if (
          instance['structure'].setInsertBlock({
            storage: 'movement',
            grid: checkup[i]['move']['grid'],
            block: data['block'],
            slide: checkup[i]['move']['slide'],
            row: checkup[i]['move']['row'],
            col: checkup[i]['move']['col'],
            height_size: data['height_size'],
            width_size: data['width_size'],
          })
        ) {
          // data storage 데이터 수정
          if (
            instance['data'].setUpdateBlock({
              grid: checkup[i]['grid'],
              block: checkup[i]['block'],
              data: {
                slide: checkup[i]['move']['slide'],
                row: checkup[i]['move']['row'],
                col: checkup[i]['move']['col'],
              },
            })
          ) {
            // data storage 데이터 이동
            if (
              checkup[i]['grid'] != checkup[i]['move']['grid'] &&
              !instance['data'].setMoveBlock({
                block: checkup[i]['block'],
                before: { grid: checkup[i]['grid'] },
                after: { grid: checkup[i]['move']['grid'] },
              })
            ) {
              continue;
            }

            /*
						-
						재정렬 기준
						1. row, col 만 이동 (하나의 slide만 재정렬 필요)
						2. slide, row, col 이동 (이전 이후 slide 재정렬 필요)
						3. grid, slide, row, col 이동 (이전 이후 grid의 slide 재정렬 필요)
						*/

            // 과거(before) block이 위치한 grid 재정렬
            if (
              checkup[i]['grid'] != checkup[i]['move']['grid'] ||
              checkup[i]['slide'] != checkup[i]['move']['slide']
            ) {
              // 로그
              temp = that.setRealignBlock({
                grid: checkup[i]['grid'],
                slide: checkup[i]['slide'],
              });
              if (!result[checkup[i]['grid']]) {
                result[checkup[i]['grid']] = {};
              }
              if (!result[checkup[i]['grid']][checkup[i]['slide']]) {
                result[checkup[i]['grid']][checkup[i]['slide']] = {};
              }
              result[checkup[i]['grid']][checkup[i]['slide']] = {
                slide_last_row: temp['slide_last_row'][checkup[i]['slide']],
                realign: temp['realign'],
              };
            }
            // 이동(after) block이 위치한 grid 재정렬
            temp = that.setRealignBlock({
              grid: checkup[i]['move']['grid'],
              slide: checkup[i]['move']['slide'],
            });
            if (!result[checkup[i]['move']['grid']]) {
              result[checkup[i]['move']['grid']] = {};
            }
            if (
              !result[checkup[i]['move']['grid']][checkup[i]['move']['slide']]
            ) {
              result[checkup[i]['move']['grid']][checkup[i]['move']['slide']] =
                {};
            }
            result[checkup[i]['move']['grid']][checkup[i]['move']['slide']] = {
              slide_last_row:
                temp['slide_last_row'][checkup[i]['move']['slide']],
              realign: temp['realign'],
            };
          } else {
            // data storage 오류로 viewport 추가, movement 삭제 (복구)
          }
        }
      }
    }

    //console.log('move block 결과값');
    //console.dir(result);
    return result;
  };
  // grid -> slide -> block 자동정렬
  GridController.prototype.setRealignBlock = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid']; // grid key
    var column_count =
      parameter['column_count'] ||
      that.storage['structure']['column_count'][grid]; // grid column_count
    var slide = parameter['slide']; // 재정렬할 슬라이드 번호

    // 유효성 검사
    if (
      !grid ||
      !column_count ||
      !slide ||
      !that.storage['structure']['viewport'][grid]
    ) {
      console.log('[worker 오류!] 유효성');
      console.log(parameter);
      return false;
    }

    var slide_last_row = {};
    var realign = []; // 위치 변경이 발생한 block 정보 저장

    // while
    var y, x; // row, col
    //var max1 = Object.keys(that.storage['structure']['viewport'][grid][slide]).pop() || 0;
    var max1 =
      Math.max.apply(
        null,
        Object.keys(that.storage['structure']['viewport'][grid][slide]),
      ) || 0; // block이 들어있는 총 row의 값 (마지막 row 값)
    var max2 = column_count; // col 최대값

    // row 리스트
    var row_list = Object.keys(
      that.storage['structure']['viewport'][grid][slide],
    );

    /*
		// 논리적 알고리즘
		if(반복문에 걸리는 block이 있음) { 
			if(위로 빈공간이 있다 === true) {
				// 위로 이동한다
			}else {
				if(현재 block 영역에 that.storage['structure']['movement'] 겹치는 영역 === true) {
					// 아래로 무조건 이동한다
				} 
			}
			x += block_width_size; // 현재 block 에 대한 검사가 끝났으므로, 다음 col 에 해당하는 block 으로 이동
			continue innerwhile;
		}
		*/

    // slide 의 row 리스트만큼 반복문을 돌면서 검사
    var block = {};
    var possible_info = {};
    outerwhile: while (row_list.length) {
      // row

      //
      y = row_list.shift();
      x = 1; // 첫번째 col 부터 검사

      innerwhile: while (x <= max2) {
        // col

        if (
          that.storage['structure']['viewport'][grid][slide][y] &&
          that.storage['structure']['viewport'][grid][slide][y][x]
        ) {
          // 기존 정렬되어있는 block 검사

          // block 정보
          block = that.storage['structure']['viewport'][grid][slide][y][x];

          // block 위치 검사 정보
          possible_info = {};

          // ---------- ---------- ---------- ---------- ---------- ----------

          // 1. 현재 block의 row 에서 위로 이동할 수 있는 row가 있는지 확인 - 첫번째 row는 검사할 필요 없다.
          possible_info = instance['structure'].getPossibleTopEmpty({
            grid: grid,
            slide: slide,
            row: block['row'],
            col: block['col'],
            height_size: block['height_size'],
            width_size: block['width_size'],
          });
          if (possible_info['bool'] === false) {
            // 2. 현재 block 영역에서 movement와 중복되는 영역이 있는지 확인
            possible_info = instance['structure'].getPossibleMovement({
              grid: grid,
              slide: slide,
              row: block['row'],
              col: block['col'],
              height_size: block['height_size'],
              width_size: block['width_size'],
            });
          }

          // ---------- ---------- ---------- ---------- ---------- ----------

          // 이동가능한 위치가 있을 경우
          if (possible_info['bool'] === true) {
            // DB 데이터 수정
            if (
              !instance['data'].setUpdateBlock({
                grid: grid,
                block: block['block'],
                data: { row: possible_info['row'] },
              })
            ) {
              console.log('[worker 오류!] update block');
              return false;
            }

            // 해당 block 정보를 movement 에 추가
            if (
              !instance['structure'].setInsertBlock({
                storage: 'movement',
                grid: grid,
                block: block['block'],
                slide: slide,
                row: possible_info['row'],
                col: block['col'],
                height_size: block['height_size'],
                width_size: block['width_size'],
              })
            ) {
              console.log(
                '[worker 오류!] insert block (해당 block 정보를 movement 에 추가)',
              );
              console.log('grid', grid);
              console.log('block', block['block']);
              console.log('slide', slide);
              console.log('row', possible_info['row']);
              console.log('col', block['col']);
              console.log('height_size', block['height_size']);
              console.log('width_size', block['width_size']);
              return false;
            }

            // 해당 block 정보를 viewport 에서 삭제
            if (
              !instance['structure'].setDeleteBlock({
                storage: 'viewport',
                grid: grid,
                block: block['block'],
                slide: slide,
                row: block['row'],
                col: block['col'],
                height_size: block['height_size'],
                width_size: block['width_size'],
              })
            ) {
              console.log('[worker 오류!] delete block');
              return false;
            }

            // 해당 block 이동 (realign 에 추가)
            realign.push({
              grid: grid,
              block: block['block'],
              slide: slide,
              row: possible_info['row'],
              col: block['col'],
            });
          }

          // ---------- ---------- ---------- ---------- ---------- ----------

          x += Number(block['width_size']); // 현재 block 에 대한 검사가 끝났으므로, 다음 col 에 해당하는 block 으로 이동
          continue innerwhile;
        }

        // col 검사 값 증가
        x += 1;
      }

      // viewport 에서 비어있는 row 제거
      if (
        that.storage['structure']['viewport'][grid][slide][y] &&
        Object.keys(that.storage['structure']['viewport'][grid][slide][y])
          .length === 0
      ) {
        delete that.storage['structure']['viewport'][grid][slide][y];
      }
    }

    // ---------- ---------- ---------- ---------- ---------- ----------

    // that.storage['structure']['movement'] -> that.storage['structure']['viewport']
    if (
      grid in that.storage['structure']['movement'] &&
      slide in that.storage['structure']['movement'][grid]
    ) {
      var movement_row;
      for (movement_row in that.storage['structure']['movement'][grid][slide]) {
        // row

        // that.storage['structure']['viewport'], that.storage['structure']['movement'] 의 col 값을 결합
        if (!that.storage['structure']['viewport'][grid][slide][movement_row]) {
          that.storage['structure']['viewport'][grid][slide][movement_row] = {};
        }

        //
        if (
          Object.keys(
            that.storage['structure']['viewport'][grid][slide][movement_row],
          ).length === 0
        ) {
          that.storage['structure']['viewport'][grid][slide][movement_row] =
            JSON.parse(
              JSON.stringify(
                that.storage['structure']['movement'][grid][slide][
                  movement_row
                ],
              ),
            );
        } else {
          // viewport 의 기존 row 위치 block 정보 + movement 의 이동 row 위치 block 정보
          that.storage['structure']['viewport'][grid][slide][movement_row] =
            JSON.parse(
              (
                JSON.stringify(
                  that.storage['structure']['viewport'][grid][slide][
                    movement_row
                  ],
                ) +
                JSON.stringify(
                  that.storage['structure']['movement'][grid][slide][
                    movement_row
                  ],
                )
              ).replace(/}{/g, ','),
            );
        }
      }

      // that.storage['structure']['movement'] 에서 해당 grid 제거
      delete that.storage['structure']['movement'][grid][slide];
    }

    // ---------- ---------- ---------- ---------- ---------- ----------

    // 해당 slide의 마지막 row 값 저장 (slide 의 높이값을 구하기 위함)
    //slide_last_row[slide] = (Object.keys(that.storage['structure']['viewport'][grid][slide]).pop() || 0);
    slide_last_row[slide] =
      Math.max.apply(
        null,
        Object.keys(that.storage['structure']['viewport'][grid][slide]),
      ) || 0;

    return { slide_last_row: slide_last_row, realign: realign };
  };
  // 폴더 관련 수정 (타이틀)
  GridController.prototype.setUpdateFolder = function (parameter) {
    var that = this;

    // parameter
    var parameter = parameter || {};
    var grid = parameter['grid']; // grid key
    var block = parameter['block']; // folder key
    var title = parameter['title'] || ''; // setTemporarilyTitle('folder');

    //
    //console.log('parameter');
    //console.dir(parameter);

    return instance['data'].setUpdateBlock({
      grid: grid,
      block: block,
      data: { title: title },
    });
  };
  return new GridController();
})();

// worker event
self.onmessage = function (event) {
  var data = event['data'] || {};
  var request = data['request'] || {}; // 요청 정보
  var response = data['response'] || {}; // 응답 정보

  // 온라인(true) / 오프라인(false)
  if ('network' in data) {
    network = data['network'];
  }

  // response
  if (typeof response['parameter'] !== 'object') {
    response['parameter'] = {};
  }
  if (
    request['instance'] &&
    request['call'] &&
    typeof instance[request['instance']] === 'object' &&
    typeof instance[request['instance']][request['call']] === 'function'
  ) {
    response['parameter']['worker'] = instance[request['instance']][
      request['call']
    ](request['parameter']);
  } else {
    response['parameter']['worker'] = false;
  }

  // 워커를 호출한 곳으로 결과 메시지를 전송한다
  //postMessage({'request': request, 'response': response});
  self.postMessage(data);
};
