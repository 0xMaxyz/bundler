"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymasterAPI = void 0;
/**
 * an API to external a UserOperation with paymaster info
 */
class PaymasterAPI {
    /**
     * return temporary values to put into the paymaster fields.
     * @param userOp the partially-filled UserOperation. Should be filled with tepmorary values for all
     *    fields except paymaster fields.
     * @return temporary paymaster parameters, that can be used for gas estimations
     */
    async getTemporaryPaymasterData(userOp) {
        return null;
    }
    /**
     * after gas estimation, return final paymaster parameters to replace the above tepmorary value.
     * @param userOp a partially-filled UserOperation (without signature and paymasterAndData
     *  note that the "preVerificationGas" is incomplete: it can't account for the
     *  paymasterAndData value, which will only be returned by this method..
     * @returns the values to put into paymaster fields, null to leave them empty
     */
    async getPaymasterData(userOp) {
        return null;
    }
}
exports.PaymasterAPI = PaymasterAPI;
//# sourceMappingURL=PaymasterAPI.js.map