import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Item } from '../models/item';
import { AuthService } from './auth.service';
import { ItemLog, ItemLog1, ItemLog3, ItemLog2, ItemAbstract } from '../models/item-log';
import { tap, map } from 'rxjs/operators';
import { User } from './user';
import { ReimbursementLog } from '../models/reimbursement-log';
import { StudentLog, StudentLog2 } from '../models/student-logs';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable()
export class DataService {

  uid: string;

  constructor(private firestore: AngularFirestore, private authService: AuthService, private storage: AngularFireStorage) {
    this.authService.user.subscribe(user => {
      this.uid = user.uid;
    });
  }

  generateId() {
    return this.firestore.createId();
  }

  getTimeStamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  addItem(item: Item) {
    if (item.itemId === '') {
      item.itemId = this.generateId();
    }
    item.addedBy = this.uid;
    return this.firestore.collection(`items`).doc(item.itemId).set(item);
  }

  getLogExists(item: Item) {
    return this.firestore.collection<Item>(`items`, ref => ref.where('category', '==', item.category)
      .where('subCategory', '==', item.subCategory)
      .where('itemName', '==', item.itemName)).valueChanges();
  }

  getItemById(itemId: string) {
    return this.firestore.doc<Item>(`items/${itemId}`).valueChanges();
  }

  // getStudentLogById(uid: string) {
  //   return this.firestore.doc<StudentLog2>(`studentLogs`).valueChanges();
  // }

  getItems(subCategory: string, queryString: string) {
    return this.firestore.collection<Item>(`items`, ref => ref.where('subCategory', '==', subCategory)
      .where('itemName', '>', `${queryString}`).where('itemName', '<', `${queryString}z`)
      .orderBy('itemName')).valueChanges();
  }

  getLogsofStudents(queryString: string) {
    return this.firestore.collection<StudentLog>('studentLogs', ref => ref
      .where('studentName', '>', `${queryString}`).where('studentName', '<', `${queryString}z`)
      .orderBy('studentName', 'asc')
    ).valueChanges();
  }


  deleteItemById(itemId) {
    return this.firestore.collection<Item>(`items`).doc(itemId).delete();
    // delete all logs related to item
  }

  addLog(log: ItemLog) {
    return this.firestore.collection<ItemLog>(`logs`).doc(log.logId).set(log);
  }
  addLog1(log: ItemLog1) {
    return this.firestore.collection<ItemLog1>(`logs`).doc(log.logId).set(log);
  }
  addLog2(log: ItemLog2) {
    return this.firestore.collection<ItemLog2>(`logs`).doc(log.logId).set(log);
  }
  addLog3(log: ItemLog3) {
    return this.firestore.collection<ItemLog3>(`logs`).doc(log.logId).set(log);
  }
  addReimbursementLog(log: ReimbursementLog) {
    return this.firestore.collection<ReimbursementLog>(`reimbursementLogs`).doc(log.reimburesmentId).set(log);
  }
  addStudentLog(log: StudentLog) {
    return this.firestore.collection<StudentLog2>('studentLogs').doc(log.logId).set(log);
  }

  getLogsOfItem(itemId: string) {
    return this.firestore.collection<ItemLog>(`logs`, ref => ref.where('itemId', '==', itemId).orderBy('date', 'desc')).valueChanges();
  }

  getLogsOfItemAsce(itemId: string, startDate: any, endDate: any) {
    console.log('date issssss', startDate);
    return this.firestore.collection<ItemLog>(`logs`, ref => ref.where('itemId', '==', itemId)
      .where('date', '>=', startDate).where('date', '<=', endDate).orderBy('date')).valueChanges();
  }

