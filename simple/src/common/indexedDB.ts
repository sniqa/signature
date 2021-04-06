
export interface Subjects {				//签到主题
	owner: string										//所有人
	subject: string										//标题
	subjectID: string									//标题id
	created: string									//创建时间
}

export interface PersonInfos {		//
	subjectID: string,							//所属于哪个签到主题
	person: string,								//签名人
	signature: string,						//签名的dataurl
	created: string,							//创建时间
}


const request = indexedDB.open("signature");

// export let ownerIndex: IDBIndex,
// 		titleIndex: IDBIndex,
// 		sujectTitleID: IDBIndex,
// 		signatureTitleID: IDBIndex

request.onupgradeneeded = function() {
  // The database did not previously exist, so create object stores and indexes.
  const db = request.result;
  const subjectStore = db.createObjectStore("Subject", { keyPath: 'subjectID' });
  subjectStore.createIndex("by_owner", "owner");
  subjectStore.createIndex("by_subject", "subject", { unique: true });
  // sujectTitleID =subjectStore.createIndex("by_titleID", "titleID");
  subjectStore.createIndex("by_created", "created");

	const personInfoStore = db.createObjectStore("PersonInfo", { keyPath: 'subjectID' });
  personInfoStore.createIndex("by_person", "person");
  personInfoStore.createIndex("by_signature", "signature");
  // signatureTitleID = signatureStore.createIndex("by_titleID", "titleID", { unique: true });
  personInfoStore.createIndex("by_created", "created");
};



request.onerror = function () {
	console.log('打开数据库失败')
}

const dbSearch = (db: IDBDatabase, 
		dbStore: string,
		dbIndex: string,
		dbValue: string,
		onsuccess: (e: Event) => void
	) => {

		const tx = db.transaction(dbStore, "readonly");
		const store = tx.objectStore(dbStore);
		const index = store.index(dbIndex);

		const request = index.get(dbValue);
		request.onsuccess = onsuccess
}


export default request

