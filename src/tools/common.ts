export const tUid = {
  pointer: 0,
  cleateId(key = ''){
    this.pointer++
    const id = Math.random().toFixed(10)+Date.now()+'-'+this.pointer
    return key+id;
  }
}