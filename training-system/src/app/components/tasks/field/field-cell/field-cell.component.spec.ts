import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldCellComponent } from './field-cell.component';

describe('FieldCellComponent', () => {
  let component: FieldCellComponent;
  let fixture: ComponentFixture<FieldCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
