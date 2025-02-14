export class IdosellOrder {
  errors: any[];
  orderId: string;
  orderSerialNumber: number;
  orderType: string;
  orderDetails: OrderDetails;
  clientResult: ClientResult;
  orderBridgeNote: string;
}

export interface OrderCurrency {
  currencyId: string;
  orderCurrencyValue: number;
  billingCurrencyRate: number;
  orderProductsCost: number;
  orderDeliveryCost: number;
  orderPayformCost: number;
  orderInsuranceCost: number;
}

export interface OrderBaseCurrency {
  orderProductsCost: number;
  orderDeliveryCost: number;
  orderDeliveryVat: number;
  orderPayformCost: number;
  orderPayformVat: number;
  orderInsuranceCost: number;
  orderInsuranceVat: number;
  billingCurrency: string;
}

export interface Payments {
  orderPaymentDays: number;
  orderPaymentType: string;
  orderRebatePercent: number;
  orderWorthCalculateType: string;
  orderVatExists: string;
  orderCurrency: OrderCurrency;
  orderBaseCurrency: OrderBaseCurrency;
}

export interface Dispatch {
  courierWebserviceOnly: boolean;
  deliveryWeight: number;
  courierName: string;
  courierId: number;
  deliveryPackageId: string;
  deliveryDate: string;
  estimatedDeliveryDate: string;
  deliveryDateAdditional: string;
}

export interface PreorderSourceDetails {
  orderSourceTypeId: number;
  orderSourceType: string;
  orderSourceName: string;
  orderSourceId: number;
  entryDate: string;
}

export interface OrderSourceDetails {
  fresh: string;
  fulfillment: string;
  sourcePageUrl: string;
  orderSourceName: string;
  orderSourceTypeId: number;
  orderSourceType: string;
  orderSourceId: number;
  orderExternalId: any;
}

export interface OrderSourceResults {
  preorderSourcesDetails: PreorderSourceDetails[];
  orderSourceType: string;
  shopId: number;
  auctionsServiceName: string;
  orderSourceDetails: OrderSourceDetails;
}

export interface OrderDetails {
  orderChangeDate: string;
  receivedDate: string;
  payments: Payments;
  dispatch: Dispatch;
  prepaids: any[];
  purchaseDate: string;
  subscriptionId: number;
  orderStatus: string;
  orderOperatorLogin: string;
  orderPackingPersonLogin: any;
  apiFlag: string;
  orderConfirmation: string;
  orderAddDate: string;
  orderDispatchDate: number;
  orderPrepareTime: number;
  clientNoteToOrder: string;
  clientNoteToCourier: string;
  orderNote: string;
  stockId: number;
  clientRequestInvoice: string;
  clientDeliveryAddressId: number;
  productRemovedInStock: string;
  orderSourceResults: OrderSourceResults;
  auctionInfo: any;
  productsResults: Product[];
  dropshippingOrderStatus: string;
}

export interface EndClientAccount {
  clientId: number;
  clientLogin: string;
  clientEmail: string;
  clientPhone1: string;
  clientPhone2: string;
  clientCodeExternal: string;
}

export interface ClientBillingAddress {
  clientFirstName: string;
  clientLastName: string;
  clientNip: string;
  clientFirm: string;
  clientStreet: string;
  clientZipCode: string;
  clientCity: string;
  clientCountryId: string;
  clientPhone1: string;
  clientPhone2: string;
  clientProvinceId: string;
  clientProvince: string;
  clientCountryName: string;
}

export interface ClientDeliveryAddress {
  clientDeliveryAddressFirm: string;
  clientDeliveryAddressType: string;
  clientDeliveryAddressPickupPointInternalId: number;
  clientDeliveryAddressId: string;
  clientDeliveryAddressFirstName: string;
  clientDeliveryAddressLastName: string;
  clientDeliveryAddressStreet: string;
  clientDeliveryAddressZipCode: string;
  clientDeliveryAddressCity: string;
  clientDeliveryAddressCountryId: string;
  clientDeliveryAddressCountry: string;
  clientDeliveryAddressPhone1: string;
  clientDeliveryAddressPhone2: string;
  clientDeliveryAddressProvinceId: string;
  clientDeliveryAddressProvince: string;
}

export interface ClientAccount {
  clientId: number;
  clientLogin: string;
  clientEmail: string;
  clientPhone1: string;
  clientPhone2: string;
  clientCodeExternal: string;
}

export interface ClientResult {
  endClientAccount: EndClientAccount;
  clientBillingAddress: ClientBillingAddress;
  clientDeliveryAddress: ClientDeliveryAddress;
  clientAccount: ClientAccount;
}

export interface Product {
    productOrderPriceBaseCurrency: number;
    productOrderPriceNetBaseCurrency: number;
    productOrderAdditional: string;
    basketPosition: number;
    productPriceLog: string;
    productId: number;
    productName: string;
    productCode: string;
    sizeId: string;
    sizePanelName: string;
    productSizeCodeExternal: string;
    stockId: number;
    productQuantity: number;
    productWeight: number;
    productVat: number;
    productPanelPrice: number;
    productPanelPriceNet: number;
    remarksToProduct: string;
    productSerialNumbers: any;
    bundleId: number;
    productOrderPrice: number;
    productOrderPriceNet: number;
    orderSalesMode: string;
    versionName?: string; // Optional property
  }