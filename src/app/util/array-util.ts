export class ArrayUtil {

    /**
     * Remove an element from an array. This function performs the removal
     * in place. The function removes the objectToRemove, if found, from
     * arrayToRemoveFrom directly. It does NOT return a new array.
     * @param arrayToRemoveFrom the array to remove the object from
     * @param objectToRemove the object to remove
     */
    public static removeObjectFromArray<T>(arrayToRemoveFrom: T[], objectToRemove: T): void{
        
        const index: number = arrayToRemoveFrom.indexOf(objectToRemove);
        
        if (index !== -1) {
            arrayToRemoveFrom.splice(index, 1);
        }   
    }

    public static findAndRemoveFromArray<T>(arrayToRemoveFrom: T[], prediction: (itemToCheck:T)=>boolean): void{
        
        const index: number = arrayToRemoveFrom.findIndex( itemToCheck => prediction(itemToCheck) );

        if (index !== -1) {
            arrayToRemoveFrom.splice(index, 1);
        }   
    }

}