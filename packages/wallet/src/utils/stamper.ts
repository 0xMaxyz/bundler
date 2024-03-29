import { WebauthnStamper } from '@turnkey/webauthn-stamper'

export const stamper = new WebauthnStamper({
  rpId: process.env.NEXT_PUBLIC_RPID!
})
