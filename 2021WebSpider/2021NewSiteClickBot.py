import requests
from bs4 import BeautifulSoup


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
	

	print(category[1])
	for a in category:
		name = a.get_text();
		href = a.get('href');
		name=name.strip();
		categoryDict.update({name:href});
	
	print(categoryDict)
	return categoryDict;


if __name__ == "__main__":
	homeUrl= "https://2021life.com";
	homePageText = getPageText(homeUrl);
	categoryDict = getAllCategory(homePageText);
	# go(categoryDict);