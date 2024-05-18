// function registerVideoPlayerView(Vue) {
//   console.log('lsj---registerVideoPlayerView', Vue)
//   Vue.registerElement('SampleShadowView', {
//       component: {
//           name: 'SampleShadowView',
//           processEventData(event, nativeEventName, nativeEventParams) {
//               switch (nativeEventName) {
//                   case 'onPlayerStatusChanged':
//                       event.playerStatus = nativeEventParams.playerStatus;
//                   break;
//               }
//               return event;
//           },
//       },
//   });
//   Vue.component('v-SampleShadowView', {
//       methods: {
        
//       },
//       render(h) {
//           return h('SampleShadowView',
//               {
//                   ref: 'SampleShadowView',
//               }, this.$slots.default
//           );
//       },
//   });
// }

// export default (vm)=>{
//   registerVideoPlayerView(vm)
// }