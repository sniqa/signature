<template>
  <div class="history-page">
    <div class="subject-content"
       v-for="(item, index) in subjectArr"
    >
      <SubjectList
        :index="index"     
        :subject="item.subject"
        :created="item.created"
        @onClick="onClick(index, item)"
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

import { useStore, PersonState } from '../store'

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
      console.log(cursor);
      if (cursor) {
        
        console.log(cursor.value);
        
        subjectArr.unshift(cursor.value)
        cursor.continue();
      } else {
      
        console.log('subject finish');
      }
    };


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
      
      console.log(item.subjectID);
      
      const request = personInfoIndex.openCursor(IDBKeyRange.only(item.subjectID));
      request.onsuccess = function() {
        const cursor = request.result;
        console.log(cursor, 'cursor');
        if (cursor) {
            
          personArr.unshift(cursor.value)
          
          
          cursor.continue();
        } else {
          // No more matching records.
        
          console.log('personInfo compulite');
        }
      }


    }

    return { subjectArr, curIndex, onClick, personArr }

  }

})
</script>

<style>
.history-page {
  flex-grow: 1;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
}
</style>