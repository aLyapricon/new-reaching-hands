import { Component, OnInit, Inject } from '@angular/core';
import { StudentLog, StudentLog2 } from '../../../../models/student-logs';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from '../../../../core/data-service.service';
declare var $: any;

@Component({
  selector: 'app-add-student-log',
  templateUrl: './add-student-log.component.html',
  styleUrls: ['./add-student-log.component.css']
})
export class AddStudentLogComponent implements OnInit {

  studentLog: StudentLog = {} as StudentLog;
  logFormControl = new FormControl();

  selectedFiles: FileList;
  progress = 0;

  constructor(public dialogRef: MatDialogRef<AddStudentLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService) {
    if (data && data.studentLog) {
      this.studentLog = data.studentLog;
    }
  }


  detectFiles(event) {
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles);
    const task = this.dataService.startUpload(this.selectedFiles[0]);
    task.percentageChanges().subscribe(val => {
      this.progress = val;
    });
    task.snapshotChanges().subscribe(val => {
      this.studentLog.image = val.downloadURL;
    });
  }


  ngOnInit() {
  }

  onAdd() {
    const tempItemLog: StudentLog = {
      'logId': this.studentLog.logId ? this.studentLog.logId : this.dataService.generateId(),
      'studentName': this.studentLog.studentName,
      'dateOfBirth': this.studentLog.dateOfBirth,
      'fathersName': this.studentLog.fathersName,
      'emailId': this.studentLog.emailId,
      'addedBy': this.dataService.uid,
      'logdate': this.studentLog.dateOfBirth,
      'image': this.studentLog.image ? this.studentLog.image : '',
      'adhar': this.studentLog.adhar,
      'folderId': this.studentLog.folderId ? this.studentLog.folderId : ''
    };
    console.log('check', tempItemLog);
    this.dataService.addStudentLog(tempItemLog).then(() => {
      console.log('added log succesfully');
    }).catch(err => {
      console.error('error while adding log', err);
      alert('error adding log');
    });
    this.dialogRef.close();
  }

}
