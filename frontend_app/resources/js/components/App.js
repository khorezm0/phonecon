import Vue from "/libs/vue/vue.js";

const appState = Vue.observable({
  value: {
    ips: [],
    isPaired: localStorage.getItem('isPaired')
  }
});

Vue.component("left-panel", {
  data: function () {
    return {
      bluetooth: true,
      wifi: true,
      battery: 42,
      connected: false,
      connectionStatus: "Соединение",
      notifications: [
        {
          id: 123,
          icon: "images/mdi-icons/bell.png",
          appName: "App Name",
          sender: "User Name",
          message: "Message\nASd",
        },
      ],
    };
  },
  computed: {
    deviceName: function () { return appState.value?.deviceName || "Phone" }
  },
  methods: {
    closeNotification: function (id) {
      const n = this.notifications.findIndex((i) => i.id === id);
      if (n === -1) {
        return;
      }

      this.notifications.splice(n, 1);
    },
  },
  template: `<div class="col phone-quick-menu">
          <!--Верх-->
          <div class="row user-select-none">
            <div class="col">
              <div class="phone-wallpaper">
                <div class="phone-wallpaper-img">&nbsp;</div>
                <div class="phone-wallpaper-frame">&nbsp;</div>
              </div>
            </div>

            <div class="col s7 flex-column justify-center">
              <h5 class="left left-align">{{ deviceName }}</h5>
              <div
                class="subheader left-align info-status-icons flex-row align-center"
              >
                <img alt="wifi on" src="/images/mdi-icons/wifi-on.png" v-if="wifi" />
                <img alt="wifi off" src="/images/mdi-icons/wifi-off.png" v-else />
                <img alt="bluetooth on" src="/images/mdi-icons/bluetooth-on.png" v-if="bluetooth" />
                <img alt="bluetooth off" src="/images/mdi-icons/bluetooth-off.png" v-else="bluetooth" />
                <img alt="battery" src="/images/mdi-icons/battery-full.png" />
                <span class="txt">{{ battery }}%</span>
              </div>
              <div class="subheader left-align flex-row align-center">
                <div class="connection-info" :style="'background-color: ' + (connected ? 'green' : 'orange')">&nbsp;</div>
                {{ connectionStatus }}</div>
            </div>
          </div>
          
          <hr />

          <div class="flex-column">
            <h5 class="left-align user-select-none">Уведомления</h5>
            
            <div class="flex-column notification-item" v-for="item in notifications">
              <div class="flex-row align-center">
                <img :src="item.icon" class="notification-icon" />
                <div class="notification-text">{{ item.appName }}</div>
                <div class="notification-time">{{ item.time }}</div>
                <div style="flex-grow: 1"></div>
                <img alt="close" @click="closeNotification(item.id)" src="/images/mdi-icons/close.png" class="notification-icon" />
              </div>
              <div class="flex-column align-start notification-body">
                <div class="notification-body-sender" v-if="item.sender">{{ item.sender }}</div>
                <div class="notification-body-content">{{ item.message }}</div>
              </div>
            </div>
            
          </div>
        </div>`,
});

Vue.component("main-content", {
  data: function () {
    return {
      currentTab: 0,
    };
  },
  template: `
<div class="col flex-grow app-content">
          <nav>
            <div class="nav-wrapper">
              <ul id="nav" class="left">
                <li><a @click="currentTab = 0">SMS</a></li>
                <li><a @click="currentTab = 1">Settings</a></li>
              </ul>
            </div>
          </nav>

          <!--SMS-->
          <div class="flex-column" v-if="currentTab == 0">
            SMS
          </div>

          <!--Settings-->
          <div class="flex-column" v-if="currentTab == 1">
            <h2>Settings</h2>
          </div>
        </div>`,
});

Vue.component("pair-phone", {
  data: function () {
    return {};
  },
  computed: {
    ips: function(){ return appState.value.ips || [] },
  },
  template: `
    <div class="col flex-grow app-pair-phone flex-column align-center justify-center">
        <div class="flex-row"><img src="/images/hero.svg" style="max-width: 100%"></div>
        <div class="flex-row">Скачайте и запустите приложение.<br/>Введите один из следующих адресов:</div>
        <ul class="collection">
            <li class="collection-item black ip-item" v-for="ip in ips">
                <span>{{ ip.ip }}</span>
                <span class="grey-text left-align">{{ ip.name }}</span>
            </li>
        </ul>
        <div class="flex-row">Если подключение не работает, попробуйте запустить приложение от имени администратора</div>
    </div>
  `,
});

const app = new Vue({
  el: "#neutralinoapp",
  data: function () {
    return {
    };
  },
  computed: {
    hasPairedDevice: function(){ return appState.value.isPaired },
  },
  template: `<div class="row flex-row fill-height" id="neutralinoapp">
              <left-panel v-if="hasPairedDevice" />
              <main-content v-if="hasPairedDevice" />
              <pair-phone v-if="!hasPairedDevice" />
            </div>`,
});


const fetchState = () =>{
  fetch("http://localhost:26262/state")
    .then(e => e.json())
    .then(e => appState.value = e)
    .then(s => console.log(s))
    .catch(console.debug);
};
//  app.$data.hasPairedDevice = true;

fetchState();
setInterval(fetchState, 5000);
