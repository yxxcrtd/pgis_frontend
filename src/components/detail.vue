<template>
  <div  id="root" :style="'width:' + pro.width + 'px;' + 'height:' + pro.height + 'px;'">
    <div id="cell" ref="cell" :style="'width:' + pro.width + 'px;' + 'height:' + pro.height + 'px;'">
    </div>
  </div>
</template>

<script type="text/javascript">
  import {baseUrl} from 'api/config'
  export default  {
    props: ['pro'],
    data() {
     return {
       program: this.pro,
     }
    },

    watch: {
      pro(newval) {
        clearInterval(this.timer)
        this.changeContent(newval)
      },

    },
    mounted() {
      this.changeContent(this.pro)
    },
    methods: {
      changeContent(program) {
        if(program) {
          var showType = program.showType;
          var content = program.content;
          var div = this.$refs.cell;
          if(showType == 0){
            div.innerHTML = content[0];
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
            marqueeDom.innerHTML = content[0];
            div.innerHTML = "";
            div.appendChild(marqueeDom);
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
    }
  }
</script>

<style  lang="css" rel="stylesheet/css">
#root {
  display: table;
  margin: 0 auto;
  padding: 0;
  border: none;
}
#cell {
  background: #000;
  vertical-align: middle;
  margin: 0;
  padding: 0;
  border: none;
}
#cell>div{
  margin: 0;
  padding: 0;
  border: none;
  width: 160px;
  height: 32px;
}
#cell>div span{
  display: inline-block;
  line-height: 1.2;
  margin: 0;
  padding: 0;
  border: none;
}
</style>
