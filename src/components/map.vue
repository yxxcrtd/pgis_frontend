<template>
    <div>
        <div id="map"></div>
    </div>
</template>

<script>
    import {baseUrl} from 'api/config'

    export default {
        data() {
            return {
                coordinate: '',
                inducePlateList: []
            }
        },
        mounted() {
            this._initMap()
        },
        methods:{
            _initMap() {
                axios.post(baseUrl + '/config/findByCode/coordinate').then((res) => {
                    if (res.data.code == 200) {
                        this.coordinate = res.data.data[0].value

                        // 默认显示系统配置的地图中心坐标点
                        var map = new AMap.Map('map', {
                          resizeEnable: true,
                          zoom: 16,
                          scrollWheel: false
                        });
                        map.setCenter([this.coordinate.split(',')[0], this.coordinate.split(',')[1]])

                        // 添加地图工具栏
                        AMap.plugin([ 'AMap.ToolBar', 'AMap.Scale' ],
                        function() {
                            map.addControl(new AMap.ToolBar());
                            map.addControl(new AMap.Scale());
                        });
                      //-----------------------------------------------------------
                      axios.post(baseUrl + '/inducePlate/list').then((res) => {
                        if (res.data.code == 200) {
                          this.inducePlateIdList = res.data.data
                          var _this = this
                          this.inducePlateIdList.forEach(function(item) {
                            if (item['level'] == 2) {
                              AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
                                var marker = new AMap.Marker({
                                  map: map,
                                  zIndex: 999,
                                  position: [item['location'].split(',')[0], item['location'].split(',')[1]],
                                  icon: new AMap.Icon({
                                    size: new AMap.Size(35, 50),
                                    image: "http://file.igoosd.com/icon_map.png",
                                    imageOffset: new AMap.Pixel(0, 0)
                                  })
                                });
                                function openInfoWin() {
                                  axios.post(baseUrl + '/inducePlate/info/' + item.id).then((res) => {
                                    if (res.data.code == 200) {
                                      var carScreen, infoScreen;
                                      carScreen = res.data.data.parkingList[0]
                                      infoScreen = res.data.data.programList[0]
                                      function fangxiang(item){
                                        if(!carScreen) {
                                          return " "
                                        }else {
                                          if(item.id == 10 || item.id == 14) {
                                            return "src='http://file.igoosd.com/inducePlate/right.png' width=100% height=100%"
                                          }
                                          if(item.id == 9 || item.id == 13) {
                                            return "src='http://file.igoosd.com/inducePlate/straight.png' width=100% height=100%"
                                          }
                                          if(item.id == 11 || item.id == 12) {
                                            return "src='http://file.igoosd.com/inducePlate/left.png' width=100% height=100%"
                                          }
                                        }
                                      }
                                      function carScreenName() {
                                        if(!carScreen) {
                                          return " "
                                        }else {
                                          return carScreen.name
                                        }
                                      }
                                      function lotRemainCount(){
                                        if(!carScreen) {
                                          return " "
                                        }else {
                                          return carScreen.lotRemainCount
                                        }
                                      }
                                      function changeContent(program) {
                                        if(program) {
                                          var showType = program.showType;
                                          var content = JSON.parse(program.content);
                                          var div = document.createElement('div')
                                          if(showType == 0){
                                           return div.innerHTML = JSON.parse(program.content)
                                          } else if (showType == 1) {
                                            var interval = program.interval ? program.interval : 100;
                                            var step = program.step ? program.step : 1;
                                            var marquee = document.createElement("marquee");
                                            marquee.scrollDelay = interval;
                                            marquee.scrollAmount = step;
                                            marquee.loop = -1;
                                            marquee.behavior = 'scroll';
                                            marquee.direction = 'left';
                                            marquee.style.lineHeight = program.height + 'px';
                                            marquee.innerHTML = JSON.parse(program.content);
                                            div.innerHTML = "";
                                            div.appendChild(marquee);
                                            return  div.innerHTML;
                                          } else if (showType == 2){
                                            var interval = program.interval ? program.interval : 2000;
                                            var index =1;
                                            var len = content.length;
                                            div.innerHTML=content[0]
                                            this.timer = setInterval(function () {
                                              div.innerHTML=content[index];
                                              index = (index +1)%len;
                                            },interval)
                                          }
                                        }
                                      }
                                      var infoWindow = new SimpleInfoWindow({
                                        infoTitle: '<strong><%= title %></strong>',
                                        infoBody: '<div class="my-desc"><%= body %></div>',
                                        infoTplData: {
                                          title: `<h5>二级诱导牌</h5>`,
                                          body: `<div style=' width: 190px; height: 65px; background: #00f;  padding: 5px; margin-bottom: 5px;'>
                                                    <div class="border" style="border: 2px solid #fff;padding: 5px;">
                                                      <div class="content" style="width: 100%; height: 40px; display: flex;justify-content: center;align-items: center;">
                                                            <div class="icon-left" style="width: 20px; height: 20px;">
                                                              <img  ` + fangxiang(item) + `alt="">
                                                            </div>
                                                            <div class="title" style="width: 80px; text-align: center">
                                                                <p style="line-height: 20px; color: #fff;
                                                                font-size: 14px; font-weight: 700;
                                                                letter-spacing: 2px; font-family: "PingFang SC,Microsoft YaHei UI,Microsoft YaHei" >`
                                          + carScreenName() +
                                          `</p>
                                                            </div>
                                                            <div class="view" style="width: 50px; height: 35px; background: #000; text-align: center;margin: 0 5px; padding: 0 5px;">
                                                               <p style="color:#0f0; font-size: 20px; font-weight: 700; line-height: 35px;">`
                                          + lotRemainCount() +
                                          `</p>
                                                            </div>
                                                            <div class="icon-right" style="width: 20px; height: 20px;">
                                                              <img width="100%" height="100%" src="http://file.igoosd.com/inducePlate/indoor.png" alt="">
                                                            </div>
                                                      </div>
                                                    </div>
                                                 </div>
                                                 <div style=' height: 35px; width:190px; background: #000;'>
                                                    `+ changeContent(infoScreen) + `
                                                 </div>`
                                        },
                                        offset: new AMap.Pixel(8, -25) // 基点指向marker的头部位置s
                                      });
                                    }
                                    infoWindow.open(map, marker.getPosition());
                                  })
                                }
                                AMap.event.addListener(marker, 'click', function() {
                                  openInfoWin();
                                });
                              });
                            }else if(item['level'] == 3) {
                              AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
                                var marker = new AMap.Marker({
                                  map: map,
                                  zIndex: 999,
                                  position: [item['location'].split(',')[0], item['location'].split(',')[1]],
                                  icon: new AMap.Icon({
                                    size: new AMap.Size(35, 50),
                                    image: "http://file.igoosd.com/icon_map.png",
                                    imageOffset: new AMap.Pixel(0, -50)
                                  })
                                });
                                function openInfoWin() {
                                  axios.post(baseUrl + '/inducePlate/info/' + item.id).then((res) => {
                                    if (res.data.code == 200) {
                                      var carScreen = res.data.data.parkingList[0]
                                      function fangxiang(item){
                                        if(!carScreen) {
                                          return " "
                                        }else {
                                          if(item.id == 15) {
                                            return "src='http://file.igoosd.com/inducePlate/left.png' width=100% height=100%"
                                          }else {
                                            return "src='http://file.igoosd.com/inducePlate/right.png' width=100% height=100%"
                                          }
                                        }
                                      }
                                      function carScreenName() {
                                        if(!carScreen) {
                                          return " "
                                        }else {
                                          return carScreen.name
                                        }
                                      }
                                      function lotRemainCount(){
                                        if(!carScreen) {
                                          return " "
                                        }else {
                                          return carScreen.lotRemainCount
                                        }
                                      }
                                      var infoWindow = new SimpleInfoWindow({
                                        infoTitle: '<strong><%= title %></strong>',
                                        infoBody: '<div class="my-desc"><%= body %></div>',
                                        infoTplData: {
                                          title:  `<h5>三级诱导牌</h5>`,
                                          body: `<div style='width: 120px; height:100px; background: #00f; border-radius: 5px; padding: 5px;'>
                                                    <div class="border" style="width: 110px; height:90px; border: 2px solid #fff;border-radius: 5px;padding: 5px;">
                                                      <div class="title" style="width: 100%; height: 35px; text-align: center">
                                                          <p style="line-height: 35px; color: #fff;
                                                          font-size: 14px; font-weight: 700;
                                                          letter-spacing: 2px; font-family: "PingFang SC,Microsoft YaHei UI,Microsoft YaHei" >`
                                          + carScreenName() +
                                          `</p>
                                                      </div>
                                                      <div class="content" style="width: 100%; height: 45px; display: flex;justify-content: center;align-items: center;">
                                                            <div class="icon-left" style="width: 20px; height: 20px;">
                                                              <img  ` + fangxiang(item) + ` alt="">
                                                            </div>
                                                            <div class="view" style="width: 50px; height: 35px; background: #000; text-align: center;margin: 0 5px; padding: 0 5px;">
                                                               <p style="color:#0f0; font-size: 20px; font-weight: 700; line-height: 35px;">`
                                          + lotRemainCount() +
                                          `</p>
                                                            </div>
                                                            <div class="icon-right" style="width: 20px; height: 24px;">
                                                              <img width="100%" height="100%" src="http://file.igoosd.com/inducePlate/indoor.png" alt="">
                                                            </div>
                                                      </div>
                                                    </div>
                                                 </div>`
                                        },
                                        offset: new AMap.Pixel(8, -25) // 基点指向marker的头部位置s
                                      });
                                    }
                                    infoWindow.open(map, marker.getPosition());
                                  })
                                }
                                AMap.event.addListener(marker, 'click', function() {
                                  openInfoWin();
                                });
                              });
                            }else if(item['level'] == 4) {
                              AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
                                var i=0, flag=false;
                                var marker = new AMap.Marker({
                                  map: map,
                                  zIndex: 999,
                                  position: [item['location'].split(',')[0], item['location'].split(',')[1]],
                                  icon: new AMap.Icon({
                                    size: new AMap.Size(35, 50),
                                    image: "http://file.igoosd.com/icon_map.png",
                                    imageOffset: new AMap.Pixel(0, -101)
                                  })
                                });
                                function openInfoWin(i) {
                                  axios.post(baseUrl + '/inducePlate/info/' + item.id).then((res) => {
                                    if (res.data.code == 200) {
                                      var infoScreenContent = [];
                                      var infoScreen = res.data.data.programList[0]
                                      if (!res.data.data.programList[0].id) {
                                        infoScreenContent.push(res.data.data.programList[0].content)
                                        i = 0;
                                      }else {
                                        infoScreenContent = JSON.parse(res.data.data.programList[0].content)
                                      }
                                      if (i == infoScreenContent.length - 2) {
                                        flag = true;
                                      }
                                      function changeContent(program) {
                                        if(program) {
                                          var showType = program.showType;
                                          var content = JSON.parse(program.content);
                                          var div = document.createElement('div')
                                          if(showType == 0){
                                            return div.innerHTML = JSON.parse(program.content)
                                          } else if (showType == 1) {
                                            var interval = program.interval ? program.interval : 100;
                                            var step = program.step ? program.step : 1;
                                            var marqueeDom = document.createElement("marquee");
                                            marqueeDom.scrollDelay = interval;
                                            marqueeDom.scrollAmount = step;
                                            marqueeDom.loop = -1;
                                            marqueeDom.behavior = 'scroll';
                                            marqueeDom.direction = 'left';
                                            marqueeDom.style.lineHeight = program.height + 'px'
                                            marqueeDom.innerHTML = JSON.parse(program.content)
                                            div.innerHTML = "";
                                            div.appendChild(marqueeDom);
                                            return  div.innerHTML;
                                          } else if (showType == 2){
                                            var interval = program.interval ? program.interval : 2000;
                                            var index = 1;
                                            var len = content.length;
                                             return div.innerHTML=content[i]
                                            setInterval(function () {
                                              div.innerHTML=content[index];
                                              index = (index +1)%len;
                                            },interval)
                                          }
                                        }
                                      }
                                      var infoWindow = new SimpleInfoWindow({
                                        infoTitle: '<strong><%= title %></strong>',
                                        infoBody: '<div class="my-desc"><%= body %></div>',
                                        infoTplData: {
                                          title: `<h5>全点阵LED信息屏</h5>`,
                                          body: `<div id='test' style='width: 200px; height: 150px; background: #000;  padding: 5px; margin-bottom: 5px;'>
                                                      ` + changeContent(infoScreen) + `
                                                   </div>`
                                        },
                                        offset: new AMap.Pixel(8, -25) // 基点指向marker的头部位置
                                      });
                                      infoWindow.open(map, marker.getPosition());
                                    }
                                  })
                                }
                                AMap.event.addListener(marker, 'click', function() {
                                  openInfoWin(i);
                                  if(flag) {
                                    i = 0;
                                    flag = false;
                                  }else {
                                    i++;
                                  }
                                });
                              });
                            }
                          })
                        }
                      })
                    }
                })
            }
        }
    }
</script>

<style scoped>
  #map {
    width: 100%;
    height: 800px;
  }
</style>
