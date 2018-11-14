
export class IvConstant {

  // LocalStore key for Iv Credential and Tokens
  public static readonly STORE_IV_INFO_AND_TOKEN : string = "iv_connection_info";
  
  public static readonly SUPPLY_TYPE: string[] = ['ONHAND', 
  'PO', 'PO_PLACED', 'PO_BACKORDER', 'PO_SCHEDULED', 'PO_RELEASED',
  'INTRANSIT', 'HELD', 
  'PLANNED_PO', 'PLANNED_TRANSFER', 
  'WIP', 'WO_PLACED'];

  public static readonly UOM_OPTIONS: string[] = ["EACH", "CASE", "PALLET"];

  public static readonly PROD_CLASS_OPTIONS: string[] = ["NEW", "OPEN_BOX", "USED"];

}

