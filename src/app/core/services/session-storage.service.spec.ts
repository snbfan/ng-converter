import { SessionStorageService } from './session-storage.service';

describe('Service: Session Storage Service - SessionStorage wrapper', () => {
  let service: SessionStorageService;
  let getNamespacedKeySpy: jasmine.Spy;
  const namespacePrefix = 'ng-converter-app:';

  beforeAll(() => {
    service = new SessionStorageService();
    getNamespacedKeySpy = spyOn(service, 'getNamespacedKey');
  });

  describe('method: getItem', () => {
    it('should call getNamespacedKey method', () => {
      const key = 'key';
      service.getItem(key);
      expect(getNamespacedKeySpy).toHaveBeenCalledWith(key);
    });

    it('should return JSON-parsed value from SessionStorage if exists', () => {
      const value = {a: 1};
      const key = 'key';
      sessionStorage.setItem(namespacePrefix + key, JSON.stringify(value));

      getNamespacedKeySpy.and.callThrough();
      const actualValue = service.getItem(key);
      expect(actualValue).toEqual(value);
    });

    it('should return null if does not exist', () => {
      const actualValue = service.getItem('inexistentkey');
      expect(actualValue).toEqual(null);
    });
  });

  describe('method: setItem', () => {
    beforeEach(() => {
      getNamespacedKeySpy.and.callThrough();
    });

    it('should call getNamespacedKey method', () => {
      const key = 'key';
      const value = { a: 1 };

      service.setItem(key, value);
      expect(getNamespacedKeySpy).toHaveBeenCalledWith(key);
    });

    it('should set value to SessionStorage with prefixed key', () => {
      const key = 'key';
      const value = { a: 2 };

      service.setItem(key, value);

      const actual = JSON.parse(sessionStorage.getItem(namespacePrefix + key));
      expect(actual).toEqual(value);
    });
  });

  describe('method: getNamespacedKey', () => {
    it('should add prefix to provided key', () => {
      const key = 'key';
      getNamespacedKeySpy.and.callThrough();
      const actual = service.getNamespacedKey(key);
      expect(actual).toEqual(namespacePrefix + key);
    });
  });
});
