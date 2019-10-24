//Convert image URL to the cloud database path URL
//@Param: list of URL
//@Output: list of modified URL
module.exports.getCorrectImgUrl = function (productList){
  for (let index in productList) {
    let productCategory = productList[index].category.toLowerCase();
    productCategory = productCategory.replace(" ", "_");
    productList[index].img = `cloud://cloud2021-01.636c-cloud2021-01-1300062627/${productCategory}/` + productList[index].img;
    for(let imgIndex in productList[index].detailImgs){
      productList[index].detailImgs[imgIndex] = `cloud://cloud2021-01.636c-cloud2021-01-1300062627/${productCategory}/` + productList[index].detailImgs[imgIndex];
      console.log(productList[index].detailImgs[imgIndex])
    }
  }
  return productList;
}


module.exports.getCorrectCategoryName = function (options){
  let productCategory = options.toLowerCase();
  productCategory = productCategory.replace(" ", "_");
  return productCategory;
}