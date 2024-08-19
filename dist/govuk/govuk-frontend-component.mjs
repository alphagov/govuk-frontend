import { isSupported } from './common/index.mjs';
import { SupportError } from './errors/index.mjs';

class GOVUKFrontendComponent {
  constructor() {
    this.checkSupport();
  }
  checkSupport() {
    if (!isSupported()) {
      throw new SupportError();
    }
  }
}

export { GOVUKFrontendComponent };
//# sourceMappingURL=govuk-frontend-component.mjs.map
