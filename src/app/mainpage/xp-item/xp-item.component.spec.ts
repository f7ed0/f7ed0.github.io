import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XpItemComponent } from './xp-item.component';

describe('XpItemComponent', () => {
  let component: XpItemComponent;
  let fixture: ComponentFixture<XpItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [XpItemComponent]
    });
    fixture = TestBed.createComponent(XpItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
