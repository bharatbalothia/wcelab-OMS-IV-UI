export class EntityUrl {

    // public static readonly DEFAULT_URL_BASE = "https://eu-api.watsoncommerce.ibm.com/inventory";
    public static readonly DEFAULT_URL_BASE = "http://jian.scpro.us:24200/ivproxy/inventory";

    public static readonly OATH_URL_SUFFIX: string = "oauth2/token";

    public static readonly OATH_REQUEST_BODY: string = "grant_type=client_credentials";


    public static readonly AVAILABILITY_NETWORK : string = "availability/network";
    public static readonly CONFIGURATION_DISTRIBUTIONGROUPS : string = "configuration/distributionGroups";
    public static readonly CONFIGURATION_SETTINGS : string = "configuration/settings";
    public static readonly CONFIGURATION_SHIPNODES : string = "configuration/shipNodes";
    public static readonly CONFIGURATION_THRESHOLDS : string = "configuration/thresholds";
    public static readonly DEMANDS : string = "demands";
    public static readonly RESERVATIONS : string = "reservations";
    public static readonly SUPPLIES : string = "supplies";

    public static readonly STORE_IV_INFO_AND_TOKEN : string = "iv_connection_info";
}