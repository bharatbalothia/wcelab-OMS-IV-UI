
export class ObjectUtil {

  public static removeNullOrEmptyStringProperties<T>(objectToTrim: T, trimSpaceString: boolean = true, recursive: boolean = true): void {

    var propNames = Object.getOwnPropertyNames(objectToTrim);

    console.debug("Checking propNames of: ", propNames);

    for (var i = 0; i < propNames.length; i++) {
      var propName = propNames[i];
      const propToCheck = objectToTrim[propName];

      if (propToCheck === null || propToCheck === undefined || 
        (trimSpaceString && typeof propToCheck === "string" && propToCheck.trim() === '')) {
        delete objectToTrim[propName];
      } else if (recursive) {
        // Recursive into properties for Array and Object (anything not simple type)
        if (propToCheck instanceof Array) { // Deal with Array separately to be proper. The code works without this check since [] is Object with properties of "length", "0", "1", "2", ...
          for (let item of propToCheck) {
            ObjectUtil.removeNullOrEmptyStringProperties<typeof item>(item, trimSpaceString, recursive);  
          }
        }
        else if (propToCheck instanceof Object) {
          ObjectUtil.removeNullOrEmptyStringProperties<typeof propToCheck>(propToCheck, trimSpaceString, recursive);
        }
      }
      
    }

  }

}