import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptStatus } from './receipt-status';

describe('ReceiptStatus', () => {
  let component: ReceiptStatus;
  let fixture: ComponentFixture<ReceiptStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
