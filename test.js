function isString(val){
  return typeof val == 'string'
}

function test(val){
  try {
    if(isString(val)) {
      console.log('string')
    }
  } catch (error) {
    console.log(error, 'err')
  }
  console.log('123')
}
test('str')