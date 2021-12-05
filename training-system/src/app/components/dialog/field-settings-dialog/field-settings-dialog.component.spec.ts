import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldSettingsDialogComponent } from './field-settings-dialog.component';

describe('FieldSettingsDialogComponent', () => {
  let component: FieldSettingsDialogComponent;
  let fixture: ComponentFixture<FieldSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldSettingsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
