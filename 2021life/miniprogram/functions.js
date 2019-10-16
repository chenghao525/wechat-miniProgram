
module.exports.getCorrectImgUrl = function (productList){
  for (let product in productList) {
    let productCategory = productList[product].category.toLowerCase();
    productCategory = productCategory.replace(" ", "_");
    productList[product].img = `cloud://cloud2021-01.636c-cloud2021-01-1300062627/${productCategory}/` + productList[product].img;
  }
  return productList;
}


module.exports.getCorrectCategoryName = function (options){
  let productCategory = options.toLowerCase();
  productCategory = productCategory.replace(" ", "_");
  return productCategory;
}