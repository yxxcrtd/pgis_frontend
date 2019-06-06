import {baseUrl, config, formatData} from "./config";
import {list, add, del, edit, search, reset, dictList} from "./getData";

const apiMethods = {
  methods: {
    /*
    * 查询字典
    * path: 字典请求路径
    * value: 字典查询的值
    * */
     _dictList(path, value){
      dictList(baseUrl+'/dict/findByCode' + path).then((res) => {
        if (res.data.code == 200) {
          this.list.forEach(function(item) {
            res.data.data.forEach(function(i) {
              if (item[value] == i.value.slice(0, 1)) {
                item[value] = i.value.substr(2)
              }
            })
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /*
    * 弹框类别标记
    * type: 'add'-->添加弹框， 'edit'-->编辑弹框
    * addTitle: 创建弹框的标题
    * edit: 编辑弹框的标题
    * row: 编辑弹框时点击的行信息
    * */
    _clickFlag(type, addTitle, editTitle, row) {
       this.dialogShow = true;
       this.dialogType = type;
       if (type == 'add') {
         this.dialogTitle = addTitle;
         this.dialogInfo = {};
         row = ''
       }else if (type == 'edit') {
         this.dialogTitle = editTitle;
         //调用编辑方法
         this._edit(row)
       }
    },
    /*
    * 编辑：获取所选编辑行的已有信息
    * */
    _edit(row) {
       edit(baseUrl + this.path + "/" + row.id).then((res) => {
         if(res.data.code == 200) {
           this.dialogInfo = res.data.data
           if(this.path == '/inducePlate') {
             this.center[0] = parseFloat(this.dialogInfo.location.split(',')[0])
             this.center[1] = parseFloat(this.dialogInfo.location.split(',')[1])
           }
         }
       }).catch((err) => {
         console.log(err)
       })
     },
    /*
    * 新增/编辑弹框
    * */
    _add_submit(info, path) {
      if (this.dialogType == 'add') {
        this._add(info, path)
      }else if(this.dialogType == 'edit') {
        this._submit(info)
      }else if(this.dialogType == 'reset') {
        this._reset(info)
      }
    },
    /*
    * 列表初始化
    * */
    _list(page){
      this.pagination = false;
      list(baseUrl + this.path + '/list' + '/' + page + '/' + this.num).then((res) => {
          if (res.data.code == 200) {
            this.list = res.data.data.content || res.data.data;
            this.count.numberOfElements = res.data.data.numberOfElements;
            this.count.totalElements = res.data.data.totalElements;
            this.listLoading = false;
            formatData(this.list, this.path)
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    /*
    * 新增
    * info: 新增信息
    * */
    _add(info, path) {
      this.$refs.dialogInfo.validate((valid) => {
          if (valid) {
            if (path == '/user') {
              info.type = 0;  //用户类型中的普通用户
            }
            let formData = JSON.stringify(info);
            add(baseUrl + this.path + '/save', formData, config).then((res) => {
              if (res.data.code == 200) {
                this.$message({showClose: true, message: res.data.message, type: "success"})
                this.dialogShow = false;
                this.dialogInfo = {};
                this._list(this.page)
              }else if(res.data.code == -200 || res.data.code == false) {
                this.$message({showClose: true, message: res.data.message, type: "error"})
              }
            }).catch((err) => {
              console.log(err)
            })
          }else {
            this.dialogInfo = {};
            return false
          }
      })
    },
    /*
    * 删除
    * */
    _delId(row) {
      this.dialogDel = true;
      this.delRow = row;
      console.log(this.delRow)
    },
    _del(row, status){
      del(baseUrl + this.path + '/' + status + '/' + row.id).then((res) => {
        if (res.data.code == 200) {
          this.$message({showClose: true, message: res.data.message, type: "success"})
          this.dialogDel = false;
          this._list(this.page, this.dictPath1, this.dictValue1, this.dictPath2, this.dictValue2);
        }else if(res.data.code == -200  || res.data.code == false) {
          this.$message({showClose: true, message: res.data.message, type: "error"})
        }
      })
    },
    /*
    * 修改
    * info: 更改信息
    * */
    _submit(info) {
      this.dialogInfo = info;
      let formData = JSON.stringify(info);
      edit(baseUrl + this.path + '/update', formData, config).then((res) => {
        if (res.data.code == 200) {
          this.$message({showClose: true, message: res.data.message, type: "success"})
          this.dialogShow = false;
          this.dialogInfo = {};
          this._list(this.page);
        }else if(res.data.code == -200  || res.data.code == false) {
          this.$message({showClose: true, message: res.data.message, type: "error"})
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /*
   * 查询
   * info: 查询信息
   * */
    _search(info) {
      this.pagination = true;
      let formData = JSON.stringify(info);
      search(baseUrl + this.path + '/list' + '/' + this.page + '/' + this.num, formData, config).then((res) => {
        if (res.data.code == 200) {
          this.list = res.data.data.content
          this.count.numberOfElements = res.data.data.numberOfElements;
          this.count.totalElements = res.data.data.totalElements;
          formatData(this.list, this.path)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /*
    * 分页信息
    * val: element默认
    * */
    handleCurrentChange(val) {
      this.page = Number(`${val}`)
      if (this.pagination) {
        let formData = JSON.stringify(this.searchInfo)
        search(baseUrl + this.path + '/list' + '/' + this.page + '/' + this.num, formData, config).then((res) => {
          if (res.data.code == 200) {
            this.list = res.data.data.content
            this.count.numberOfElements = res.data.data.numberOfElements;
            this.count.totalElements = res.data.data.totalElements;
            formatData(this.list)
          }
        })
      }else {
        this._list(this.page)
      }
    }
  }
}

export default apiMethods
