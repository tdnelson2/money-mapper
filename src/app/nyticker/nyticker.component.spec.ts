import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NytickerComponent } from './nyticker.component';

describe('NytickerComponent', () => {
  let component: NytickerComponent;
  let fixture: ComponentFixture<NytickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NytickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NytickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
