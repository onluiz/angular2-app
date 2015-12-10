import * as Rx from 'rxjs/Rx';

import {By, DebugElement, Observable} from 'angular2/angular2';
import {MockBackend} from 'angular2/http/testing';
import {Router, Location} from 'angular2/router';
import {inject, ComponentFixture, TestComponentBuilder} from 'angular2/testing';

const tokens = [TestComponentBuilder, Router, Location, MockBackend];

export function createTestContext(fn:Function) {
  return inject(tokens, (tcb, router, location, backend) => {
    const ctx = new TestContext({
      tcb: tcb,
      router: router,
      location: location,
      backend: backend,
    });
    fn(ctx);
  });
}

export class TestContext {

  private _tcb:TestComponentBuilder;
  private _router:Router;
  private _location:Location;
  private _backend:MockBackend;
  private _fixture:ComponentFixture;

  constructor({tcb, router, location, backend}:{
    tcb:TestComponentBuilder,
    router:Router,
    location:Location,
    backend:MockBackend,
  }) {
    this._tcb = tcb;
    this._router = router;
    this._location = location;
    this._backend = backend;
  }

  init(rootComponent:Function):Observable<ComponentFixture> {
    const promise = this._tcb.createAsync(rootComponent)
      .then(fixture => {
        this._fixture = fixture;
        fixture.detectChanges();
        return fixture;
      });
    return Rx.Observable.fromPromise(promise);
  }

  get router():Router {
    return this._router;
  }

  get location():Location {
    return this._location;
  }

  get backend():MockBackend {
    return this._backend;
  }

  get fixture():ComponentFixture {
    return this._fixture;
  }
}
