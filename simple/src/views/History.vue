<template>
  <div class="history-page">

    <div class="history-page-ctl">
      <button @click="clean">清空历史记录</button>
    </div>

    <div class="subject-content"
       v-for="(item, index) in subjectArr"
    >
      <SubjectList
        :index="index"     
        :subject="item.subject"
        :created="item.created"
        @onClick="onClick(index, item)"
        @onDel="onDel(index, item)"
      ></SubjectList>

      <div class="subject-content-person"
        :index="index"
        v-if="curIndex === index"
      >
        <CheckedIn
          v-for="person in personArr"
          :title="person.person"
          :signature="person.signature"
        ></CheckedIn>
      </div>
      

    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref } from 'vue'
import CheckedIn from '../components/CheckedIn.vue'
import SubjectList from '../components/SubjectList.vue'

import { useStore } from '../store'

import { adminAccount } from '../common/config'

export default defineComponent({
  name: 'History',
  components: {
    CheckedIn,
    SubjectList
  },
  setup() {
    const store = useStore()

    //主题仓库
    const subjectTx = store.state.indexedDB.transaction("Subject", "readwrite");
		const subjectStore = subjectTx.objectStore("Subject")
    const subjectIndex = subjectStore.index("by_owner")

    //存储主题的数组
    const subjectArr = reactive([])     
    //存储人员信息的数组
    let personArr = reactive([])

    //获取主题
    const request = subjectIndex.openCursor(IDBKeyRange.only(adminAccount.value));
    request.onsuccess = function() {
    const cursor = request.result;
      if (cursor) {
        
        subjectArr.unshift(cursor.value)
        cursor.continue();
      } else {
      
      }
    };

    //当前的下标
    const curIndex = ref(-1)

    function onClick (index, item) {
      if(curIndex.value === index){
        curIndex.value = -1
        return
      }
      curIndex.value = index

      //获取人员
      personArr.length = 0
      //人员仓库
      const personInfoTx = store.state.indexedDB.transaction("PersonInfo", "readwrite")
      const	personInfoStore = personInfoTx.objectStore("PersonInfo")
      const personInfoIndex = personInfoStore.index("by_subjectID")
      
      const request = personInfoIndex.openCursor(IDBKeyRange.only(item.subjectID));
      request.onsuccess = function() {
        const cursor = request.result;
        if (cursor) {
            
          personArr.unshift(cursor.value)
          
          cursor.continue();
        } else {
          // No more matching records.
        
        }
      }


    }

    function clean() {
      subjectArr.length = 0
      const subjectTx = store.state.indexedDB.transaction("Subject", "readwrite");
		  subjectTx.objectStore("Subject").clear()
      const personInfoTx = store.state.indexedDB.transaction("PersonInfo", "readwrite")
      personInfoTx.objectStore("PersonInfo").clear()
    }

    function onDel(index, item){

      //删除本地缓存
      subjectArr.splice(index, 1)


      //删除主题数据
      const subjectTx = store.state.indexedDB.transaction("Subject", "readwrite")
		  const subjectIndex = subjectTx.objectStore("Subject").index('by_subjectID')
			const request = subjectIndex.openCursor(IDBKeyRange.only(item.subjectID));
      request.onsuccess = () => {
        const cursor = request.result
        
        if(cursor) {
          cursor.delete()
          cursor.continue()
        }
        else {
          
        }

      }

      //删除人员数据
      const personInfoTx = store.state.indexedDB.transaction("PersonInfo", "readwrite")
      const personInfoIndex = personInfoTx.objectStore("PersonInfo").index("by_subjectID")
      const personInfoRequest = personInfoIndex.openCursor(IDBKeyRange.only(item.subjectID));
      personInfoRequest.onsuccess = () => {
        const cursor = personInfoRequest.result
        
        if(cursor) {
          cursor.delete()
          cursor.continue()
        }
        else {
          
        }

      }

    }

    return { subjectArr, curIndex, onClick, personArr, clean, onDel }

  }

})
</script>

<style>
.history-page {
  flex-grow: 1;
  padding: 10px 20px 20px;
  box-sizing: border-box;
  overflow: auto;
}

.history-page-ctl {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}

.history-page-ctl > button {
  outline: none;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid var(--primary);
  background-color: transparent;
  cursor: pointer;
  color: var(--primary);
}

.history-page-ctl > button:hover {
  background-color: var(--primary);
  color: var(--color-primary);
}
</style>