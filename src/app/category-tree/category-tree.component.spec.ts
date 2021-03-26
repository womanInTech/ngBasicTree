import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { categoryTreeComponent } from './category-tree.component';

describe('categoryTreeComponent', () => {
  let component: categoryTreeComponent;
  let fixture: ComponentFixture<categoryTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [categoryTreeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(categoryTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
