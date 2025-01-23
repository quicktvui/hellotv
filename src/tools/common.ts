export const tUid = {
  pointer: 0,
  cleateId(key = ''){
    this.pointer++
    return key+Date.now() + Math.random().toFixed(10)+'-'+this.pointer;
  }
}