  getLogsOfItem1(itemId: string) {
    return this.firestore.collection<ItemLog1>(`logs`, ref => ref.where('itemId', '==', itemId).orderBy('date', 'desc')).valueChanges();
  }
  getLogsOfItem2(itemId: string) {
    return this.firestore.collection<ItemLog2>(`logs`, ref => ref.where('itemId', '==', itemId).orderBy('date', 'desc')).valueChanges();
  }
  getLogsOfItem3(itemId: string) {
    return this.firestore.collection<ItemLog3>(`logs`, ref => ref.where('itemId', '==', itemId).orderBy('date', 'desc')).valueChanges();
  }
  getLogsofReimbursement(uid: string, status: string, isAdmin: boolean) {
    if (isAdmin) {
      if (status === 'open') {
        return this.firestore.collection(`reimbursementLogs`, ref => ref.where('status', '==', status)
          .orderBy('dateOfPurchase', 'desc')).valueChanges();
      }
      return this.firestore.collection(`reimbursementLogs`, ref => ref.where('status', '==', 'closed')
        .orderBy('dateOfPurchase', 'desc')).valueChanges();
    } else {
      if (status === 'open') {
        return this.firestore.collection(`reimbursementLogs`, ref => ref.where('addedBy', '==', uid).where('status', '==', status)
          .orderBy('dateOfPurchase', 'desc')).valueChanges();
      }
      return this.firestore.collection(`reimbursementLogs`, ref => ref.where('addedBy', '==', uid).where('status', '==', 'closed')
        .orderBy('dateOfPurchase', 'desc')).valueChanges();
    }

  }


  addAuth(uid: string) {

  }

  // getLogsOfSubCat

  // getLogsOfCat

  deleteLogById(logId: string) {
    return this.firestore.collection<ItemLog>(`logs`).doc(logId).delete();
  }
  deleteLogById1(logId: string) {
    return this.firestore.collection<ItemLog1>(`logs`).doc(logId).delete();
  }
  deleteLogById2(logId: string) {
    return this.firestore.collection<ItemLog2>(`logs`).doc(logId).delete();
  }
  deleteLogById3(logId: string) {
    return this.firestore.collection<ItemLog3>(`logs`).doc(logId).delete();
  }
  deleteReimbursementLogById(logId: string) {
    return this.firestore.collection<ReimbursementLog>('reimbursementLogs').doc(logId).delete();
  }
  deleteStudentLogById(logId: string) {
    return this.firestore.collection<StudentLog>('studentLogs').doc(logId).delete();
  }
  onApprovalByAdmin(element: ReimbursementLog) {
    element.status = 'closed';
    return this.firestore.collection<ReimbursementLog>('reimbursementLogs').doc(element.reimburesmentId).update(element);
  }

  getSummary() {
    return this.firestore.collection<ItemAbstract>(`logs`).valueChanges();
  }
  getSummaryDatePicker(startDate: any, endDate: any) {
    return this.firestore.collection<ItemAbstract>(`logs`, ref => ref.
      where('date', '>=', startDate).where('date', '<=', endDate).orderBy('date')).valueChanges();
  }


  getSummaryCat(cat: string) {
    return this.firestore.collection<ItemAbstract>(`logs`, ref => ref.where('category', '==', cat).orderBy('date', 'desc')).valueChanges();
  }

  getSummarysubCat(subCat: string) {
    return this.firestore.collection<ItemAbstract>(`logs`, ref => ref.where('subCategory', '==', subCat)
      .orderBy('date', 'desc')).valueChanges();
  }

  getAllItems() {
    return this.firestore.collection<Item>('items').valueChanges();
  }

  getAllItemsCat(cat: string) {
    return this.firestore.collection<Item>('items', ref => ref.where('category', '==', cat)).valueChanges();
  }

  deleteRemibusrementLogById(logId: string) {
    return this.firestore.collection<ReimbursementLog>(`reimbursementLogs`).doc(logId).delete();
  }

  // save the permission token in firestore
  saveToken(user, token): void {

    const currentTokens = user.fcmTokens || {};
    // If token does not exist in firestore, update db
    if (!currentTokens[token]) {
      const userRef = this.firestore.collection('users').doc(user.uid);
      const tokens = { ...currentTokens, [token]: true };
      userRef.update({ fcmTokens: tokens });
    }
  }

  startUpload(file: File) {
    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    const path = `/studentImages/${new Date().getTime()}_${file.name}`;
    const customMetadata = { app: 'Student Images' };
    return this.storage.upload(path, file, { customMetadata });
  }

}
