"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeProvider = exports.STRIPE_CLIENT = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
exports.STRIPE_CLIENT = 'STRIPE_CLIENT';
exports.StripeProvider = {
    provide: exports.STRIPE_CLIENT,
    useFactory: () => {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) {
            new common_1.Logger('StripeProvider').warn('STRIPE_SECRET_KEY no configurado: las operaciones de pago estarán deshabilitadas.');
            return null;
        }
        return new stripe_1.default(key);
    },
};
//# sourceMappingURL=stripe.provider.js.map