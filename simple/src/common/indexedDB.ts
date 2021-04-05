
export interface Signature {
	id: string,
	person: string,
	signature: string,
	// titleID: string,
	create: string,
}


export interface Subject {
	id: string
	owner: string										//所有人
	title: string										//标题
  // titleID: string									//标题id
	created: string										//创建时间
}


const request = indexedDB.open("signature");

export let ownerIndex: IDBIndex,
		titleIndex: IDBIndex,
		sujectTitleID: IDBIndex,
		signatureTitleID: IDBIndex

request.onupgradeneeded = function() {
  // The database did not previously exist, so create object stores and indexes.
  const db = request.result;
  const subjectStore = db.createObjectStore("Subject", { keyPath: 'id' });
  ownerIndex = subjectStore.createIndex("by_owner", "owner");
  titleIndex = subjectStore.createIndex("by_title", "title", { unique: true });
  // sujectTitleID =subjectStore.createIndex("by_titleID", "titleID");
  subjectStore.createIndex("by_created", "created");

	const signatureStore = db.createObjectStore("Signature", { keyPath: 'id' });
  signatureStore.createIndex("by_person", "person");
  signatureStore.createIndex("by_signature", "signature");
  // signatureTitleID = signatureStore.createIndex("by_titleID", "titleID", { unique: true });
  signatureStore.createIndex("by_created", "created");
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

