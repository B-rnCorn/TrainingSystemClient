import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldItemsListComponent } from './field-items-list.component';

describe('FieldItemsListComponent', () => {
  let component: FieldItemsListComponent;
  let fixture: ComponentFixture<FieldItemsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldItemsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
