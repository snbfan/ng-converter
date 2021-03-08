import { WindowService } from './window.service';

describe('Service: Window Service - window object wrapper', () => {
  let service: WindowService;

  beforeEach(() => {
    service = new WindowService();
  });

  describe('property: windowRef', () => {
    it('should be able to retrieve the window reference', () => {
      expect(service.windowRef).toBe(window);
    });
  });
});
