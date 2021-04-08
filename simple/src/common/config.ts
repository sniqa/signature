import { computed, ref, watch } from 'vue'

export const adminAccount = ref('')

export const subjectID = ref('')  //新建id

export const wifiAccount = ref('')  //新建id

export const wifiPasswd = ref('')  //新建id

export const qrcodePageUrl = computed(() => {
  return window.location.origin + '/signin'
})

export const subject = ref('hello')

watch(() => subject.value, () => {
  console.log('config', subject.value);
  
})


export function str_encrypt(str: string) {
  let c = String.fromCharCode(str.charCodeAt(0) + str.length);

  for (let i = 1, len = str.length; i < len; i++) {
      c += String.fromCharCode(str.charCodeAt(i) + str.charCodeAt(i - 1));
  }

  return encodeURIComponent(c);
}

export function str_decrypt(str: string) {
  str = decodeURIComponent(str);
  let c = String.fromCharCode(str.charCodeAt(0) - str.length);

  for (let i = 1, len = str.length; i < len; i++) {
      c += String.fromCharCode(str.charCodeAt(i) - c.charCodeAt(i - 1));
  }
  return c;
}
