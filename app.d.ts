declare module '*.jpg';
declare module '*.png';
declare module '*.scss';
declare module '*.vue' {
  import {defineComponent} from 'vue';
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

type NeedToTyped = any;
declare const __DEV__:boolean;

