import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ThemePalette } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule, MatTooltipModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})

export class DialogComponent implements OnInit {
  form_field_color = 'accent' as ThemePalette;
  player_form!: FormGroup;

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.initForm();
  }

  initForm() {
    this.player_form = this.formBuilder.group({
      player_1: ['', Validators.required],
      player_2: ['', Validators.required],
      rounds: ['', Validators.required]
    });

    if (this.data.player_info.player_1 !== '' && this.data.player_info.player_2 !== '') {
      this.player_form.get('player_1')?.setValue(this.data.player_info.player_1);
      this.player_form.get('player_2')?.setValue(this.data.player_info.player_2);
    }
  }

  addPlayers() {
    if (this.player_form.invalid) {
      this.player_form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.player_form.value);
  }

  swapPlayers() {
    let player_1 = this.player_form.get('player_1');
    let player_2 = this.player_form.get('player_2');

    let temp_player_1_value = this.player_form.get('player_1')?.value;
    let temp_player_2_value = this.player_form.get('player_2')?.value;

    player_1?.setValue(temp_player_2_value);
    player_2?.setValue(temp_player_1_value);
  }
}
