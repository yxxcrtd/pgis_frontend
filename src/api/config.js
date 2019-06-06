// export const baseUrl = 'http://139.198.2.158:8081/api'
// export const baseUrl = 'http://114.255.78.182:8080/api'
// export const baseUrl = 'http://182.92.76.73:8091/api'
export const baseUrl = 'api'

export const config = {
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
}

export function formatData(list, path) {
  //user列表
  if (path == '/user') {
    list.forEach(function(item) {
      if (item['type'] == 1) {
        item['type'] = '系统管理员'
      }else if (item['type'] == 0) {
        item['type'] = '普通用户'
      }
    })
  }
  //停车场管理
  if(path == '/parking') {
    list.forEach(function(item) {
      //类型
      if (item['type'] == 1) {
        item['type'] = '室内'
      }else if (item['type'] == 2) {
        item['type'] = '室外'
      }else if (item['type'] == 3) {
        item['type'] = '占道'
      }else if (item['type'] == 4) {
        item['type'] = '机械'
      }
      //接入方式
      if (item['accessMode'] == 1) {
        item['accessMode'] = '地磁'
      }else if (item['accessMode'] == 2) {
        item['accessMode'] = '系统'
      }
    })
  }
  //sim卡管理
  if(path == '/simCard') {
    list.forEach(function(item) {
      //运营商
      if (item['operatorType'] == 1) {
        item['operatorType'] = '移动'
      }else if(item['operatorType'] == 2) {
        item['operatorType'] = '联通'
      }else if(item['operatorType'] == 3) {
        item['operatorType'] = '电信'
      }
      //sim-网络模式
      if (item['networkMode'] == 1) {
        item['networkMode'] = '3G'
      }else if(item['networkMode'] == 2) {
        item['networkMode'] ='4G'
      }
      //sim-设备状态
      if(item['deviceStatus'] == 1) {
        item['deviceStatus'] = '正常'
      }else if(item['deviceStatus'] == 2) {
        item['deviceStatus'] = '异常'
      }
    })
  }
  //控制卡管理
  if (path == '/controlCard') {
    list.forEach(function(item) {
      //设备状态
      if (item['deviceStatus'] == 1) {
        item['deviceStatus'] = '正常'
      }else if(item['deviceStatus'] == 0) {
        item['deviceStatus'] = '异常'
      }
      //初始化状态
      if (item['initStatus'] == 1) {
        item['initStatus'] = '正常'
      }else if(item['initStatus'] == 0) {
        item['initStatus'] = '异常'
      }
    })
  }
  //屏幕管理
  if (path == '/screen') {
    list.forEach(function(item) {
      //屏幕类型
      if (item['type'] == 1) {
        item['type'] = '车位数屏'
      }else if(item['type'] == 2) {
        item['type'] = '文字信息屏'
      }
    })
  }
  //节目管理
  if (path == '/program') {
    list.forEach(function(item) {
      //节目状态
      if (item['status'] == -1) {
        item['status'] = '审核失败'
      }else if (item['status'] == -2) {
        item['status'] = '发布失败'
      }else if (item['status'] == 0) {
        item['status'] = '待审核'
      }else if (item['status'] == 1) {
        item['status'] = '待发布'
      }else if (item['status'] == 2) {
        item['status'] = '发布成功'
      }
    })
  }
  //地磁管理
  if (path == '/geoSensor') {
    list.forEach(function(item) {
      //类型
      if (item['type'] == 1) {
        item['type'] = '流量地磁'
      }else if(item['type'] == 2) {
        item['type'] = '泊位地碰'
      }
      //设备状态
      if (item['deviceStatus'] == 1) {
        item['deviceStatus'] = '正常'
      }else if(item['deviceStatus'] == 2) {
        item['deviceStatus'] = '异常'
      }
    })
  }
  //节目管理&&网关管理
  if (path == '/repeater' || path == '/gateway') {
    list.forEach(function(item) {
      //设备状态
      if (item['deviceStatus'] == 1) {
        item['deviceStatus'] = '正常'
      }else if(item['deviceStatus'] == 2) {
        item['deviceStatus'] = '异常'
      }
    })
  }
  //诱导牌管理
  if (path == '/inducePlate') {
    list.forEach(function(item) {
      //等级
      if (item['level'] == 1) {
        item['level'] = '一级'
      }else if (item['level'] == 2) {
        item['level'] = '二级'
      }else if (item['level'] == 3) {
        item['level'] = '三级'
      }else if (item['level'] == 4) {
        item['level'] = 'LED'
      }
    })
  }
}
