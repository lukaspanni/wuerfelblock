/* eslint-disable @typescript-eslint/dot-notation */

import { TestBed } from '@angular/core/testing';
import { PersistenceService } from './persistence.service';
import { Storage } from '@ionic/storage-angular';

describe('PersistenceService', () => {
  let service: PersistenceService;
  let storageSpy: Storage;

  beforeEach(async () => {
    storageSpy = jasmine.createSpyObj('Storage', {
      set: Promise.resolve(),
      get: Promise.resolve(),
      keys: Promise.resolve(),
      clear: Promise.resolve(),
      create: Promise.resolve()
    });
    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useValue: storageSpy }]
    });
    service = TestBed.inject(PersistenceService);
    await service.ready;
    service['storage'] = storageSpy; //supersede storage
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('service should be ready after construction', async () => {
    await expectAsync(service.ready).toBeResolved();
  });

  it('store should set key-value using storage', async () => {
    await service.store('test-key', 'test-value');
    expect(storageSpy.set).toHaveBeenCalledWith('test-key', 'test-value');
  });

  it('store should reject if storage rejects', async () => {
    (storageSpy.set as jasmine.Spy).and.callFake(() => Promise.reject());
    await expectAsync(service.store('test-key', 'test-value')).toBeRejected();
  });

  it('store should reject if storage throws error', async () => {
    (storageSpy.set as jasmine.Spy).and.callFake(() => {
      throw new Error();
    });
    await expectAsync(service.store('test-key', 'test-value')).toBeRejectedWithError();
  });

  it('retrieve should get using storage', async () => {
    (storageSpy.get as jasmine.Spy).and.callFake(() => Promise.resolve('value'));
    const data = await service.retrieve('test-key');
    expect(data).toEqual('value');
    expect(storageSpy.get).toHaveBeenCalledWith('test-key');
  });

  it('retrieve should return empty string if no value found', async () => {
    (storageSpy.get as jasmine.Spy).and.callFake(() => Promise.resolve(undefined));
    const data = await service.retrieve('test-key');
    expect(data).toEqual('');
  });

  it('retrieve should reject if storage rejects', async () => {
    (storageSpy.get as jasmine.Spy).and.callFake(() => Promise.reject());
    await expectAsync(service.retrieve('test-key')).toBeRejected();
  });

  it('retrieve should reject if storage throws error', async () => {
    (storageSpy.get as jasmine.Spy).and.callFake(() => {
      throw new Error();
    });
    await expectAsync(service.retrieve('test-key')).toBeRejectedWithError();
  });

  it('keys should return array of keys', async () => {
    const expectedKeys = ['key1', 'key2'];
    (storageSpy.keys as jasmine.Spy).and.callFake(() => Promise.resolve(['key1', 'key2']));
    const keys = await service.keys();
    expect(keys).toEqual(expectedKeys);
    expect(storageSpy.keys).toHaveBeenCalled();
  });

  it('keys should return empty array on error', async () => {
    (storageSpy.keys as jasmine.Spy).and.callFake(() => Promise.reject());
    const keys = await service.keys();
    expect(keys.length).toBe(0);
  });

  it('clear should use storage.clear', async () => {
    await service.clear();
    expect(storageSpy.clear).toHaveBeenCalled();
  });
});
