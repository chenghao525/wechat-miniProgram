import requests
import threading
import urllib.request
from bs4 import BeautifulSoup


opener = urllib.request.build_opener()


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
	category = soup.findAll(class_ = 'menu-item');

	for ca in category:
		newSoup = BeautifulSoup(str(ca),'lxml');
		for a in newSoup.findAll('a'):
			name = a.get_text();
			print("Getting ",name,"...");
			href = a.get('href');
			name=name.strip();
			categoryDict.update({name:href});

	return categoryDict;



def getUsefulCategoryDict(categoryDict):
	newDict={}
	newDict["BEDROOM"]=categoryDict["BEDROOM"]
	newDict["BATHROOM"]=categoryDict["BATHROOM"]
	newDict["KITCHEN"]=categoryDict["KITCHEN"]
	newDict["ARTISTIC"]=categoryDict["ARTISTIC"]
	newDict["FUN"]=categoryDict["FUN"]
	newDict["CLOTHING"]=categoryDict["CLOTHING"]
	return newDict

def simulateOpenUrl(url,category):
	try:
		print("Opening:",category,"==>", url)
		opener.open(url)
	except urllib.error.HTTPError:
		print('urllib.error.HTTPError')
	except urllib.error.URLError:
		print('urllib.error.URLError')


def browseSingleCategory(singleCategoryText,category):
	productLinkList=[]
	soup = BeautifulSoup(singleCategoryText,'lxml');
	productList = soup.findAll(class_ = 'woocommerce-LoopProduct-link woocommerce-loop-product__link');
	for pl in productList:
		link = pl.get('href')
		productLinkList.append(link)
	for url in productLinkList:
		urlThreading=threading.Thread(target = simulateOpenUrl, args =  (url,category))
		urlThreading.start()


def browse(newCategoryDict):
	for key in newCategoryDict:
		# if(key=="KITCHEN"):
		simulateOpenUrl(newCategoryDict[key],key)
		singleCategoryText=getPageText(newCategoryDict[key])
		categoryThread=threading.Thread(target = browseSingleCategory, args =  (singleCategoryText,key))
		categoryThread.start()


if __name__ == "__main__":
	times=int(input("How many times you want me to browse 2021life.com?"))
	homeUrl = "https://2021life.com";
	homePageText = getPageText(homeUrl);
	categoryDict = getAllCategory(homePageText);
	newCategoryDict = getUsefulCategoryDict(categoryDict);
	while(times>0):
		print("Times left: ",times)
		simulateOpenUrl(homeUrl,"Home")
		browse(newCategoryDict);
		print("No error, process complete!")
		times-=1