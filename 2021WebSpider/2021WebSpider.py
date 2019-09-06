import requests
import json
import os
import urllib
import threading
import re
from bs4 import BeautifulSoup

headers="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36";
downloadFail = [];
productDict = {
	"ID":175,
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
		r = requests.get(url, timeout=60);
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
	

def downloadProductsImage(key, productImgArray, nameHrefDict):
	tempProductImgArray = [];
	finalProductImgArray = [];
	key = key.replace(u' ', u'_');
	os.makedirs('./images/', exist_ok=True);
	os.makedirs('./images/%s/'%key, exist_ok=True);

	for hn in nameHrefDict:
		imgNum=0;
		for href in nameHrefDict[hn]:
			print("Downloading image: %s%d.jpeg"%(hn,imgNum));
			try:
				r = requests.get(href,timeout=10);
			except requests.exceptions.RequestException as e:
				requestOK = False;
				exceptionMs = str(e)
				print("Failed to request image: %s%d.jpeg address"%(hn,imgNum));
				for i in range(2):
					try:
						r = requests.get(href,timeout=5);
						requestOK = True;
						print("Success!");
						break;
					except Exception as e:
						print("Failed to request image: %s%d.jpeg address again %d"%(hn,imgNum,(i+2)));
				if not requestOK:
					downloadFail.append(href);
					print("Image:%s%d.jpeg %s"%(hn,imgNum,exceptionMs));
			with open('./images/%s/%s%d.jpeg'%(key,hn,imgNum), 'wb') as f:
				f.write(r.content);

			# folder_path = "./images/"+key
			# filename = str(hn) + str(imgNum)
			# urllib.request.urlretrieve(href , os.path.join(folder_path,filename) + '.jpeg')

			finalProductImgArray.append('%s%d.jpeg'%(hn,imgNum));
			imgNum += 1;
	print("Lenth of final: ",key,len(finalProductImgArray))
	return finalProductImgArray;


def getSingleProductDetailImgs(key,href, productDetailName):
	productDetailNameHrefDict = {};
	print("Fetching %s product detail images:"%(key));
	singleProductDetailImgs = [];
	detailPageText = getPageText(href);
	soup = BeautifulSoup(detailPageText,'lxml');
	thumbImgs = soup.findAll(class_ = 'thumb-image');
	detailImgs = soup.findAll(class_ = 'ProductItem-gallery-thumbnails-item-image');
	for di in detailImgs:
		singleProductDetailImgs.append(di.get('data-src'));
	for ti in thumbImgs:
		singleProductDetailImgs.append(ti.get('data-src'));

	productDetailNameHrefDict.update({productDetailName:singleProductDetailImgs});
	finalProductDetailImgArray = downloadProductsImage(key, singleProductDetailImgs, productDetailNameHrefDict);
	return finalProductDetailImgArray;



def getSingleProductDetailText(key,href):
	print("Fetching %s product detail text..."%(key));
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
		detailText = detailText.replace(u'\xa0', u' ');
		productTextDict["detailText"].append(detailText);

	variantOptionTitle = soup.find('div',{'class':'variant-option-title'});
	variantOptions = soup.findAll('option');
	if not variantOptionTitle is None :
		productTextDict["variantOptionTitle"] = variantOptionTitle.get_text();
		for vo in variantOptions:
			productTextDict["variantOptions"].append(vo.get_text());

	return productTextDict;
	

def getProductsDetails(key, pageText, productDetailPageArray, productNameArray):
	productDetailImgArray = [];
	productDetailTextArray = [];
	i = 0;
	
	for href in productDetailPageArray:
		productNameArray[i] += "_detail_";
		hrefArray = href.split('/');
	
		finalProductDetailImgArray = getSingleProductDetailImgs(key, href, productNameArray[i]);
		productDetailImgArray.append(finalProductDetailImgArray);
		productDetailTextArray.append(getSingleProductDetailText(key,href));
		i+=1;
	return productDetailTextArray,productDetailImgArray;


def makeDict(productImgHref, productName):
	outDict = {};
	fNameArray = [];
	finalNameArray = [];
	finalName = "";
	myNameTail = {};

	for name in productName:
		nameArray = name.split(' ');
		if not nameArray[0]=='':
			fNameArray.append(nameArray[0]);
		else:
			fNameArray.append(nameArray[1]);
	for i in range(len(productImgHref)):
		href = [];
		name = fNameArray[i];
		newName = ''.join(e for e in name if e.isalnum())
		if newName in finalNameArray:
			if newName not in myNameTail.keys():
				myNameTail.update({newName:0});
			finalName = newName + str(myNameTail[newName]);
			myNameTail[newName]+=1;
		else:
			finalName = newName;
		finalNameArray.append(finalName);
		href.append(productImgHref[i]);
		outDict.update({finalName:href});
	return finalNameArray, outDict;



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

	productDetailPageArray = [];
	products = soup.findAll(class_ = 'ProductList-item-link');
	for p in products:
		link = p.get('href')
		link = 'https://www.2021life.com' + link;
		productDetailPageArray.append(link);
	for href in productDetailPageArray:
		hrefArray = href.split('/');
		imgName = hrefArray[-1];
	productNameArray, homeImageNameHrefDict = makeDict(productImgArray, productTitleArray);
	finalProductImgArray = downloadProductsImage(key,productImgArray,homeImageNameHrefDict);
	productDetailTextArray,productDetailImgsArray = getProductsDetails(key,pageText,productDetailPageArray, productNameArray);

	for i in range(0,len(products)):
		productDict["ID"]+=1;
		productDict["name"]=productTitleArray[i];
		productDict["img"]=finalProductImgArray[i];
		productDict["price"]=productPriceArray[i];
		productDict["category"]=key;
		productDict["onSale"]=productSaleArray[i];
		productDict["soldOut"]=productSoldArray[i];
		productDict["detailText"]=productDetailTextArray[i];
		productDict["detailImgs"]=productDetailImgsArray[i];
		print("Writing %s product No.%d"%(key,i));
		writeJson(key);


def writeJson(key):
	key = key.replace(u' ', u'_');
	try:	
		os.makedirs('./dataModel/', exist_ok=True);
		with open("dataModel/%s.json"%key,"a+") as f:
			json.dump(productDict,f,indent = 4);
	except:
		return "ERR";

def initialization():
	productDict = {
	"ID":175,
	"name":"",
	"img":"",
	"category":"",
	"price":"",
	"onSale":False,
	"soldOut":False,
	"detailText":{},
	"detailImgs":[]
	}
	downloadFail = [];

def go(categoryDict):
	for key in categoryDict:
		initialization();
		if (key == 'Kitchen'):
			url = categoryDict[key];
			pageText=getPageText(url);
			productThread = threading.Thread(target = getProductInfo, args = (key, pageText));
			productThread.start();

if __name__ == "__main__":
	homeUrl= "https://2021life.com";
	homePageText = getPageText(homeUrl);
	categoryDict = getAllCategory(homePageText);
	go(categoryDict);
	print("Fail to download: ",downloadFail);

