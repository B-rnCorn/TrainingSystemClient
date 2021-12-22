import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldGenerateDialogComponent } from './field-generate-dialog.component';

describe('FieldSettingsDialogComponent', () => {
  let component: FieldGenerateDialogComponent;
  let fixture: ComponentFixture<FieldGenerateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldGenerateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldGenerateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
