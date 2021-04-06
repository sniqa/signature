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