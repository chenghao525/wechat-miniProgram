import requests
import json
import os
from bs4 import BeautifulSoup

headers="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36";
imgNum = 0;
productDict = {
	"ID":0,
	"name":"",
	"img":"",
	"category":"",
	"price":"",
	"onSale":False,
	"soldOut":False,
	"detailText":{},
	"detailImgs":[]
}

def getPageText(url):
	try:
		print("Requesting: %s..."%(url));
		r = requests.get(url, timeout=300);
		r.raise_for_status();
		r.encoding = r.apparent_encoding;
		print("Done");
		return r.text;
	except:
		return "Err Occur";


def getAllCategory(pageText):
	print("Getting Product categories...");
	categoryDict = {};
	soup = BeautifulSoup(pageText,'lxml');
	category = soup.findAll(class_ = 'nav-item-products');

	for a in category:
		name = a.get_text();
		href = a.get('href');
		name=name.strip();
		href = 'https://www.2021life.com' + href;
		categoryDict.update({name:href});
	return categoryDict;
	

def downloadProductsImage(key,productImgArray):
	global imgNum;
	finalProductImgArray = [];
	os.makedirs('./images/', exist_ok=True);
	os.makedirs('./images/%s/'%key, exist_ok=True);
	for pi in productImgArray:
		r = requests.get(pi);
		with open('./images/%s/%s%d.jpg'%(key,key,imgNum), 'wb') as f:
			f.write(r.content);
		finalProductImgArray.append('%s%d.jpg'%(key,imgNum));
		imgNum+=1; 
		print("Downloading image: %s%d.jpg"%(key,imgNum));
	return finalProductImgArray;

def getSingleProductDetailImgs(key,href):
	print("Requesting %s product detail images:"%(key));
	singleProductDetailImgs = [];
	detailPageText = getPageText(href);
	soup = BeautifulSoup(detailPageText,'lxml');
	thumbImgs = soup.findAll(class_ = 'thumb-image');
	detailImgs = soup.findAll(class_ = 'ProductItem-gallery-thumbnails-item-image');
	for di in detailImgs:
		singleProductDetailImgs.append(di.get('data-src'));
	for ti in thumbImgs:
		singleProductDetailImgs.append(ti.get('data-src'));

	finalProductDetailImgArray = downloadProductsImage(key, singleProductDetailImgs);
	return finalProductDetailImgArray;

def getSingleProductDetailText(key,href):
	print("Requesting %s product detail text..."%(key));
	productTextDict = {
		"variantOptionTitle":"",
		"variantOptions":[],
		"detailText":[]
	};
	detailPageText = getPageText(href);
	soup = BeautifulSoup(detailPageText,'lxml');
	detailTextDiv = soup.find('div',{'class':'ProductItem-details-excerpt'});
	newSoup = BeautifulSoup(str(detailTextDiv),'lxml');
	for p in newSoup.findAll('p'):
		detailText = p.get_text();
		detailText = detailText.replace(u'\xa0', u' ')
		productTextDict["detailText"].append(detailText);

	variantOptionTitle = soup.find('div',{'class':'variant-option-title'});
	variantOptions = soup.findAll('option');
	if not variantOptionTitle is None :
		productTextDict["variantOptionTitle"] = variantOptionTitle.get_text();
		for vo in variantOptions:
			productTextDict["variantOptions"].append(vo.get_text());

	return productTextDict;
	

def getProductsDetails(key, pageText):
	productDetailPageArray = [];
	productDetailImgArray = [];
	productDetailTextArray = [];
	soup = BeautifulSoup(pageText,'lxml');
	products = soup.findAll(class_ = 'ProductList-item-link');
	for p in products:
		link = p.get('href')
		link = 'https://www.2021life.com' + link;
		productDetailPageArray.append(link);
	for href in productDetailPageArray:
		productDetailImgArray.append(getSingleProductDetailImgs(key,href));
		productDetailTextArray.append(getSingleProductDetailText(key,href));
	return productDetailTextArray,productDetailImgArray;


def getProductInfo(key, pageText):
	productDict["category"] = key;
	soup = BeautifulSoup(pageText,'lxml');
	products = soup.findAll(class_ = 'ProductList-item-link');

	productTitleArray =[];
	products_title = soup.findAll(class_ = 'ProductList-title');
	for pt in products_title:
		productTitleArray.append(pt.get_text());

	productImgArray = [];
	product_img = soup.findAll(class_ = 'ProductList-innerImageWrapper sqs-pinterest-image');
	for pi in product_img:
		productImgArray.append(pi.img.get('data-src'));

	productPriceArray = [];
	product_price = soup.findAll(class_ = 'product-price');
	for pp in product_price:
		productPriceArray.append(pp.span.get_text());

	productSaleArray = [];
	product_sale = soup.findAll(class_ = 'ProductList-statusWrapper sqs-product-mark-wrapper');
	for ps in product_sale:
		if ps.findAll(class_ = 'product-mark sale'):
			productSaleArray.append(True);
		else:
			productSaleArray.append(False);

	productSoldArray = [];
	product_sold = soup.findAll(class_ = 'ProductList-statusWrapper sqs-product-mark-wrapper');
	for ps in product_sold:
		if ps.findAll(class_ = 'product-mark sold-out'):
			productSoldArray.append(True);
		else:
			productSoldArray.append(False);

	finalProductImgArray = downloadProductsImage(key,productImgArray);
	
	productDetailTextArray,productDetailImgsArray=getProductsDetails(key,pageText);

	for i in range(0,len(products)):
		productDict["ID"]+=1;
		productDict["name"]=productTitleArray[i];
		productDict["img"]=finalProductImgArray[i];
		productDict["price"]=productPriceArray[i];
		productDict["onSale"]=productSaleArray[i];
		productDict["soldOut"]=productSoldArray[i];
		productDict["detailText"]=productDetailTextArray[i];
		productDict["detailImgs"]=productDetailImgsArray[i];
		print("Wring %s product No.%d"%(key,productDict["ID"]));
		writeJson(key);
		


def writeJson(key):
	try:	
		with open("dataModel/%s.json"%key,"a+") as f:
			json.dump(productDict,f,indent = 4);
	except:
		return "ERR";


def go(categoryDict):
	# for key in categoryDict:
	# 	url = categoryDict[key];
	# 	pageText=getPageText(url);
	# 	getProductInfo(key, pageText);
	url = categoryDict['Bedroom'];
	pageText=getPageText(url);
	getProductInfo('Bedroom', pageText);




if __name__ == "__main__":
	homeUrl= "https://2021life.com";
	homePageText = getPageText(homeUrl);
	categoryDict = getAllCategory(homePageText);
	go(categoryDict);