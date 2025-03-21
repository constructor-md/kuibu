<template>
  <view class="hms">
    <!-- //显示时间的地方，样式可以自行修改 -->
    <!-- <view class="hmsText" @click="show">{{ hmsVal }}</view> -->
    <!-- //弹出选择时间的弹框 -->
    <uni-popup ref="popup" type="bottom" background-color="#fff">
      <view class="hms_content">
        <view class="hmsBtn">
          <view class="close" @click="close">取消</view>
          <view class="complete" @click="completeFun">完成</view>
        </view>
        <picker-view indicator-style="100rpx" @change="bindChange" class="picker-view" :value="pickerArrIndex">
          <picker-view-column>
            <view class="item" v-for="(item, index) in hours" :key="index">{{ item }}时</view>
          </picker-view-column>
          <picker-view-column>
            <view class="item" v-for="(item, index) in minute" :key="index">{{ item }}分</view>
          </picker-view-column>
          <picker-view-column>
            <view class="item" v-for="(item, index) in second" :key="index">{{ item }}秒</view>
          </picker-view-column>
        </picker-view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
export default {
  props: {
    //父组件传过来的初始值，不是必须传，不传默认值为00:00:00
    hmsval: {
      type: String,
      default() {
        return '00:00:00';
      }
    }
  },
  data() {
    return {
      hours: [],
      minute: [],
      second: [],
      h: '00',
      m: '00',
      s: '00',
      hmsVal: '00:00:00',//页面使用的显示值
      pickerArrIndex: [0, 0, 0]//picker-view 显示默认
    };
  },
  watch: {
    //监听父组件传过来的从新赋值给新的变量显示
    hmsval(newval, oldval) {
      this.hmsVal = newval;
    }
  },
  created() {
    this.hoursFun();
    this.minuteFun();
    this.secondFun();
  },
  methods: {
    // 时
    hoursFun() {
      for (var i = 0; i <= 23; i++) {
        if (i < 10) {
          i = '0' + i;
          this.hours.push(i);
        } else {
          this.hours.push(i);
        }
      }
    },
    // 分
    minuteFun() {
      for (var i = 0; i <= 59; i++) {
        if (i < 10) {
          i = '0' + i;
          this.minute.push(i);
        } else {
          this.minute.push(i);
        }
      }
    },
    // 秒
    secondFun() {
      for (var i = 0; i <= 59; i++) {
        if (i < 10) {
          i = '0' + i;
          this.second.push(i);
        } else {
          this.second.push(i);
        }
      }
    },
    //picker值改变的事件
    bindChange(e) {
      const val = e.detail.value;
      this.h = this.hours[val[0]] ? this.hours[val[0]] : this.h;
      this.m = this.minute[val[1]] ? this.minute[val[1]] : this.m;
      this.s = this.second[val[2]] ? this.second[val[2]] : this.s;
    },
    show() {
      // picker-view 显示默认值
      var hmsArr = this.hmsVal.split(':');
      var hindex = this.hours.findIndex(item => item == hmsArr[0]);
      var mindex = this.minute.findIndex(item => item == hmsArr[1]);
      var sindex = this.second.findIndex(item => item == hmsArr[2]);
      this.pickerArrIndex = [hindex, mindex, sindex];
      this.$refs.popup.open();
    },
    // 关闭popup
    close() {
      this.$refs.popup.close();
    },
    //点击完成
    completeFun() {
      //点击完成赋值
      this.hmsVal = `${this.h}:${this.m}:${this.s}`;
      //新的值传给父组件
      this.$emit('complete', this.hmsVal)
      this.$refs.popup.close();
    }
  }
};
 
</script>
<style lang='scss' scoped>
.picker-view {
  height: 400rpx;
  background: #fff;
}
.item {
  line-height: 100rpx;
  text-align: center;
}
.hmsText {
  width: 160rpx;
  height: 50rpx;
  line-height: 50rpx;
  border: 1px solid #ddd;
  text-align: center;
  background: #fff;
  border-radius: 10rpx;
  margin-left: 10rpx;
}
.hmsBtn {
  display: flex;
  align-items: center;
  background: #fff;
  height: 80rpx;
  line-height: 80rpx;
  justify-content: space-between;
  padding: 0 20rpx;
  border-bottom: 1px solid #ddd;
  .complete {
    color: #0055ff;
  }
}
</style>